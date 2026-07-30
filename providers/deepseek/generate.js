import GenerateRequest from '../common/generate.js';

export default class DeepSeekGenerate extends GenerateRequest
{
    // https://api-docs.deepseek.com

    GetModelUrl(model, key)
    {
        return "https://api.deepseek.com/chat/completions";
    }
}