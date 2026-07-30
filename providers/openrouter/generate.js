import GenerateRequest from '../common/generate.js';

export default class OpenRouterGenerate extends GenerateRequest
{
    // https://openrouter.ai/docs/quick-start

    GetModelUrl(model, key)
    {
        return "https://openrouter.ai/api/v1/chat/completions";
    }
}