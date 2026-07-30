import ModelsRequest from '../common/models.js';

export default class SambaNovaModels extends ModelsRequest
{
    // https://docs.sambanova.ai/cloud/api-reference/endpoints/model-list

    GetUrl()
    {
        return "https://api.sambanova.ai/v1/models";
    }

    GetHeaders()
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
}