import Provider from './provider.js';

export default class SambaNova extends Provider
{
    id = "sambanova";
    name = "SambaNova";
    keys = "https://cloud.sambanova.ai/apis";
    models = "https://cloud.sambanova.ai/plans/pricing";
    temperature = [0, 1, 1];

    constructor(settings)
    {
        super();
        this.init(settings);
    }

    // https://docs.sambanova.ai/cloud/api-reference/endpoints/model-list

    GetFetchUrl()
    {
        return "https://api.sambanova.ai/v1/models";
    }

    GetFetchHeaders()
    {
        return {};
    }

    ReadModel(model)
    {
        return { 
            id : model.id,
            name : model.id,
            desc : model.id,
            context : model.context_length,
            owner : model.owned_by || this.name,
            prompt : parseFloat(model.pricing.prompt),
            completion : parseFloat(model.pricing.completion) };
    }

    // https://docs.sambanova.ai/cloud/api-reference/endpoints/chat

    GetModelUrl(model, key)
    {
        return "https://api.sambanova.ai/v1/chat/completions";
    }

    GetModelHeaders(key)
    {
        return {
            "Content-Type" : "application/json",
            "Authorization" : "Bearer " + key };
    }

    ReadResponse(data)
    {            
        if (!data?.choices)
            return [""];
        else
            return [data.choices[0].message.content];
    }
}