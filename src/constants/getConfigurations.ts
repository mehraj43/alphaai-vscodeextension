import * as vscode from 'vscode';
import { safelyExtractStringSetting } from '../utility';

export const apiKey = safelyExtractStringSetting(
  'alphaai.apiKey',
  vscode.window,
  vscode.workspace
);
