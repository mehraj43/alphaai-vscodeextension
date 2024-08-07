import * as vscode from 'vscode';
import { findSelectedBlockFromSelection } from './utility';
import { FILE_SELECTOR } from './constants/fileSelector';
import CustomCodeLensProvider from './providers/CodeLensProvider';
import { generateJSDoc } from './helpers/generateJSDoc';
import { explainCode, refactorCode } from './ai/aiFunction';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "alphaai" is now active!');

  let disposable = vscode.commands.registerCommand(
    'alphaai.generateJSDocs',
    async (range: vscode.Range, code: string) => {
      // Get the active text editor
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        if (range && range?.start && range?.end) {
          const startLineIndex = range.start.line; // Accessing start line
          const endLineIndex = range.end.line; // Accessing end line
          const contents = code;
          generateJSDoc({ contents, startLineIndex, endLineIndex });
          return;
        }

        const document = editor.document;
        const selection = editor.selection;

        const entireFile = document.getText();

        const selectedBlock = findSelectedBlockFromSelection(
          entireFile,
          selection
        );

        if (!selectedBlock) {
          vscode.window.showInformationMessage(
            'Could not find code - selection appears to be empty.'
          );
        } else {
          const { contents, startLineIndex, endLineIndex } = selectedBlock;
          console.log('sjkkjs', { contents, startLineIndex, endLineIndex });
          generateJSDoc({ contents, startLineIndex, endLineIndex });
        }
      } else {
        vscode.window.showInformationMessage(
          'Editor not found - please open a file.'
        );
      }
    }
  );

  context.subscriptions.push(disposable);

  // codelens
  const codeLensProvider = new CustomCodeLensProvider();

  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(FILE_SELECTOR, codeLensProvider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'alphaai.explain',
      (range: vscode.Range, code: string) => explainCode({ range, code })
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'alphaai.refactor',
      (range: vscode.Range, code: string) => refactorCode({ range, code })
    )
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
