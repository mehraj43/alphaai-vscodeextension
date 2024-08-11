// src/helpers/codelens.ts
import { CodeLens, Range } from 'vscode';

export class ExplainCodeLens extends CodeLens {
  constructor(
    range: Range,
    public readonly code: string,
    public readonly type: string,
    public readonly language: string
  ) {
    super(range, {
      title: 'Explain',
      command: 'alphaai.explain',
      arguments: [{ range, code, language, type }], // Pass the code as an argument
    });
  }
}

export class RefactorCodeLens extends CodeLens {
  constructor(
    range: Range,
    public readonly code: string,
    public readonly type: string,
    public readonly language: string
  ) {
    super(range, {
      title: 'Refactor',
      command: 'alphaai.refactor',
      arguments: [{ range, code, language, type }], // Pass the code as an argument
    });
  }
}

export class GenerateJSDocCodeLens extends CodeLens {
  constructor(range: Range, public readonly code: string) {
    super(range, {
      title: 'Generate JSDocs',
      command: 'alphaai.generateJSDocs',
      arguments: [range, code], // Pass the code as an argument
    });
  }
}
