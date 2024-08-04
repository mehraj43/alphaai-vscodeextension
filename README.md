# Alpha AI · An AI-Powered Extension

Easily generate JSDocs

Currently supports TypeScript and Javascript.

### Quick Setup
1. Provide your Groq key in the settings.
2. The default model is "llama3-8b-8192" you can change it anytime in configuration setting. See [Groq Site](https://console.groq.com/settings/limits) for other values and token limits and decide which model you want to use.

If you don't already have an Groq key, you'll have to get one from [Groq](https://console.groq.com/keys). You have to use your own key, sorry.


### Usage
Select some code and right-click or use shortcut key(ctrl+alt+shift+m), choose the option "Aplha AI: Generate JSDocs" to generate a comment above your selection.

##### How it works:
- Upon selecting a portion of code, the model receives this selection as input and generates a corresponding comment. Users can customize the prompt and other settings through the application's configuration options.
- The system determines the type of comment to generate based on the nature of the selected code. For instance, if a function is chosen, a JSDoc-style comment is produced; for general code snippets, a standard comment is generated.
- Generated comments and JSDocs are automatically formatted with proper indentation to ensure compatibility with code formatting tools such as Prettier.

### Settings
To configure these settings, navigate to your VSCode settings, proceed to the Extensions tab, and locate "Alpha AI". For those who prefer working directly with JSON, below are the keys for each setting:
- **alphaai.apiKey** - Your GROQ API key required for authentication.
- **alphaai.prompt** - Specifies the prompt sent to the model. Remember to use empty curly braces {} to denote where your code snippet should be included within the prompt.
- **alphaai.model** - Selects the model utilized for generating content. Additional models can be found on the [Groq Site](https://console.groq.com/settings/limits) for more options.
- **alphaai.maxTokens** - Defines the maximum number of tokens to be generated per session. Increasing this limit allows for more verbose output, whereas reducing it helps manage token consumption efficiently.
- **alphaai.allowSingleLineSelection** - Determines whether single-line selections are permissible for generating documentation. Although multi-line inputs typically yield superior results, enabling this option can prove beneficial for documenting concise functions or methods.

### GitHub Profile
- [GitHub Profile](https://github.com/mehraj43)

**Enjoy!**
