import GenerateRequest from '../common/generate.js';

export default class GroqGenerate extends GenerateRequest
{
    // https://console.groq.com/docs/api-reference#chat-create

    GetModelUrl(model, key)
    {
        return "https://api.groq.com/openai/v1/chat/completions";
    }
}