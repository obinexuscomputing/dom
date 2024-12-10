export interface ASTNode {
    type: string;
    children?: ASTNode[];
    value?: string;
  }
  
  export interface ASTBuilder {
    build(input: string): ASTNode;
  }
  
  export interface ASTOptimizer {
    optimize(node: ASTNode): ASTNode;
  }
  