import * as vscode from 'vscode';
import {
  cleanAIResponse,
  indentCommentToCode,
  safelyExtractBooleanSetting,
  safelyExtractNumericSetting,
  safelyExtractStringSetting,
} from '../utility';
import { getAIResponse, parsePromptAndInsertInput } from '../groq-connection';

type Props = {
  contents: string;
  startLineIndex: number;
  endLineIndex: number;
};
export const generateJSDoc = ({
  contents,
  startLineIndex,
  endLineIndex,
}: Props) => {
  const editor = vscode.window.activeTextEditor;

  const apiKey = safelyExtractStringSetting(
    'alphaai.apiKey',
    vscode.window,
    vscode.workspace
  );
  if (!apiKey) {
    return;
  }
  const modelFromConfig = safelyExtractStringSetting(
    'alphaai.model',
    vscode.window,
    vscode.workspace
  );
  if (!modelFromConfig) {
    return;
  }

  const maxTokens = safelyExtractNumericSetting(
    'alphaai.maxTokens',
    vscode.window,
    vscode.workspace
  );
  if (maxTokens === null) {
    return;
  }

  const promptFromConfig = safelyExtractStringSetting(
    'alphaai.prompt',
    vscode.window,
    vscode.workspace
  );
  if (!promptFromConfig) {
    return;
  }

  const allowSingleLineSelection = safelyExtractBooleanSetting(
    'alphaai.allowSingleLineSelection',
    vscode.window,
    vscode.workspace
  );
  if (!allowSingleLineSelection && startLineIndex === endLineIndex) {
    vscode.window.showInformationMessage(
      'Single line selections are not allowed (as per settings) - please select more than one line or enable the selection of single lines in the settings.'
    );
    return;
  }

  vscode.window
    .withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Generating JSDoc',
        cancellable: false,
      },
      async (progress, token) => {
        progress.report({ increment: 20 });

        const { prompt, error: promptParseError } = parsePromptAndInsertInput(
          promptFromConfig,
          contents
        );
        if (promptParseError) {
          vscode.window.showInformationMessage(
            `Error parsing prompt: ${promptParseError}`
          );
          console.log(promptParseError);
          return;
        }
        if (!prompt) {
          vscode.window.showInformationMessage(
            `Error parsing prompt: no prompt returned.`
          );
          return;
        }

        const { result, error } = await getAIResponse(
          apiKey,
          contents,
          prompt,
          modelFromConfig,
          maxTokens
        );

        if (error) {
          vscode.window.showInformationMessage(
            'Error generating JSDoc - please check the console.'
          );
          console.log(error);
          return;
        } else {
          if (!result) {
            vscode.window.showInformationMessage(
              'Error generating JSDoc - no result returned. Check the console For more info.'
            );
            return;
          }
          const commentText = result.choices[0].message.content;

          if (!commentText) {
            vscode.window.showInformationMessage(
              'Error generating JSDoc - no text returned from API. Check the console For more info.'
            );
            return;
          }

          const cleanedText = cleanAIResponse(commentText);
          const textAfterBeingIndentedCorrectly = indentCommentToCode(
            contents,
            cleanedText
          );

          editor?.edit((editBuilder) => {
            editBuilder.insert(
              new vscode.Position(startLineIndex, 0),
              textAfterBeingIndentedCorrectly
            );
          });
        }
        progress.report({ increment: 100 });
      }
    )
    .then(() => {
      console.log('Alpha AI: JSDoc generated!');
    });
};
