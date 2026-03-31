declare module "frappe-gantt" {
  export type GanttTask = {
    id: string;
    name: string;
    start: string;
    end: string;
    progress?: number;
    dependencies?: string[] | string;
    custom_class?: string;
    [key: string]: unknown;
  };

  export type GanttOptions = {
    view_mode?: string;
    readonly?: boolean;
    readonly_progress?: boolean;
    readonly_dates?: boolean;
    move_dependencies?: boolean;
    popup?: ((context: unknown) => false | void | string) | false;
    today_button?: boolean;
    scroll_to?: string;
    language?: string;
    container_height?: "auto" | number;
    bar_height?: number;
    padding?: number;
    upper_header_height?: number;
    lower_header_height?: number;
    column_width?: number;
    on_click?: (task: GanttTask) => void;
    [key: string]: unknown;
  };

  export default class Gantt {
    constructor(container: Element | string, tasks: GanttTask[], options?: GanttOptions);
    change_view_mode(mode: string, maintainPos?: boolean): void;
    update_options(options: GanttOptions): void;
    scroll_current(): void;
  }
}
