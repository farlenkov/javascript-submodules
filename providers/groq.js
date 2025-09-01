import Provider from './provider.js';

export default class Groq extends Provider
{
    id = "groq";
    name = "Groq";
    keys = "https://console.groq.com/keys";
    models = "https://console.groq.com/docs/models";
    temperature = [0, 2, 1];

    constructor(settings)
    {
        super();
        this.settings = settings;
    }

    // https://console.groq.com/docs/api-reference#models-list

    GetFetchUrl()
    {
        return "https://api.groq.com/openai/v1/models";
    }

    GetFetchHeaders()
    {
        return {
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${this.getKey("Models")}`
        };
    }

    // https://console.groq.com/docs/api-reference#chat-create

    GetModelUrl(model)
    {
        return "https://api.groq.com/openai/v1/chat/completions";
    }

    GetModelHeaders()
    {
        return {
            "Content-Type" : "application/json",
            "Authorization" : "Bearer " + this.getKey("Text")
        };
    }
}