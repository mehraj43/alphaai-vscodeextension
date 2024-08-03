import * as vscode from 'vscode';

export const findSelectedBlockFromSelection = (
  fileText: string,
  selection: vscode.Selection
): {
  contents: string;
  startLineIndex: number;
  endLineIndex: number;
} | null => {
  const lines = fileText.split('\n');

  let startLineIndex = selection.start.line;
  let endLineIndex = selection.end.line;

  if (startLineIndex === endLineIndex) {
    if (lines[startLineIndex].trim() === '') {
      return null;
    }

    return { contents: lines[startLineIndex], startLineIndex, endLineIndex };
  }

  const linesInDocument = lines.length;

  while (
    lines[startLineIndex].trim() === '' &&
    startLineIndex < endLineIndex &&
    startLineIndex < linesInDocument
  ) {
    startLineIndex++;
  }

  if (startLineIndex === endLineIndex) {
    return null;
  }

  while (
    lines[endLineIndex].trim() === '' &&
    endLineIndex > startLineIndex &&
    endLineIndex > 0
  ) {
    endLineIndex--;
  }

  if (startLineIndex === endLineIndex) {
    return null;
  }

  const blockSelected = lines.slice(startLineIndex, endLineIndex + 1);

  return { contents: blockSelected.join('\n'), startLineIndex, endLineIndex };
};

export const cleanAIResponse = (_response: string): string => {
  let response = _response;
  response = response.trim();

  // Trim away common prefixes that gpt likes to add
  if (response.startsWith('```') && response.endsWith('```')) {
    response = response.slice(3, -3).trim();
  }
  const lowerCaseResponse = response.toLowerCase();
  if (lowerCaseResponse.startsWith('jsdoc')) {
    response = response.slice(5).trim();
  }
  if (lowerCaseResponse.startsWith('js')) {
    response = response.slice(2).trim();
  }
  if (lowerCaseResponse.startsWith('ts')) {
    response = response.slice(2).trim();
  }
  if (lowerCaseResponse.startsWith('javascript')) {
    response = response.slice(10).trim();
  }
  if (lowerCaseResponse.startsWith('typescript')) {
    response = response.slice(10).trim();
  }
  if (lowerCaseResponse.startsWith('[code]')) {
    response = response.slice(6).trim();
  }
  if (lowerCaseResponse.startsWith('[jsdoc]')) {
    response = response.slice(7).trim();
  }
  if (lowerCaseResponse.startsWith('[comment]')) {
    response = response.slice(9).trim();
  }
  if (lowerCaseResponse.startsWith('[jsdoc/comment]')) {
    response = response.slice(15).trim();
  }

  return response;
};

// Add a space to the beginning of each line of a comment string where the line starts with a *
const trimCommentLine = (line: string): string => {
  if (line.trim().startsWith('*')) {
    return ` ${line.trim()}`;
  }
  return line.trim();
};

/**
 * Prepends the indentation of the first non-empty line from a code block to each line of a provided comment string.
 *
 * @param codeBlock The string representing the block of code.
 * @param commentStr The string representing the comment to be indented.
 * @returns The comment string with each line indented to match the code block's first non-empty line indentation.
 */
export const indentCommentToCode = (
  codeBlock: string,
  commentStr: string
): string => {
  // Find the indentation of the first non-empty line in the code block
  const indentMatch = codeBlock.match(/^(?!\s*$)\s*/);
  const indent = indentMatch ? indentMatch[0] : '';

  // Split the comment string into lines
  const commentLines = commentStr.split('\n');

  // Prepend the same indentation to each line of the comment for consistency
  let indentedComment = commentLines
    .map((line) => `${indent}${trimCommentLine(line)}`)
    .join('\n');

  // if indentedComment doesn't end in a newline, add one
  if (indentedComment[indentedComment.length - 1] !== '\n') {
    indentedComment += '\n';
  }
  console.log({ indentedComment });
  return indentedComment;
};

export const safelyExtractStringSetting = (
  settingName: string,
  vscodeWindow: typeof vscode.window,
  vscodeWorkspace: typeof vscode.workspace
) => {
  const setting = vscodeWorkspace.getConfiguration().get(settingName);

  if (!setting) {
    vscodeWindow.showErrorMessage(
      `${settingName} not found - please set it in the settings.`
    );
    return null;
  }
  if (typeof setting !== 'string') {
    vscodeWindow.showErrorMessage(
      `${settingName} is not a string - please set it in the settings.`
    );
    return null;
  }

  return setting;
};

export const safelyExtractNumericSetting = (
  settingName: string,
  vscodeWindow: typeof vscode.window,
  vscodeWorkspace: typeof vscode.workspace
) => {
  const setting = vscodeWorkspace.getConfiguration().get(settingName);

  if (!setting) {
    vscodeWindow.showErrorMessage(
      `${settingName} not found - please set it in the settings.`
    );
    return null;
  }
  if (typeof setting !== 'number') {
    vscodeWindow.showErrorMessage(
      `${settingName} is not a number! Something has gone wrong.`
    );
    return null;
  }

  return setting;
};

export const safelyExtractBooleanSetting = (
  settingName: string,
  vscodeWindow: typeof vscode.window,
  vscodeWorkspace: typeof vscode.workspace
) => {
  const setting = vscodeWorkspace.getConfiguration().get(settingName);

  if (typeof setting !== 'boolean') {
    vscodeWindow.showErrorMessage(
      `${settingName} is not a boolean - please set it in the settings.`
    );
    return null;
  }

  return setting;
};
