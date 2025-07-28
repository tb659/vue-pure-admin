import { isEmptyVal } from "./is";

/**
 * 格式化xmind数据
 * @param {*} data xmind数据
 * @param {*} resData 后台数据
 */
export function formatXmindData(data, resData = []) {
  if (data.text) {
    data.data = { text: data.text };
    delete data.text;
  }
  if (data.children) {
    data.children.forEach(item => formatXmindData(item, resData));
  }
  if (data.name) {
    const itemData = resData.find(f => f.name === data.name);
    if (itemData && !isEmptyVal(itemData[data.key])) {
      const value = itemData[data.key];
      data.data.text = `${isEmptyVal(value) ? "--" : value}${data.unit}`;
      if (data.key === "soc") {
        data.data.text = `${isEmptyVal(value) ? "--" : (value / 100) * 250}${data.unit}`;
      }
      data.data.color = data.color;
      data.data.uid = data.uid;
      // console.log(`${data.fullText} : ${data.data.text}`, {
      //   ...itemData,
      //   ...data,
      // });
    }
  }
  return data;
}
formatXmindData({});

/**
 * 递归处理xmind数据，更新数据
 * @param {*} mindMap xmind实例
 * @param {*} resData 后台数据
 */
export function updateRequestData(mindMap, resData) {
  try {
    const list = flattenArray([mindMap.getData()]);
    list.forEach(listItem => {
      const targetNode = mindMap.renderer.findNodeByUid(listItem.data.uid);
      const resItem = resData.find(resItem => resItem.name === listItem.name);
      if (resItem && !isEmptyVal(resItem[listItem.key])) {
        const value = resItem[listItem.key];
        let text = `${isEmptyVal(value) ? "--" : value}${listItem.unit}`;
        if (listItem.key === "soc") {
          text = `${isEmptyVal(value) ? "--" : (value / 100) * 250}${listItem.unit}`;
        }
        targetNode.setText(text);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 递归处理xmind数据，添加fullText属性
 * @param {*} data xmind数据
 * @param {*} parentText 父级text
 */
export function addFullTextToChildren(data, parentText = "") {
  if (!data) return;

  // 如果存在父级text且当前节点不是根节点(根节点没有parentText)
  if (parentText && data.id !== "0") {
    data.fullText = parentText;
  }

  // 递归处理子节点
  if (data.children && data.children.length > 0) {
    const currentText = data.text ? (parentText ? parentText + formatText(data.text) : formatText(data.text)) : parentText;
    data.fullText = currentText;
    data.children.forEach(child => {
      addFullTextToChildren(child, currentText);
    });
    // console.log(currentText, parentText, data.text);
  }

  function formatText(text) {
    return isNaN(text.slice(-2)) ? "" : text;
  }
}

/**
 * 递归处理xmind数据，将所有节点放入一个数组中
 * @param {*} arr xmind数据
 * @returns null
 */
export function flattenArray(arr) {
  let list = [];
  function cb(data) {
    data.forEach(item => {
      list.push(item);
      if (item.children?.length) {
        cb(item.children);
      }
    });
  }
  cb(arr);
  list = list.filter(item => item.name);
  return list;
}

export const xmindRequestData = {
  requestId: null,
  code: "0",
  message: "succ",
  data: [
    {
      id: 548,
      name: "NJSK20250001WX01",
      pwn: 0,
      dayEnergy: null,
      allEnergy: null,
      soc: null,
    },
    {
      id: null,
      name: "NJSK20250001WX01YB01",
      pwn: -128.552,
      dayEnergy: null,
      allEnergy: null,
      soc: null,
    },
    {
      id: null,
      name: "NJSK20250001WX01YB01CD01",
      pwn: 64.2296,
      dayEnergy: null,
      allEnergy: null,
      soc: null,
    },
    {
      id: 555,
      name: "NJSK20250001WX01YB01CD01CN01",
      pwn: 87,
      dayEnergy: null,
      allEnergy: null,
      soc: 37,
    },
    {
      id: null,
      name: "NJSK20250001WX01YB01FH01",
      pwn: -117.862,
      dayEnergy: null,
      allEnergy: null,
      soc: null,
    },
    {
      id: null,
      name: "NJSK20250001WX01YB01FH01GD01",
      pwn: -4.59919,
      dayEnergy: null,
      allEnergy: null,
      soc: null,
    },
    {
      id: 562,
      name: "NJSK20250001WX01YB01FH01GD01GN01",
      pwn: 6.7,
      dayEnergy: 13,
      allEnergy: 64435,
      soc: null,
    },
    {
      id: 563,
      name: "NJSK20250001WX01YB01FH01GD01GN02",
      pwn: 0,
      dayEnergy: 0,
      allEnergy: 0,
      soc: null,
    },
    {
      id: null,
      name: "NJSK20250001WX01YB01FH02",
      pwn: -54.8167,
      dayEnergy: null,
      allEnergy: null,
      soc: null,
    },
    {
      id: null,
      name: "NJSK20250001WX01YB01FH02CD01",
      pwn: 0.394943,
      dayEnergy: null,
      allEnergy: null,
      soc: null,
    },
    {
      id: 570,
      name: "NJSK20250001WX01YB01FH02CD01CN01",
      pwn: 100,
      dayEnergy: null,
      allEnergy: null,
      soc: 98,
    },
    {
      id: 571,
      name: "NJSK20250001WX01YB01FH02CD01CN02",
      pwn: 97,
      dayEnergy: null,
      allEnergy: null,
      soc: 99,
    },
    {
      id: null,
      name: "NJSK20250001WX01YB01FH02GD01",
      pwn: -174.598,
      dayEnergy: null,
      allEnergy: null,
      soc: null,
    },
    {
      id: 575,
      name: "NJSK20250001WX01YB01FH02GD01GN01",
      pwn: 36.6,
      dayEnergy: 38.2,
      allEnergy: 82491,
      soc: null,
    },
    {
      id: 576,
      name: "NJSK20250001WX01YB01FH02GD01GN02",
      pwn: 37,
      dayEnergy: 36.2,
      allEnergy: 122118,
      soc: null,
    },
    {
      id: 577,
      name: "NJSK20250001WX01YB01FH02GD01GN03",
      pwn: 5.9,
      dayEnergy: 232.2,
      allEnergy: 82814,
      soc: null,
    },
    {
      id: 578,
      name: "NJSK20250001WX01YB01FH02GD01GN04",
      pwn: 20,
      dayEnergy: 23,
      allEnergy: 71772,
      soc: null,
    },
    {
      id: 579,
      name: "NJSK20250001WX01YB01FH02GD01GN05",
      pwn: 30.8,
      dayEnergy: 39,
      allEnergy: 101922,
      soc: null,
    },
    {
      id: 580,
      name: "NJSK20250001WX01YB01FH02GD01GN06",
      pwn: 29.9,
      dayEnergy: 36.7,
      allEnergy: 82250,
      soc: null,
    },
    {
      id: 581,
      name: "NJSK20250001WX01YB01FH02GD01GN07",
      pwn: 38.3,
      dayEnergy: 40.9,
      allEnergy: 102520,
      soc: null,
    },
    {
      id: 582,
      name: "NJSK20250001WX01YB01FH02GD01GN08",
      pwn: 27.4,
      dayEnergy: 29.9,
      allEnergy: 75058,
      soc: null,
    },
    {
      id: null,
      name: "NJSK20250001WX01YB01FH02GD02",
      pwn: -37.0616,
      dayEnergy: null,
      allEnergy: null,
      soc: null,
    },
    {
      id: 586,
      name: "NJSK20250001WX01YB01FH02GD02GN01",
      pwn: 27.4,
      dayEnergy: 17.2,
      allEnergy: 58775,
      soc: null,
    },
    {
      id: 587,
      name: "NJSK20250001WX01YB01FH02GD02GN02",
      pwn: 23.7,
      dayEnergy: 12.7,
      allEnergy: 63693,
      soc: null,
    },
    {
      id: null,
      name: "NJSK20250001WX01YB01FH02GD03",
      pwn: -24.9404,
      dayEnergy: null,
      allEnergy: null,
      soc: null,
    },
    {
      id: 591,
      name: "NJSK20250001WX01YB01FH02GD03GN01",
      pwn: 33.5,
      dayEnergy: 38.6,
      allEnergy: 101519,
      soc: null,
    },
    {
      id: null,
      name: "NJSK20250001WX01YB01FH02GD04",
      pwn: -41.1328,
      dayEnergy: null,
      allEnergy: null,
      soc: null,
    },
    {
      id: 595,
      name: "NJSK20250001WX01YB01FH02GD04GN01",
      pwn: 23,
      dayEnergy: 14.8,
      allEnergy: 76590,
      soc: null,
    },
    {
      id: 596,
      name: "NJSK20250001WX01YB01FH02GD04GN02",
      pwn: 33.9,
      dayEnergy: 22.1,
      allEnergy: 58819,
      soc: null,
    },
    {
      id: null,
      name: "NJSK20250001WX01YB01GD01",
      pwn: -129.023,
      dayEnergy: null,
      allEnergy: null,
      soc: null,
    },
    {
      id: 600,
      name: "NJSK20250001WX01YB01GD01GN01",
      pwn: 0,
      dayEnergy: 0,
      allEnergy: 0,
      soc: null,
    },
    {
      id: 601,
      name: "NJSK20250001WX01YB01GD01GN02",
      pwn: 0,
      dayEnergy: 0,
      allEnergy: 0,
      soc: null,
    },
    {
      id: 602,
      name: "NJSK20250001WX01YB01GD01GN03",
      pwn: 15.9,
      dayEnergy: 27.4,
      allEnergy: 104971,
      soc: null,
    },
    {
      id: 603,
      name: "NJSK20250001WX01YB01GD01GN04",
      pwn: 6553.5,
      dayEnergy: 6553.5,
      allEnergy: 4294970000,
      soc: null,
    },
    {
      id: 604,
      name: "NJSK20250001WX01YB01GD01GN05",
      pwn: 15.8,
      dayEnergy: 24.2,
      allEnergy: 92192,
      soc: null,
    },
    {
      id: 605,
      name: "NJSK20250001WX01YB01GD01GN06",
      pwn: 14.4,
      dayEnergy: 23.4,
      allEnergy: 108709,
      soc: null,
    },
    {
      id: 606,
      name: "NJSK20250001WX01YB01GD01GN07",
      pwn: 26.4,
      dayEnergy: 24.8,
      allEnergy: 93527,
      soc: null,
    },
    {
      id: 607,
      name: "NJSK20250001WX01YB01GD01GN08",
      pwn: 24.5,
      dayEnergy: 22.4,
      allEnergy: 90499,
      soc: null,
    },
    {
      id: 608,
      name: "NJSK20250001WX01YB01GD01GN09",
      pwn: 28.9,
      dayEnergy: 25.4,
      allEnergy: 95436,
      soc: null,
    },
    {
      id: 609,
      name: "NJSK20250001WX01YB01GD01GN10",
      pwn: 37.8,
      dayEnergy: 28.2,
      allEnergy: 112537,
      soc: null,
    },
  ],
  sign: null,
  success: true,
};
