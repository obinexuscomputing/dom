import { ASTNode, ASTBuilder } from './ast-types';

export class HTMLASTBuilder implements ASTBuilder {
  build(input: string): ASTNode {
    // Implementation will be added
    return { type: 'root' };
  }
}
