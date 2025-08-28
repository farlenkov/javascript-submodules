import Provider from './provider.js';

export default class Anthropic extends Provider
{
    id = "anthropic";
    name = "Anthropic";
    keys = "https://console.anthropic.com/account/keys";
    models = "https://docs.anthropic.com/en/docs/about-claude/pricing";

    constructor(settings)
    {
        super();
        this.settings = settings;
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
            "anthropic-version" : "2023-06-01"
        };
    }

    // https://docs.anthropic.com/en/api/getting-started
    // https://docs.anthropic.com/en/api/messages

    GetModelUrl(model)
    {
        return "https://api.anthropic.com/v1/messages";
    }

    GetModelHeaders()
    {
        return {
            "x-api-key" : this.getKey("Text"),
            "content-type" : "application/json",
            "anthropic-version" : "2023-06-01",
            "anthropic-dangerous-direct-browser-access" : "true"
        };
    }

    GetModelBody(model, messages)
    {
        return {
            model : model.id,
            messages : messages,
            max_tokens : 2048
        };
    }

    ReadResponse(data)
    {
        if (!data?.content)
            return [""];

        return data.content.map(content => content.text);
    }
}