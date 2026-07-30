import ProviderRequest from './request.js'

export default class GenerateRequest extends ProviderRequest
{
    emptyError = "API provider respond with empty message";

    constructor(provider, model, messages, mcp)
    {
        super(provider);

        this.mcp = mcp;
        this.model = model;
        this.tools = this.ConvertTools(mcp.tools);
        this.messages = this.ConvertMessages(messages);

        this.request = 
        {
            throw : false,
            method: 'POST'
        };
    }

    async exec()
    {
        try 
        {
            while (!this.result)
            {
                const key = this.getKey("Text");
                const body = this.GetModelBody();

                this.request.url = this.GetModelUrl(this.model, key);
                this.request.headers = this.GetModelHeaders(key);
                this.request.body = JSON.stringify(body);

                const data = await this.CallHttp(this.request, `Call Model: ${this.provider.name} / ${this.model.id}`);
                await this.ReadResponse(data);
            }
            
            return this.result;
        } 
        catch (error) 
        {
            // console.error(`[LLM] CallModel ← ${this.provider.name} / ${this.model.name}`, error);
            throw error;
        }
    }

    ConvertMessages(messages)
    {
        return messages.map(this.ConvertMessage);
    }

    ConvertMessage(message)
    {
        return message;
    }

    ConvertTools(tools)
    {
        return tools.map(this.ConvertTool);
    }

    ConvertTool(tool)
    {
        return {

            strict : true,
            type : "function",
            function : 
            {
                name : tool.name,
                description : tool.description,

                parameters : 
                {
                    type : tool.inputSchema.type,
                    required : tool.inputSchema.required,
                    properties : tool.inputSchema.properties
                }
            }
        };
    }
    
    GetModelHeaders(key)
    {
        return {
            "Content-Type" : "application/json",
            "Authorization" : "Bearer " + key };
    }

    GetModelBody()
    {
        const body = 
        {
            model : this.model.id,
            messages : this.messages,
            tools : this.tools,
            stream : false 
        };

        if (this.tools.length > 0)
        {
            body.tools = this.tools;
            body.tool_choice = "auto";
        }

        return body;
    }

    async ReadResponse(data)
    {
        if (data?.choices?.[0].message?.tool_calls)
            await this.ReadTools(data.choices[0].message);
        else
            await this.ReadResult(data);
    }

    async ReadTools(message)
    {
        this.messages.push(message);

        for (const call of message.tool_calls)
        {
            const args = typeof call.function.arguments === 'string'
                ? JSON.parse(call.function.arguments)
                : call.function.arguments;
            
            const resp = await this.mcp.functionCall
            ({
                name : call.function.name,
                arguments : args
            });

            if (!resp)
                continue;

            const content = resp.content.map(item => 
            {
                if (item.type === "text") 
                    return item.text;
                else
                    return JSON.stringify(item);

            }).join("\n");

            this.messages.push
            ({
                role : "tool",
                tool_call_id : call.id,
                tool_name : call.function.name,
                content : content
            });
        }
    }

    async ReadResult(data)
    {
        if (!data?.choices)
            throw this.emptyError;

        const result = {};

        for (const choice of data.choices)
        {
            if (choice.message.reasoning)
                result.think = choice.message.reasoning;
            
            if (choice.message.reasoning_content)
                result.think = choice.message.reasoning_content;

            if (choice.message.content)
                result.text = choice.message.content;
        }

        this.parseThinkTag(result);
        this.result = result;
    }

    parseThinkTag(result)
    {
        if (result.text && 
            !result.think)
        {
            const thinkMatch = result.text.match(/<think>([\s\S]*?)<\/think>/);

            if (thinkMatch)
            { 
                result.think = thinkMatch[1].trim();
                result.text = result.text.replace(/<think>[\s\S]*?<\/think>/, "").trim();
            }
        }
    }
}