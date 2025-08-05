import fs from "fs";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join, relative, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgDir = resolve(__dirname, "../src/assets/xmind/svg");
const imgDir = resolve(__dirname, "../src/assets/xmind/images");

/**
 * 递归转换SVG文件为PNG图片
 */
async function convertSvgsToPng() {
  try {
    // 创建输出目录（如果不存在）
    await fs.promises.mkdir(imgDir, { recursive: true });
    console.log(`输出目录已准备: ${imgDir}`);

    // 递归处理目录
    await processDirectory(svgDir);
    console.log("所有SVG文件转换完成！");
  } catch (error) {
    console.error("转换过程出错:", error);
    process.exit(1);
  }
}

/**
 * 处理单个目录中的所有文件和子目录
 * @param {string} currentDir - 当前处理的目录路径
 */
async function processDirectory(currentDir) {
  const entries = await fs.promises.readdir(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(currentDir, entry.name);
    const relativePath = relative(svgDir, currentDir);
    const outputSubDir = join(imgDir, relativePath);

    if (entry.isDirectory()) {
      // 创建对应的输出子目录
      await fs.promises.mkdir(join(outputSubDir, entry.name), { recursive: true });
      // 递归处理子目录
      await processDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".svg")) {
      // 处理SVG文件
      const outputFilePath = join(outputSubDir, entry.name.replace(".svg", ".png"));
      await sharp(fullPath)
        .png() // 转换为PNG格式
        .resize(100, 100) // 保持与原SVG相同尺寸
        .toFile(outputFilePath);
      console.log(`已转换: ${relativePath}/${entry.name} -> ${relativePath}/${entry.name.replace(".svg", ".png")}`);
    }
  }
}

// 启动转换
convertSvgsToPng();
