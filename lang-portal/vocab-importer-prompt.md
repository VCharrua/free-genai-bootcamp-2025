Give me (please) vocabulary language importer where we have a text field that allows us to import a thematic category for the generation of language vocabulary.

When submitting that text field, it should hit an api endpoint (api route in the app router) to invoke an LLM chat completions in Groq (LLM) on the server-side and then pass that information back to the front-end.

It has to create a structured json output like this example:
```
[{"portuguese": "água","kimbundu": "maza","english": "water","parts": [{"portuguese": "ág","kimbundu": ["ma"],"english": "water"}] },{"portuguese": "escola","kimbundu": "xikola","english": "school","parts": [{"portuguese": "escol","kimbundu": ["xikol"],"english": "learn"}]}]
```

The json that is outputted back to the front-end should be copy-able... so it should be sent to an input field and there should be a copy button so that it can be copied to the clipboard and that should give an alert that is was copied to the user's clipboard.

The app should use app router and the latest version of next.js... and the llm calls should run in an api route on the server-side.