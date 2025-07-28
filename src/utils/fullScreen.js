// @ts-nocheck

const getOnfullscreEnevt = () => {
  if (document.documentElement.requestFullScreen) {
    return "onfullscreenchange";
  } else if (document.documentElement.webkitRequestFullScreen) {
    return "onwebkitfullscreenchange";
  } else if (document.documentElement.mozRequestFullScreen) {
    return "onmozfullscreenchange";
  } else if (document.documentElement.msRequestFullscreen) {
    return "onmsfullscreenchange";
  }
};

export const fullscrrenEvent = getOnfullscreEnevt();

export const fullScreen = element => {
  if (element.requestFullScreen) {
    element.requestFullScreen();
  } else if (element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  }
};
