import Editor from "./src/Editor.vue";
import { IDomEditor } from "@wangeditor/editor";
import { withInstall } from "@pureadmin/utils";

export interface EditorExpose {
  getEditorRef: () => Promise<IDomEditor>;
}

export const ReEditor = withInstall(Editor);

export default ReEditor;
