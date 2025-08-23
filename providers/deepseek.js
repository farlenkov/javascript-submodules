import Provider from './provider.js';

export default class DeepSeek extends Provider
{
    id = "deepseek";
    name = "DeepSeek";
    keys = "https://platform.deepseek.com/api_keys";
    models = "https://api-docs.deepseek.com/quick_start/pricing";

    constructor(settings)
    {
        this.settings = settings;
    }

    // https://api-docs.deepseek.com/api/list-models

    GetFetchUrl()
    {
        return "https://api.deepseek.com/models";
    }

    GetFetchHeaders()
    {
        return {
            "Authorization" : `Bearer ${this.settings.deepseekKey}`,
            "Accept" : "application/json"
        };
    }

    // https://api-docs.deepseek.com/

    GetModelUrl(model)
    {
        return "https://api.deepseek.com/chat/completions";
    }

    GetModelHeaders()
    {
        return {
            "Content-Type" : "application/json",
            "Authorization" : "Bearer " + this.settings.deepseekKey
        };
    }
}