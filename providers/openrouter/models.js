import ModelsRequest from '../common/models.js';

export default class OpenRouterModels extends ModelsRequest
{
    GetUrl()
    {
        return "https://openrouter.ai/api/v1/models";
    }

    GetHeaders()
    {
        return {};
    }

    ReadModel(model)
    {
        return { 
            id : model.id,
            name : model.name,
            desc : model.description,
            context : model.context_length,
            owner : model.owned_by || this.name,
            prompt : parseFloat(model.pricing.prompt),
            completion : parseFloat(model.pricing.completion) };
    }
}