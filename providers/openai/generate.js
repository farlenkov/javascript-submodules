import GenerateRequest from '../common/generate.js';

export default class OpenAIGenerate extends GenerateRequest
{
    // https://platform.openai.com/docs/quickstart?language-preference=curl
    // https://platform.openai.com/docs/guides/text-generation#conversations-and-context
    // https://platform.openai.com/docs/api-reference/chat/create#chat_create-temperature

    GetModelUrl(model, key)
    {
        return "https://api.openai.com/v1/chat/completions";
    }

    GetModelBody()
    {
        const body = super.GetModelBody();

        if (body.tools)
            body.reasoning_effort = "none";
        
        return body;
    }
}