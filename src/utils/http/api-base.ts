import type { PureHttpError, RequestMethods, PureHttpResponse, PureHttpRequestConfig } from "./types.d";
import Axios, { AxiosInstance, AxiosRequestConfig, CustomParamsSerializer } from "axios";
import { stringify } from "qs";
import { config } from "./config";
import NProgress from "../progress";
import { msg } from "@/utils/message";
import { useUserStoreHook } from "@/store/modules/user";
import { getToken, setToken, getCookie, getSingleCaptcha } from "@/utils/auth";
import { getConfig, PLATFORM_PREFIX, LOGIN_TIMES, LOGIN_EXPIRE_MINUTES } from "@/config";

const { result_code, base_url, timeout, SINGLE_CAPTCHA, TOKEN_KEY } = config;
export const PATH_URL = base_url[import.meta.env.VITE_API_BASEPATH];

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
  // api 的 base_url
  baseURL: getConfig().MockRequest ? "" : PATH_URL,
  // 请求超时时间
  timeout,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  },
  // 跨域携带token
  withCredentials: true,
  // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer
  }
};

class PureHttp {
  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  /** token过期后，暂存待执行的请求 */
  private static requests = [];

  /** 防止重复刷新token */
  private static isRefreshing = false;

  /** 初始化配置对象 */
  private static initConfig: PureHttpRequestConfig = {};

  /** 保存当前Axios实例对象 */
  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);

  /** 重连原始请求 */
  private static retryOriginalRequest(config: PureHttpRequestConfig) {
    return new Promise(resolve => {
      PureHttp.requests.push(() => {
        config.headers[SINGLE_CAPTCHA] = getCookie(PLATFORM_PREFIX + SINGLE_CAPTCHA);
        resolve(config);
      });
    });
  }

  /** 请求拦截 */
  private httpInterceptorsRequest(): void {
    PureHttp.axiosInstance.interceptors.request.use(
      async (config: PureHttpRequestConfig): Promise<any> => {
        if (import.meta.env.VITE_API_BASEPATH === "pro") {
          if (
            config.method !== "get" &&
            !(
              config.url.includes("/login") ||
              config.url.includes("/change/token") ||
              config.url.includes("/users/switchUserCorp")
            )
          ) {
            msg.warning("模拟环境，禁止操作！");
            return;
          }
        }
        if (getConfig().MockRequest) {
          config.url.includes("login")
            ? (config.url = config.url.replace("/login", "/mock-api/login"))
            : (config.url = config.url.replace("/api", "/mock-api"));
        }
        // console.log(config);
        // 开启进度条动画
        NProgress.start();
        // 携带授权信息
        getToken() && (config.headers[TOKEN_KEY] = getToken());
        getSingleCaptcha() && (config.headers[SINGLE_CAPTCHA] = getSingleCaptcha());
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof config.beforeRequestCallback === "function") {
          config.beforeRequestCallback(config);
          return config;
        }
        if (PureHttp.initConfig.beforeRequestCallback) {
          PureHttp.initConfig.beforeRequestCallback(config);
          return config;
        }
        /** 请求白名单，放置一些不需要token的接口（通过设置请求白名单，防止token过期后再请求造成的死循环问题） */
        const whiteList = ["/login", "/captcha"];
        return whiteList.some(v => config.url.indexOf(v) > -1)
          ? config
          : new Promise(resolve => {
              const data = getToken();
              if (data) {
                const leftTime = parseInt(+getCookie(LOGIN_EXPIRE_MINUTES) - (Date.now() - +getCookie(LOGIN_TIMES)) / 1000 / 60);
                console.log(`token将在${leftTime}分钟后失效，`);
                // 还有30分钟过期
                if (((leftTime > 0 && leftTime <= 30) || isNaN(leftTime)) && !config.url.includes("/change/token")) {
                  if (!PureHttp.isRefreshing) {
                    PureHttp.isRefreshing = true;
                    // token过期刷新
                    useUserStoreHook()
                      .changeToken()
                      .then(() => {
                        PureHttp.requests.forEach(cb => cb());
                        PureHttp.requests = [];
                      })
                      .finally(() => {
                        PureHttp.isRefreshing = false;
                      });
                  }
                  resolve(PureHttp.retryOriginalRequest(config));
                } else {
                  resolve(config);
                }
              } else {
                resolve(config);
              }
            });
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  /** 响应拦截 */
  private httpInterceptorsResponse(): void {
    const instance = PureHttp.axiosInstance;
    instance.interceptors.response.use(
      async (response: PureHttpResponse) => {
        // console.log(response);
        const $config = response.config || {};
        const { data } = response;
        // 关闭进度条动画
        NProgress.done();
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof $config.beforeResponseCallback === "function") {
          $config.beforeResponseCallback(response);
          return data;
        }
        if (PureHttp.initConfig.beforeResponseCallback) {
          PureHttp.initConfig.beforeResponseCallback(response);
          return data;
        }
        // 判断返回code码
        if (data.code !== result_code) {
          if (data.code === "err.session" || data.code === "authorization.unauthorized") {
            useUserStoreHook().resetToken();
            location.reload();
          } else {
            data.message && msg.error(data.message);
            return Promise.reject();
          }
        } else {
          // 存储授权信息
          if (response.headers[TOKEN_KEY.toLocaleLowerCase()]) {
            const token = response.headers[TOKEN_KEY.toLocaleLowerCase()] || response.headers[TOKEN_KEY];
            token ? setToken(token) : msg.warning("token获取失败");
          }
          return data;
        }
      },
      (error: PureHttpError) => {
        if (error) {
          const $error = error;
          $error.isCancelRequest = Axios.isCancel($error);
          // 关闭进度条动画
          NProgress.done();
          // 所有的响应异常 区分来源为取消请求/非取消请求
          return Promise.reject($error);
        }
      }
    );
  }

  /** 通用请求工具函数 */
  public request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: PureHttpRequestConfig
  ): Promise<PureResponse<T>> {
    const config = {
      method,
      url,
      ...param,
      ...axiosConfig
    } as PureHttpRequestConfig;

    // 单独处理自定义请求/响应回调
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .request(config)
        .then((response: undefined) => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}

export const http = new PureHttp();
