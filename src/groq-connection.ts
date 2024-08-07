import Groq from 'groq-sdk';
import { generateJSDocPrompt } from './constants/prompt';

type ParseResult = {
  prompt: string | null;
  error: string | null;
};

// interface CompletionCreateParams {
//   messages: {
//     role: string;
//     content: string;
//   }[];
// }

export const parsePromptAndInsertInput = (
  prompt: string,
  input: string
): ParseResult => {
  // Use {} to signify where the input should be inserted
  const inputPlaceholder = '{}';

  // Find the placeholder index
  const inputPlaceholderIndex = prompt.indexOf(inputPlaceholder);

  // Check if placeholder is present
  if (inputPlaceholderIndex === -1) {
    return {
      prompt: null,
      error: `Could not find input placeholder "${inputPlaceholder}" in prompt`,
    };
  }

  // Replace the placeholder with the input and create the new prompt
  const newPrompt = prompt.replace(inputPlaceholder, input);

  return {
    prompt: newPrompt,
    error: null,
  };
};

export async function getAIResponse(
  apiKey: string,
  input: string,
  prompt: string,
  model: string,
  maxTokens: number
) {
  const groq = new Groq({
    apiKey,
  });

  // const params: CompletionCreateParams = {
  //   messages: [
  //     {
  //       role: 'system',
  //       content:
  //         'You are a typescript assistant. You are to write a single JSdoc or a single comment. You only respond with the text itself, no other text or information.',
  //     },
  //     {
  //       role: 'user',
  //       content: prompt,
  //     },
  //   ],
  // };

  try {
    const result = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: generateJSDocPrompt,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: model ?? 'llama3-8b-8192',
      max_tokens: maxTokens,
      stream: false,
    });

    return {
      error: null,
      result: result,
    };
  } catch (error) {
    console.log(error);
    return {
      error: error,
      result: null,
    };
  }
}
