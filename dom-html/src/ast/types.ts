export interface ASTNode {
    tagName: string;
    type: NodeType;
    value?: string;
    children?: ASTNode[];
    attributes?: Map<string, string>;
    position?: {
      start: number;
      end: number;
      line: number;
      column: number;
    };
  }
  
  export enum NodeType {
    ROOT = 'root',
    ELEMENT = 'element',
    TEXT = 'text',
    COMMENT = 'comment'
  }
  
  // dom-html/src/ast/html-ast-builder.ts
  import { ASTNode, NodeType } from './types';
  import { Token, TokenType } from '../tokenizer/types';
  
  export class HTMLASTBuilder {
    private tokens: Token[];
    private current: number;
  
    constructor() {
      this.tokens = [];
      this.current = 0;
    }
  
    build(tokens: Token[]): ASTNode {
      this.tokens = tokens;
      this.current = 0;
      
      return this.buildRoot();
    }
  
    private buildRoot(): ASTNode {
      return {
        type: NodeType.ROOT,
        children: this.buildChildren()
      };
    }
  
    private buildChildren(): ASTNode[] {
      const children: ASTNode[] = [];
      
      while (this.current < this.tokens.length) {
        const child = this.buildNode();
        if (child) {
          children.push(child);
        }
      }
      
      return children;
    }
  
    private buildNode(): ASTNode | null {
      // Node building implementation
      return null;
    }
  }
  