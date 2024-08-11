import * as vscode from 'vscode';
import { processCode, TaskType } from '../ai/aiFunction';

export const vscodeHelper = (
  range: vscode.Range,
  code: string,
  language: string,
  codeType: string,
  taskType: TaskType
) => {
  vscode.window
    .withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: `Fetcing the ${taskType} code...`,
        cancellable: false,
      },
      async (progress, token) => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          progress.report({ increment: 20 });
          const { result, error } = await processCode({
            range,
            code,
            language,
            codeType,
            taskType,
          });

          if (error) {
            vscode.window.showInformationMessage(
              'Error generating processed code - please check the console.'
            );
            console.log(error);
            return;
          } else {
            if (!result) {
              vscode.window.showInformationMessage(
                'Error generating processed code - no result returned. Check the console For more info.'
              );
              return;
            }

            const aiGeneratedCode = result.choices[0].message.content;

            if (!aiGeneratedCode) {
              vscode.window.showInformationMessage(
                'Error generating processed code - no text returned from API. Check the console For more info.'
              );
              return;
            }

            if (taskType === 'refactor') {
              editor?.edit((editBuilder) => {
                editBuilder.replace(range, aiGeneratedCode);
              });
            } else if (taskType === 'explain') {
              const lineStart = range.start.line;
              const positionAboveRange = new vscode.Position(lineStart, 0);

              const document = editor.document;
              const firstLineText = document.lineAt(lineStart).text;
              const needsNewline = firstLineText.trim() !== '';

              editor.edit((editBuilder) => {
                if (needsNewline) {
                  // Insert a newline before the generated code
                  editBuilder.insert(
                    positionAboveRange,
                    `\n${aiGeneratedCode}\n`
                  );
                } else {
                  editBuilder.insert(
                    positionAboveRange,
                    `${aiGeneratedCode}\n`
                  );
                }
              });
            }
          }
          progress.report({ increment: 100 });
        }
      }
    )
    .then(() => {
      console.log('Alpha AI: Code generation completed!.');
    });
};
