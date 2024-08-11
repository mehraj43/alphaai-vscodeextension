import Groq from 'groq-sdk';
import { Range } from 'vscode';
import { apiKey } from '../constants/getConfigurations';

export type TaskType = 'explain' | 'refactor';

export const processCode = async ({
  range,
  code,
  prompt,
  language = 'javascript',
  codeType,
  taskType,
}: {
  range: Range;
  code: string;
  prompt?: string;
  language?: string;
  codeType: string;
  taskType: TaskType;
}) => {
  try {
    console.log(`${taskType} command invoked`, range, code);

    const groq = new Groq({
      apiKey: apiKey!,
    });

    const systemParams: {
      [key in TaskType]: Groq.Chat.ChatCompletionSystemMessageParam;
    } = {
      explain: {
        role: 'system',
        content: `You are a code explainer. 
        You will receive a code snippet in one of the following languages: JavaScript (js), TypeScript (ts), JavaScript XML (jsx), or TypeScript XML (tsx). 
        You will also receive information about the type of code: function, class, or arrow function. 
        Please explain the purpose and behavior of the code in a multiline comment, properly formatted for readability. 
        Return the explanation as a multiline comment, with each line prefixed with '// '.
        
        Code language: ${language}
        Code type: ${codeType}
        Code: ${code}`,
      },
      refactor: {
        role: 'system',
        content: `You are a code refactoring expert. 
        You will receive a code snippet in one of the following languages: JavaScript (js), TypeScript (ts), JavaScript XML (jsx), or TypeScript XML (tsx). 
        You will also receive information about the type of code: function, class, or arrow function. 
        Please refactor the code to improve its readability, maintainability, and performance, while preserving its original functionality and behavior. 
        Return the refactored code, ensuring it is error-free and does not miss any essential aspects of the original code and return just the code no kind of explanation.

        Code language: ${language}
        Code type: ${codeType}
        Code: ${code}`,
      },
    };

    // const userParam: Groq.Chat.ChatCompletionUserMessageParam = {
    //   role: 'user',
    //   content: prompt,
    // };

    const result = await groq.chat.completions.create({
      messages: [systemParams[taskType]],
      model: 'llama3-8b-8192',
      max_tokens: 400,
      stream: false,
    });

    console.log({ result });
    return {
      error: null,
      result: result,
    };
  } catch (error) {
    console.log({ error });
    return {
      error: error,
      result: null,
    };
  }
};
