import Provider from './provider.js';

export default class Ollama extends Provider
{
    id = "ollama";
    name = "Ollama";
    keys = "https://docs.ollama.com/quickstart";
    models = "https://ollama.com/search";
    temperature = [0, 2, 1];

    isLocal = true;

    constructor(settings)
    {
        super();
        this.init(settings);
        this.settingsLinkLabel = "View Ollama quickstart guide";
        this.settingsInputLabel = "Base url, http://localhost:11434/api";
    }

    // https://docs.ollama.com/api/tags

    GetFetchUrl()
    {
        const baseUrl = this.getKey("Fetch")
        return baseUrl.replace(/\/+$/, '') + "/tags"; 
    }

    GetFetchHeaders()
    {
        return {
            "Content-Type" : "application/json"
        };
    }

    ReadModels(data)
    {
        const result = [];

        data.models.forEach(model => 
        {
            result.push(
            { 
                id : model.name,
                name : model.name,
                desc : model.model,
                owner : this.name,
                context : -1,
                prompt : -1,
                completion : -1
            })
        });

        return result;
    }

    // https://docs.ollama.com/api/chat

    GetModelUrl(model, baseUrl)
    {
        return baseUrl.replace(/\/+$/, '') + "/chat";
    }

    GetModelHeaders(key)
    {
        return {
            "Content-Type" : "application/json",
        };
    }

    ReadResponse(data)
    {
        if (!data?.message?.content)
            return [""];

        let content = data.message.content;
        let thinking = data.message.thinking;

        if (thinking)
            return [content, thinking];
        else
            return [content];
    }
}