import GenerateRequest from '../common/generate.js';

export default class SambaNovaGenerate extends GenerateRequest
{
    // https://docs.sambanova.ai/cloud/api-reference/endpoints/chat

    GetModelUrl(model, key)
    {
        return "https://api.sambanova.ai/v1/chat/completions";
    }

    async ReadResponse(data)
    {            
        if (!data?.choices)
            throw this.emptyError;

        this.result = { text : data.choices[0].message.content };
        this.parseThinkTag(this.result);
    }
}