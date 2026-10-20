import GenerateRequest from '../common/generate.js';

export default class GoogleGenerate extends GenerateRequest
{
    // https://ai.google.dev/api/generate-content#v1beta.GenerationConfig
    // https://ai.google.dev/gemini-api/docs/text-generation#system-instructions
    // https://ai.google.dev/gemini-api/docs/text-generation#multi-turn-conversations 

    GetModelUrl(model, key)
    {
        return `https://generativelanguage.googleapis.com/v1beta/models/${model.id}:generateContent`;
    }

    GetModelHeaders(key)
    {
        return {
            "Content-Type" : "application/json",
            "x-goog-api-key" : key };
    }

    ConvertMessage(message)
    {
        return { 

            parts : 
            [{
                text : message.role == "system" 
                    ? `*${message.content}*` 
                    :     message.content
            }],
            
            role : message.role == "system" 
                ? "user" 
                : message.role };
    }

    ConvertTool(tool)
    {
        return { functionDeclarations : 
        [{
            name : tool.name,
            description : tool.description,

            parameters : 
            {
                type : tool.inputSchema.type,
                required : tool.inputSchema.required,
                properties : tool.inputSchema.properties
            }
        }]};
    }

    GetModelBody()
    {
        const body = 
        {
            contents : this.messages
        };

        if (this.tools.length > 0)
            body.tools = this.tools;

        return body;
    }

    async ReadResponse(data)
    {
        const candidate = data?.candidates?.[0];
        const content = candidate?.content;
        const finishReason = candidate?.finishReason;
        const finishMessage = candidate?.finishMessage;
        const blockReason = data?.promptFeedback?.blockReason;

        if (!content?.parts)
        {
            if (blockReason)
                throw blockReason;

            if (finishMessage)
                throw finishMessage;

            if (finishReason)
                throw finishReason;

            throw this.emptyError;
        }
            
        const functionCalls = content.parts.filter(part => part.functionCall ? true : false);

        // DONE

        if (functionCalls.length == 0)
        {
            const result = {}
            
            for (const part of content.parts)
            {
                if (part.thought)
                    result.think = part.text;
                else
                    result.text = part.text;
            }

            this.readUsage(data, result);
            this.result = result;
            return;
        }

        // CALL MCP
        // https://ai.google.dev/gemini-api/docs/generate-content/function-calling#thinking

        const parts = [];
        // TODO: If every functionCall returns null, parts stays empty → nothing pushed to this.messages → this.result never set → while (!this.result) re-POSTs the identical request forever.

        for (const part of functionCalls)
        {
            const functionResponse = await this.mcp.functionCall(part.functionCall);

            if (!functionResponse)
                continue;
            
            parts.push
            ({ 
                functionResponse : 
                { 
                    id : part.functionCall.id,
                    name : part.functionCall.name,
                    response : { result : { content : functionResponse.content }}
                }
            });
        }

        if (parts.length > 0)
        {
            this.messages.push(content);
            this.messages.push ({ role : "user", parts : parts });
        }
    }

    readUsage(data, result)
    {
        result.usage =
        {
            input : data.usageMetadata?.promptTokenCount,
            output : data.usageMetadata?.candidatesTokenCount
        }
    }
}