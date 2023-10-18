# 环境
NODE_ENV = production

# 接口前缀
VITE_API_BASEPATH = "pro"

# 是否隐藏首页 隐藏 true 不隐藏 false （勿删除）
VITE_HIDE_HOME = false

# 生产环境打包目录
VITE_OUT_DIR = "./dist-pro"

# 生产环境平台打包路径
VITE_PUBLIC_PATH = "/admin/"

# 生产环境路由历史模式（Hash模式传"hash"、HTML5模式传"h5"、Hash模式带base参数传"hash,base参数"、HTML5模式带base参数传"h5,base参数"）
VITE_ROUTER_HISTORY = "h5,/admin/"

# 是否在打包时使用cdn替换本地库 替换 true 不替换 false
VITE_CDN = false

# 是否启用gzip压缩或brotli压缩（分两种情况，删除原始文件和不删除原始文件）
# 压缩时不删除原始文件的配置：gzip、brotli、both（同时开启 gzip 与 brotli 压缩）、none（不开启压缩，默认）
# 压缩时删除原始文件的配置：gzip-clear、brotli-clear、both-clear（同时开启 gzip 与 brotli 压缩）、none（不开启压缩，默认）
VITE_COMPRESSION = "both"
