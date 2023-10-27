export const setIndex = (reserveIndex: boolean, index: number, size: number, current: number) => {
  const newIndex = index + 1;
  if (reserveIndex) {
    return size * (current - 1) + newIndex;
  } else {
    return newIndex;
  }
};

export const setLoadingText = (text, page) => {
  const reg = /\${i}/g;
  return reg.test(text) ? text.replace(reg, page) : text;
};
