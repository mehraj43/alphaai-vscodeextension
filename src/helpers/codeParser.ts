import { parse, ParserOptions } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';

interface CodeElement {
  loc: t.SourceLocation;
  name: string;
  type: 'function' | 'class' | 'arrowFunction';
}

function codeParser(sourceCode: string): CodeElement[] {
  const parserOptions: ParserOptions = {
    plugins: ['jsx', 'typescript'],
    sourceType: 'module',
    tokens: true,
  };

  const ast = parse(sourceCode, parserOptions);
  const results: CodeElement[] = [];

  traverse(ast, {
    FunctionDeclaration(path: NodePath<t.FunctionDeclaration>) {
      if (path.node.id) {
        results.push({
          loc: path.node.loc!,
          name: path.node.id.name,
          type: 'function',
        });
      }
    },
    ClassDeclaration(path: NodePath<t.ClassDeclaration>) {
      results.push({
        loc: path.node.loc!,
        name: path.node.id!.name,
        type: 'class',
      });
    },
    ArrowFunctionExpression(path: NodePath<t.ArrowFunctionExpression>) {
      if (
        path.parent.type === 'VariableDeclarator' &&
        t.isIdentifier(path.parent.id)
      ) {
        results.push({
          loc: path.node.loc!,
          name: path.parent.id.name,
          type: 'arrowFunction',
        });
      }
    },
    // Handle other types of expressions as needed
  });

  return results;
}

export { codeParser };
