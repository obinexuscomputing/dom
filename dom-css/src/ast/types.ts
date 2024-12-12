export interface CSSNode {
    type: CSSNodeType;
    value?: string;
    children?: CSSNode[];
    selector?: string;
    properties?: Map<string, string>;
    position?: {
      start: number;
      end: number;
      line: number;
      column: number;
    };
  }
  
  export enum CSSNodeType {
    STYLESHEET = 'stylesheet',
    RULE = 'rule',
    DECLARATION = 'declaration',
    COMMENT = 'comment'
  }