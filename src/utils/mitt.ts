import type { Emitter } from "mitt";
import mitt from "mitt";

/** 全局公共事件需要在此处添加类型 */
type Events = {
  openPanel: string;
  tagViewsChange: string;
  mixMenuTrigger: string;
  tagViewsShowModel: string;
  logoChange: boolean;
  fixedHeader: boolean;
  hiddenSideBar: boolean;
  changLayoutRoute: {
    indexPath: string;
    parentPath: string;
  };
  imageInfo: {
    img: HTMLImageElement;
    height: number;
    width: number;
    x: number;
    y: number;
  };
};

export const emitter: Emitter<Events> = mitt<Events>();
