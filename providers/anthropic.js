import Provider from './provider.js';

export default class Anthropic extends Provider
{
    id = "anthropic";
    name = "Anthropic";
    keys = "https://console.anthropic.com/account/keys";
    models = "https://docs.anthropic.com/en/docs/about-claude/pricing";
    temperature = [0, 1, 1];

    constructor(settings)
    {
        super();
        this.init(settings);
    }

    // https://docs.anthropic.com/en/api/models-list

    GetFetchUrl()
    {
        return "https://api.anthropic.com/v1/models?limit=1000";
    }

    GetFetchHeaders()
    {
        return {
            "x-api-key" : this.getKey("Models"),
            "content-type" : "application/json",
            "anthropic-version" : "2023-06-01" };
    }

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

    GetModelBody(model, messages)
    {
        return {
            model : model.id,
            messages : messages,
            max_tokens : 4096 };
    }

    ReadResponse(data)
    {
        if (!data?.content)
            return [""];

        let text = "";
        let thought = "";

        for(const content of data.content)
        {
            if (content.type === "text")
                text = content.text;
            else if (content.type === "thinking")
                thought = content.thinking;
        }

        if (thought)
            return [text, thought];
        else
            return [text];
    }
}