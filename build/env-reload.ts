// plugins/env-reload.ts
import type { Plugin } from "vite";
import fs from "fs";
import path from "path";

export function envReload(): Plugin {
  return {
    name: "env-reload",
    configureServer(server) {
      // 监听所有 .env 文件
      const envFiles = [".env", ".env.development", ".env.production", ".env.staging", ".env.test"];

      envFiles.forEach(file => {
        const filePath = path.resolve(process.cwd(), file);
        if (fs.existsSync(filePath)) {
          server.watcher.add(filePath);
        }
      });

      server.watcher.on("change", async changedPath => {
        if (changedPath.includes(".env")) {
          console.log(`🔄 环境变量文件 ${path.basename(changedPath)} 已修改`);

          try {
            // 1. 强制清除 node_modules/.vite 缓存
            const viteCachePath = path.resolve(process.cwd(), "node_modules", ".vite");
            if (fs.existsSync(viteCachePath)) {
              fs.rmSync(viteCachePath, { recursive: true, force: true });
              console.log("✅ Vite 缓存已清理");
            }

            // 2. 清除 process.env 中的 VITE_ 变量
            Object.keys(process.env).forEach(key => {
              if (key.startsWith("VITE_")) {
                delete process.env[key];
              }
            });

            // 3. 强制重启
            setTimeout(() => {
              server.ws.send({
                type: "full-reload",
                path: "*",
              });
            }, 500);
          } catch (error) {
            console.error("❌ 重启失败:", error);
          }
        }
      });
    },
  };
}
