import ModelsRequest from '../common/models.js';

export default class OllamaModels extends ModelsRequest
{
    // https://docs.ollama.com/api/tags

    GetUrl()
    {
        const baseUrl = this.getKey("Fetch")
        return baseUrl.replace(/\/+$/, '') + "/tags"; 
    }

    GetHeaders()
    {
        return { "Content-Type" : "application/json" };
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
}