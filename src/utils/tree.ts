interface TreeHelperConfig {
  id: string;
  children: string;
  pid: string;
}
// 默认值 可根据项目自行修改 value 值
const DEFAULT_CONFIG: TreeHelperConfig = {
  id: "id",
  children: "children",
  pid: "parentId"
};

const getConfig = (config: Partial<TreeHelperConfig>) => Object.assign({}, DEFAULT_CONFIG, config);

/**
 * @description: 一维数组转化成结构树 id，parentId，chidlren 默认字段
 * @return {*}
 */
export const listToTree = <T = any>(list: any[], config: Partial<TreeHelperConfig> = {}): T[] => {
  const conf = getConfig(config) as TreeHelperConfig;
  const nodeMap = new Map();
  const result: T[] = [];
  const { id, children, pid } = conf;

  for (const node of list) {
    nodeMap.set(node[id], node);
  }
  for (const node of list) {
    const parent = nodeMap.get(node[pid]);
    parent ? (parent[children] ? parent[children].push(node) : (parent[children] = [node])) : result.push(node);
  }
  for (const node of list) {
    !node[children]?.length && delete node[children];
  }
  return result;
};

/**
 * @description: 结构树转化成一维数组 id，parentId，chidlren 默认字段
 * @return {*}
 */
export const treeToList = <T = any>(tree: any, config: Partial<TreeHelperConfig> = {}): T => {
  config = getConfig(config);
  const { children } = config;
  const result: any = [...tree];
  for (let i = 0; i < result.length; i++) {
    if (!result[i][children!]) continue;
    result.splice(i + 1, 0, ...result[i][children!]);
  }
  return result;
};

/**
 * @description 提取菜单树中的每一项uniqueId
 * @param tree 树
 * @returns 每一项uniqueId组成的数组
 */
export const getTreeUniqueId = (tree: any[]): any => {
  if (!Array.isArray(tree)) {
    console.warn("tree must be an array");
    return [];
  }
  if (!tree || tree.length === 0) return [];
  const expandedPaths: Array<number | string> = [];
  for (const node of tree) {
    const hasChildren = node.children && node.children.length > 0;
    if (hasChildren) {
      getTreeUniqueId(node.children);
    }
    expandedPaths.push(node.uniqueId);
  }
  return expandedPaths;
};

/**
 * @description 广度优先遍历，根据唯一uniqueId找当前节点信息
 * @param tree 树
 * @param uniqueId 唯一uniqueId
 * @returns 当前节点信息
 */
export const getNodeByUniqueId = (tree: any[], uniqueId: number | string): any => {
  if (!Array.isArray(tree)) {
    console.warn("menuTree must be an array");
    return [];
  }
  if (!tree || tree.length === 0) return [];
  const item = tree.find(node => node.uniqueId === uniqueId);
  if (item) return item;
  const childrenList = tree
    .filter(node => node.children)
    .map(i => i.children)
    .flat(1) as unknown;
  return getNodeByUniqueId(childrenList as any[], uniqueId);
};

/**
 * @description 向当前唯一uniqueId节点中追加字段
 * @param tree 树
 * @param uniqueId 唯一uniqueId
 * @param fields 需要追加的字段
 * @returns 追加字段后的树
 */
export const appendFieldByUniqueId = (tree: any[], uniqueId: number | string, fields: object): any => {
  if (!Array.isArray(tree)) {
    console.warn("menuTree must be an array");
    return [];
  }
  if (!tree || tree.length === 0) return [];
  for (const node of tree) {
    const hasChildren = node.children && node.children.length > 0;
    if (node.uniqueId === uniqueId && Object.prototype.toString.call(fields) === "[object Object]") Object.assign(node, fields);
    if (hasChildren) {
      appendFieldByUniqueId(node.children, uniqueId, fields);
    }
  }
  return tree;
};

/**
 * @description 如果父级下children的length为1，删除children并自动组建唯一uniqueId
 * @param tree 树
 * @param pathList 每一项的id组成的数组
 * @returns 组件唯一uniqueId后的树
 */
export const deleteChildrenIfHasOne = (tree: any[], pathList = []): any => {
  if (!Array.isArray(tree)) {
    console.warn("menuTree must be an array");
    return [];
  }
  if (!tree || tree.length === 0) return [];
  for (const [key, node] of tree.entries()) {
    if (node.children && node.children.length === 1) delete node.children;
    node.id = key;
    node.parentId = pathList.length ? pathList[pathList.length - 1] : null;
    node.pathList = [...pathList, node.id];
    node.uniqueId = node.pathList.length > 1 ? node.pathList.join("-") : node.pathList[0];
    const hasChildren = node.children && node.children.length > 0;
    if (hasChildren) {
      deleteChildrenIfHasOne(node.children, node.pathList);
    }
  }
  return tree;
};

