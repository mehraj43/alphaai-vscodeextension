import { CodeLensProvider, TextDocument, CodeLens, Range } from 'vscode';
import { codeParser } from '../helpers/codeParser'; // Adjust the path as needed
import * as t from '@babel/types';
import {
  ExplainCodeLens,
  GenerateJSDocCodeLens,
  RefactorCodeLens,
} from '../helpers/codelens';

// Define the CodeLensProvider class
export default class CustomCodeLensProvider implements CodeLensProvider {
  // Provide CodeLens for the document
  public provideCodeLenses(
    document: TextDocument
  ): CodeLens[] | Thenable<CodeLens[]> {
    const createRangeObject = ({ loc }: { loc: t.SourceLocation }): Range => {
      return new Range(
        loc.start.line - 1,
        loc.start.column,
        loc.end.line - 1,
        loc.end.column
      );
    };

    const codeElements = codeParser(document.getText());
    // const func = codeElements.find(
    //   (element) => element.type === 'arrowFunction'
    // );
    // console.log({ codeElements });
    return codeElements.reduce<CodeLens[]>((acc, { loc, name, type }) => {
      const range = createRangeObject({ loc });

      const code = document.getText(
        new Range(
          loc.start.line - 1,
          0, // Start from the beginning of the line
          loc.end.line - 1,
          loc.end.column
        )
      );
      const language = document.languageId;
      // Add CodeLens based on the type
      if (type === 'function' || type === 'class' || type === 'arrowFunction') {
        acc.push(new ExplainCodeLens(range, code, type, language));
        acc.push(new RefactorCodeLens(range, code, type, language));
        acc.push(new GenerateJSDocCodeLens(range, code));
      }

      return acc;
    }, []);
  }

  // Optionally resolve CodeLens if additional information is needed
  public resolveCodeLens?(codeLens: CodeLens): CodeLens | Thenable<CodeLens> {
    return codeLens;
  }
}
