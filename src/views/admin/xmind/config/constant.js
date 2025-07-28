// @ts-nocheck

//  布局结构图片映射
export const layoutImgMap = {
  logicalStructure: import("@/assets/xmind/img/structures/logicalStructure.png"),
  mindMap: import("@/assets/xmind/img/structures/mindMap.png"),
  organizationStructure: import("@/assets/xmind/img/structures/organizationStructure.png"),
  catalogOrganization: import("@/assets/xmind/img/structures/catalogOrganization.png"),
  timeline: import("@/assets/xmind/img/structures/timeline.png"),
  timeline2: import("@/assets/xmind/img/structures/timeline2.png"),
  fishbone: import("@/assets/xmind/img/structures/fishbone.png"),
  verticalTimeline: import("@/assets/xmind/img/structures/verticalTimeline.png"),
};

//  主题图片映射
export const themeMap = {
  default: import("@/assets/xmind/img/themes/default.jpg"),
  classic: import("@/assets/xmind/img/themes/classic.jpg"),
  minions: import("@/assets/xmind/img/themes/minions.jpg"),
  pinkGrape: import("@/assets/xmind/img/themes/pinkGrape.jpg"),
  mint: import("@/assets/xmind/img/themes/mint.jpg"),
  gold: import("@/assets/xmind/img/themes/gold.jpg"),
  vitalityOrange: import("@/assets/xmind/img/themes/vitalityOrange.jpg"),
  greenLeaf: import("@/assets/xmind/img/themes/greenLeaf.jpg"),
  dark2: import("@/assets/xmind/img/themes/dark2.jpg"),
  skyGreen: import("@/assets/xmind/img/themes/skyGreen.jpg"),
  classic2: import("@/assets/xmind/img/themes/classic2.jpg"),
  classic3: import("@/assets/xmind/img/themes/classic3.jpg"),
  classic4: import("@/assets/xmind/img/themes/classic4.jpg"),
  classicGreen: import("@/assets/xmind/img/themes/classicGreen.jpg"),
  classicBlue: import("@/assets/xmind/img/themes/classicBlue.jpg"),
  blueSky: import("@/assets/xmind/img/themes/blueSky.jpg"),
  brainImpairedPink: import("@/assets/xmind/img/themes/brainImpairedPink.jpg"),
  dark: import("@/assets/xmind/img/themes/dark.jpg"),
  earthYellow: import("@/assets/xmind/img/themes/earthYellow.jpg"),
  freshGreen: import("@/assets/xmind/img/themes/freshGreen.jpg"),
  freshRed: import("@/assets/xmind/img/themes/freshRed.jpg"),
  romanticPurple: import("@/assets/xmind/img/themes/romanticPurple.jpg"),
  simpleBlack: import("@/assets/xmind/img/themes/simpleBlack.jpg"),
  courseGreen: import("@/assets/xmind/img/themes/courseGreen.jpg"),
  coffee: import("@/assets/xmind/img/themes/coffee.jpg"),
  redSpirit: import("@/assets/xmind/img/themes/redSpirit.jpg"),
  blackHumour: import("@/assets/xmind/img/themes/blackHumour.jpg"),
  lateNightOffice: import("@/assets/xmind/img/themes/lateNightOffice.jpg"),
  blackGold: import("@/assets/xmind/img/themes/blackGold.jpg"),
  autumn: import("@/assets/xmind/img/themes/autumn.jpg"),
  avocado: import("@/assets/xmind/img/themes/avocado.jpg"),
  orangeJuice: import("@/assets/xmind/img/themes/orangeJuice.jpg"),
  oreo: import("@/assets/xmind/img/themes/oreo.jpg"),
  shallowSea: import("@/assets/xmind/img/themes/shallowSea.jpg"),
  lemonBubbles: import("@/assets/xmind/img/themes/lemonBubbles.jpg"),
  rose: import("@/assets/xmind/img/themes/rose.jpg"),
  seaBlueLine: import("@/assets/xmind/img/themes/seaBlueLine.jpg"),
  neonLamp: import("@/assets/xmind/img/themes/neonLamp.jpg"),
  darkNightLceBlade: import("@/assets/xmind/img/themes/darkNightLceBlade.jpg"),
  morandi: import("@/assets/xmind/img/themes/morandi.jpg"),
  classic5: import("@/assets/xmind/img/themes/classic5.jpg"),
  dark3: import("@/assets/xmind/img/themes/dark3.jpg"),
  dark4: import("@/assets/xmind/img/themes/dark4.jpg"),
  cactus: import("@/assets/xmind/img/themes/cactus.jpg"),
};

// 公式列表
export const formulaList = [
  "a^2",
  "a_2",
  "a^{2+2}",
  "a_{i,j}",
  "x_2^3",
  "\\overbrace{1+2+\\cdots+100}",
  "\\sum_{k=1}^N k^2",
  "\\lim_{n \\to \\infty}x_n",
  "\\int_{-N}^{N} e^x\\, dx",
  "\\sqrt{3}",
  "\\sqrt[n]{3}",
  "\\sin\\theta",
  "\\log X",
  "\\log_{10}",
  "\\log_\\alpha X",
  "\\lim_{t\\to n}T",
  "\\frac{1}{2}=0.5",
  "\\binom{n}{k}",
  "\\begin{matrix}x & y \\\\z & v\\end{matrix}",
  "\\begin{cases}3x + 5y +  z \\\\7x - 2y + 4z \\\\-6x + 3y + 2z\\end{cases}",
];

export const supportLineStyleLayoutsMap = {
  curve: ["logicalStructure", "mindMap", "verticalTimeline"],
  direct: ["logicalStructure", "mindMap", "organizationStructure", "verticalTimeline"],
};

export const supportLineRadiusLayouts = ["logicalStructure", "mindMap", "verticalTimeline"];

export const supportNodeUseLineStyleLayouts = ["logicalStructure", "mindMap", "catalogOrganization", "organizationStructure"];

export const supportRootLineKeepSameInCurveLayouts = ["logicalStructure", "mindMap"];
