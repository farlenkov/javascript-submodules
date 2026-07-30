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
            contents : this.messages,
            generationConfig : {},  
            safetySettings : 
            [
                // https://ai.google.dev/api/generate-content#v1beta.SafetySetting

                { category : "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold : "BLOCK_NONE" },
                { category : "HARM_CATEGORY_DANGEROUS_CONTENT", threshold : "BLOCK_NONE" },
                { category : "HARM_CATEGORY_CIVIC_INTEGRITY", threshold : "BLOCK_NONE" },
                { category : "HARM_CATEGORY_HATE_SPEECH", threshold : "BLOCK_NONE" },
                { category : "HARM_CATEGORY_HARASSMENT", threshold : "BLOCK_NONE" }
            ]
        };

        if (this.tools.length > 0)
            body.tools = this.tools;

        body.generationConfig.thinkingConfig = { includeThoughts : true };
        return body;
    }

    async ReadResponse(data)
    {
        const content = data?.candidates?.[0]?.content;

        if (data?.promptFeedback?.blockReason)
            throw data.promptFeedback.blockReason;

        if (!content)
            throw this.emptyError;

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

            this.result = result;
            return;
        }

        // CALL MCP
        // https://ai.google.dev/gemini-api/docs/generate-content/function-calling#thinking

        const parts = [];

        for (const part of functionCalls)
        {
            const functionResponse = await this.mcp.functionCall(part.functionCall);

            if (functionResponse)
            {
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
        }

        if (parts.length > 0)
        {
            this.messages.push(content);
            this.messages.push ({ role : "user", parts : parts });
        }
    }
}