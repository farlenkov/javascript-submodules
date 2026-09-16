import GenerateRequest from '../common/generate.js';

export default class LocalGenerate extends GenerateRequest
{
    // https://docs.ollama.com/api/openai-compatibility#/v1/chat/completions
    // https://lmstudio.ai/docs/developer/openai-compat/chat-completions

    GetModelUrl(model, baseUrl)
    {
        return baseUrl.replace(/\/+$/, '') + "/chat/completions";
    }

    GetModelHeaders(key)
    {
        return { 
            "Content-Type" : "application/json", 
            "Accept" : "application/json" };
    }
}