/**
 * @description 创建层级关系
 * @param tree 树
 * @param pathList 每一项的id组成的数组
 * @returns 创建层级关系后的树
 */
export const buildHierarchyTree = (tree: any[], pathList = []): any => {
  if (!Array.isArray(tree)) {
    console.warn("tree must be an array");
    return [];
  }
  if (!tree || tree.length === 0) return [];
  for (const [key, node] of tree.entries()) {
    node.id = key;
    node.parentId = pathList.length ? pathList[pathList.length - 1] : null;
    node.pathList = [...pathList, node.id];
    const hasChildren = node.children && node.children.length > 0;
    if (hasChildren) {
      buildHierarchyTree(node.children, node.pathList);
    }
  }
  return tree;
};

export const getTreeIds = (list: any[], val: String | Number, config: Partial<TreeHelperConfig> = {}): String[] | Number[] => {
  config = getConfig(config);
  const { id, pid } = getConfig(config);
  const data = [];
  function fn(val) {
    const item = list.filter(v => v[id] === val && !data.includes(val))[0];
    if (item) {
      data.unshift(item[id]);
      item[pid] && fn(item[pid]);
    }
  }
  fn(val);
  return data;
};

/**
 * @description: 获取名称
 * @param {*} array
 * @param {*} data
 * @param {*} key
 * @param {*} concat
 * @return {*}
 */
export function getArrayName(array: any[], data: any[], key, concat = "", config: Partial<TreeHelperConfig> = {}): String {
  config = getConfig(config);
  const { id } = config;
  data = treeToList(data);
  let name = "";
  array.forEach(v => {
    const item = data.filter(item => item[id] === v)[0];
    item && (name += concat + item[key]);
  });
  return name;
}

export const findPath = (tree: any[], func, config: Partial<TreeHelperConfig> = {}): any[] => {
  config = getConfig(config);
  const path = [];
  const list = [...tree];
  const visitedSet = new Set();
  const { children } = config;
  while (list.length) {
    const node = list[0];
    if (visitedSet.has(node)) {
      path.pop();
      list.shift();
    } else {
      visitedSet.add(node);
      node[children] && list.unshift(...node[children]);
      path.push(node);
      if (func(node)) {
        return path;
      }
    }
  }
  return null;
};

export const findPathAll = (tree, func, config: Partial<TreeHelperConfig> = {}) => {
  config = getConfig(config);
  const path = [];
  const list = [...tree];
  const result = [];
  const visitedSet = new Set();
  const { children } = config;
  while (list.length) {
    const node = list[0];
    if (visitedSet.has(node)) {
      path.pop();
      list.shift();
    } else {
      visitedSet.add(node);
      node[children] && list.unshift(...node[children]);
      path.push(node);
      func(node) && result.push([...path]);
    }
  }
  return result;
};

/**
 * @description: 提取树指定的结构
 */
export const treeMap = (treeData, opt) => {
  return treeData.map(item => treeMapEach(item, opt));
};

/**
 * @description: 提取树指定的结构
 */
export const treeMapEach = (data, { children = "children", conversion }) => {
  const haveChildren = Array.isArray(data[children]) && data[children].length > 0;
  const conversionData = conversion(data) || {};
  if (haveChildren) {
    return {
      ...conversionData,
      [children]: data[children].map(i =>
        treeMapEach(i, {
          children,
          conversion
        })
      )
    };
  } else {
    return {
      ...conversionData
    };
  }
};

/**
 * 递归遍历树结构
 * @param treeDatas 树
 * @param callBack 回调
 * @param parentNode 父节点
 */
export const eachTree = (treeDatas, callBack, parentNode = {}) => {
  treeDatas.forEach(element => {
    const newNode = callBack(element, parentNode) || element;
    if (element.children) {
      eachTree(element.children, callBack, newNode);
    }
  });
};

export const filter = (tree, func, config: Partial<TreeHelperConfig> = {}) => {
  config = getConfig(config);
  const children = config.children;
  function listFilter(list) {
    return list
      .map(node => ({ ...node }))
      .filter(node => {
        node[children] = node[children] && listFilter(node[children]);
        return func(node) || (node[children] && node[children].length);
      });
  }
  return listFilter(tree);
};

export const forEach = (tree, func, config: Partial<TreeHelperConfig> = {}) => {
  config = getConfig(config);
  const list = [...tree];
  const { children } = config;
  for (let i = 0; i < list.length; i++) {
    // func 返回true就终止遍历，避免大量节点场景下无意义循环，引起浏览器卡顿
    if (func(list[i])) {
      return;
    }
    children && list[i][children] && list.splice(i + 1, 0, ...list[i][children]);
  }
};
