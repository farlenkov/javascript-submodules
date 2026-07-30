import GenerateRequest from '../common/generate.js';

export default class AnthropicGenerate extends GenerateRequest
{
    // https://docs.anthropic.com/en/api/getting-started
    // https://docs.anthropic.com/en/api/messages
    // https://docs.anthropic.com/en/api/messages#body-thinking

    GetModelUrl(model, key)
    {
        return "https://api.anthropic.com/v1/messages";
    }

    GetModelHeaders(key)
    {
        return {
            "x-api-key" : key,
            "content-type" : "application/json",
            "anthropic-version" : "2023-06-01",
            "anthropic-dangerous-direct-browser-access" : "true" };
    }

    GetModelBody()
    {
        const body = super.GetModelBody();
        body.max_tokens = 4096;
        
        return body;
    }

    ConvertTool(tool)
    {
        return {

            name : tool.name,
            description : tool.description,
            input_schema : tool.inputSchema
        };
    }

    async ReadResponse(data)
    {
        if (!data?.content?.length)
            throw this.emptyError;

        const calls = data.content.filter(part => part.type === "tool_use");

        // DONE

        if (calls.length == 0)
        {
            const result = {};

            for (const content of data.content)
            {
                if (content.type === "text")
                    result.text = content.text;

                else if (content.type === "thinking")
                    result.think = content.thinking;
            }

            this.result = result;
            return;
        }

        // CALL MCP

        const results = [];

        for (const call of calls) 
        {
            const result = await this.mcp.functionCall
            ({
                name : call.name,
                arguments : call.input,
            });

            results.push
            ({
                type : "tool_result",
                tool_use_id : call.id,
                content : result.content,
            });
        }

        this.messages.push
        ({
            role: "assistant",
            content: data.content,
        });
        
        this.messages.push
        ({
            role: "user",
            content: results,
        });
    }
}