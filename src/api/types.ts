//
declare global {
  interface BaseQuery {
    name: string;
    page: number;
    size: number;
    total: number;
  }
  interface OptionsLabelValue {
    label: string;
    value: number | string;
  }
}
export {};
