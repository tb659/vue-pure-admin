// @see: https://cz-git.qbenben.com/zh/guide
/** @type {import('cz-git').UserConfig} */
export default {
  // 忽略特定的commit消息
  ignores: [commit => commit === "init"],
  // 继承标准的commitlint配置
  extends: ["@commitlint/config-conventional"],
  // commit消息的校验规则
  rules: {
    // @see: https://commitlint.js.org/#/reference-rules
    // body部分必须以空行开始
    "body-leading-blank": [2, "always"],
    // footer部分必须以空行开始
    "footer-leading-blank": [1, "always"],
    // header部分最大长度限制
    "header-max-length": [2, "always", 108],
    // subject不能为空
    "subject-empty": [2, "never"],
    // type不能为空
    "type-empty": [2, "never"],
    // subject的大小写不做限制
    "subject-case": [0],
    // 定义允许的commit类型
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
        "revert",
        "wip",
        "workflow",
        "types",
        "release",
      ],
    ],
  },
  // 交互式提示的配置
  prompt: {
    // 提示信息的中文翻译
    messages: {
      type: "选择你要提交的类型 :",
      scope: "选择一个提交范围（可选）:",
      customScope: "请输入自定义的提交范围 :",
      subject: "填写简短精炼的变更描述 :\n",
      body: '填写更加详细的变更描述（可选）。使用 "|" 换行 :\n',
      markBreaking: "是否有任何重大变更（添加“！“在头部中）（可选）？",
      breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行 :\n',
      footerPrefixsSelect: "选择关联issue前缀（可选）:",
      customFooterPrefixs: "输入自定义issue前缀 :",
      footer: "列举关联issue (可选) 例如: #31, #I3244 :\n",
      generatingByAI: "正在自动生成提交主题...",
      generatedSelectByAI: "自动生成的主题中选择适合者",
      confirmCommit: "是否提交或修改commit ?",
    },
    // 定义commit类型及其描述
    types: [
      { value: "feat: 新增", name: "新增:   🚀  新增功能", emoji: "🚀 " },
      { value: "fix: 修复", name: "修复:   🧩  修复缺陷", emoji: "🧩 " },
      { value: "docs: 文档", name: "文档:   📚  文档变更", emoji: "📚 " },
      { value: "style: 格式", name: "格式:   🎨  代码格式、页面样式（不影响功能，如空格、分号等格式、样式修正）", emoji: "🎨 " },
      { value: "refactor: 重构", name: "重构:   ♻️  代码重构（不包括 bug 修复、功能新增）", emoji: "♻️ " },
      { value: "perf: 优化", name: "优化:   ⚡️  性能优化，页面优化", emoji: "⚡️ " },
      { value: "test: 测试", name: "测试:   ✅  添加疏漏测试或已有测试改动", emoji: "✅ " },
      { value: "build: 打包", name: "打包:   🔨  项目打包部署上线", emoji: "🔨 " },
      { value: "ci: 集成", name: "集成:   🎡  修改 CI 配置、脚本", emoji: "🎡 " },
      { value: "chore: 构建", name: "构建:   📦️  构建流程、外部依赖变更（如升级 npm 包、修改 vite 配置等）", emoji: "📦️ " },
      { value: "revert: 回退", name: "回退:   ⏪️  回滚 commit", emoji: "⏪️ " },
      { value: "types: 类型", name: "类型:   🔖  ts类型注解", emoji: "🔖 " },
    ],
    // 使用emoji表情
    useEmoji: true,
    // 主题颜色代码
    themeColorCode: "",
    // 提交范围
    scopes: [],
    // 允许自定义范围
    allowCustomScopes: true,
    // 允许空范围
    allowEmptyScopes: true,
    // 自定义范围的对齐方式
    customScopesAlign: "bottom",
    // 自定义范围的别名
    customScopesAlias: "custom",
    // 空范围的别名
    emptyScopesAlias: "empty",
    // subject是否大写
    upperCaseSubject: false,
    // 允许重大变更的类型
    allowBreakingChanges: ["feat", "fix"],
    // 换行字符数
    breaklineNumber: 100,
    // 换行字符
    breaklineChar: "|",
    // 跳过的问题
    skipQuestions: [],
    // issue前缀
    issuePrefixs: [{ value: "closed", name: "closed:   ISSUES has been processed" }],
    // 自定义issue前缀的对齐方式
    customIssuePrefixsAlign: "top",
    // 空issue前缀的别名
    emptyIssuePrefixsAlias: "skip",
    // 自定义issue前缀的别名
    customIssuePrefixsAlias: "custom",
    // 允许自定义issue前缀
    allowCustomIssuePrefixs: true,
    // 允许空issue前缀
    allowEmptyIssuePrefixs: true,
    // 确认颜色
    confirmColorize: true,
    // header最大长度
    maxHeaderLength: Infinity,
    // subject最大长度
    maxSubjectLength: Infinity,
    // subject最小长度
    minSubjectLength: 0,
    // 范围覆盖
    scopeOverrides: undefined,
    // 默认body
    defaultBody: "",
    // 默认issues
    defaultIssues: "",
    // 默认scope
    defaultScope: "",
    // 默认subject
    defaultSubject: "",
  },
};
