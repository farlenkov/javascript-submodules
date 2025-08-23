import Provider from './provider.js';

export default class Groq extends Provider
{
    id = "groq";
    name = "Groq";
    keys = "https://console.groq.com/keys";
    models = "";

    constructor(settings)
    {
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
            "Authorization" : `Bearer ${this.settings.groqKey}`
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
            "Authorization" : "Bearer " + this.settings.groqKey
        };
    }
}