import GenerateRequest from '../common/generate.js';

export default class xAIGenerate extends GenerateRequest
{
    // https://docs.x.ai/docs/guides/chat

    GetModelUrl(model, key)
    {
        return "https://api.x.ai/v1/chat/completions";
    }
}