import { Range } from 'vscode';
export const explainCode = ({
  range,
  code,
}: {
  range: Range;
  code: string;
}) => {
  console.log('Explain command invoked', range, code);
};

export const refactorCode = ({
  range,
  code,
}: {
  range: Range;
  code: string;
}) => {
  console.log('Refactor command invoked', range, code);
};
