import type { Emitter } from "mitt";
import mitt from "mitt";

/** 全局公共事件需要在此处添加类型 */
export type Events = {
  openPanel: string;
  tagOnClick: string;
  logoChange: boolean;
  mixMenuTrigger: string;
  tagViewsChange: string;
  changLayoutRoute: string;
  tagViewsShowModel: string;
  imageInfo: {
    img: HTMLImageElement;
    height: number;
    width: number;
    x: number;
    y: number;
  };
  // 思维导图
  write_local_file: object;
  setData: object;
  lang_change: Function;
  mode_change: Function;
  node_active: Function;
  back_forward: Function;
  painter_start: Function;
  painter_end: Function;
  showImport: Function;
  showExport: Function;
  close_node_icon_toolbar: Function;
  execCommand: any;
  paddingChange: Function | object;
  exportData: any;
  startTextEdit: Function;
  endTextEdit: Function;
  createAssociativeLine: Function;
  startPainter: Function;
  node_tree_render_end: Function;
  showLoading: Function;
  data_change: Function;
  view_data_change: Function;
  showNoteContent: [string, number, number, object];
  handle_file_url: any;
  toggle_mini_map: any;
  show_search: any;
  closeSideBar: any;
  showNodeLink: Function;
  showNodeNote: Function;
  showNodeTag: Function;
  showNodeIcon: Function;
  hideNoteContent: Function;
  scale: Function;
  svg_mousedown: Function;
  hide_text_edit: Function;
  showShortcutKey: Function;
  showStructure: Function;
  setMindMapData: Function | object;
  node_contextmenu: Function;
  node_click: Function;
  draw_click: Function;
  expand_btn_click: Function;
  mouseup: Function;
  scrollbar_change: Function;
  rich_text_selection_change: Function;
};

export const emitter: Emitter<Events> = mitt<Events>();
