import { PROJECT_PREFIX } from "@/utils/common";

const config: {
  /** api请求基础路径 */
  base_url: {
    /** 开发环境接口前缀 */
    dev: string;
    /** 打包生产环境接口前缀 */
    pro: string;
    /** 打包测试环境接口前缀 */
    test: string;
  };
  /** 接口成功返回状态码 */
  result_code: number | string;
  /** 请求超时时间 */
  timeout: number;
  /** 登录TOKEN */
  TOKEN_KEY: any;
  /** 验证码 */
  SINGLE_CAPTCHA: any;
  /** COOKIE 登录TOKEN */
  COOKIE_TOKEN_KEY: any;
  /** COOKIE 验证码 */
  COOKIE_SINGLE_CAPTCHA: any;
} = {
  base_url: {
    // dev: "/dev-api",
    // dev: "http://localhost:4000/frame_base",
    dev: "http://47.96.19.146:4000/frame_base",

    // pro: "/pro-api",
    pro: "http://47.96.19.146:4000/frame_base",

    test: "/test-api"
    // test: "http://localhost:4000/frame_base"
  },
  result_code: "0",

  timeout: 30000,

  TOKEN_KEY: "Authorization",

  SINGLE_CAPTCHA: "_single_captcha_",

  COOKIE_TOKEN_KEY: PROJECT_PREFIX + "Authorization",

  COOKIE_SINGLE_CAPTCHA: PROJECT_PREFIX + "_single_captcha_"
};

export { config };
