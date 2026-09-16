import ModelsRequest from '../common/models.js';

export default class LocalModels extends ModelsRequest
{
    // https://docs.ollama.com/api/openai-compatibility#/v1/models
    // https://lmstudio.ai/docs/developer/openai-compat/models

    GetUrl()
    {
        const baseUrl = this.getKey("Fetch")
        return baseUrl.replace(/\/+$/, '') + "/models"; 
    }

    GetHeaders()
    {
        return { 
            "Content-Type" : "application/json", 
            "Accept" : "application/json" };
    }
}