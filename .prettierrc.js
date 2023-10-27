module.exports = {
  // 每次修改prettier配置项需要重新打开vscode才会生效
  bracketSpacing: true,
  semi: true, // 分号
  tabWidth: 2, // 缩进
  printWidth: 130, // 行宽
  singleQuote: false, // 使用双引号
  trailingComma: "none", // 后置逗号，多行对象、数组在最后一行是否增加逗号
  arrowParens: "avoid", // 箭头函数只有一个参数的时候可以忽略括号
  endOfLine: "lf" // 结尾是 \n lf | \r cr | \n\r crlf | auto
};
