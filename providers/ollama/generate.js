import GenerateRequest from '../common/generate.js';

export default class OllamaGenerate extends GenerateRequest
{
    // https://docs.ollama.com/api/chat

    GetModelUrl(model, baseUrl)
    {
        return baseUrl.replace(/\/+$/, '') + "/chat";
    }

    GetModelHeaders(key)
    {
        return { "Content-Type" : "application/json" };
    }

    GetModelBody()
    {
        const body = super.GetModelBody();
        body.think = false;
        return body;
    }

    async ReadResponse(data)
    {
        if (data?.message?.tool_calls)
        {
            await this.ReadTools(data.message);
            return;
        }
        
        if (!data?.message?.content &&
            !data?.message?.thinking)
            throw this.emptyError;

        this.result = 
        {
            text : data.message.content || "...",
            think : data.message.thinking 
        };
    }
}