import ModelsRequest from '../common/models.js';

export default class xAIModels extends ModelsRequest
{
    // https://docs.x.ai/docs/api-reference#list-models

    GetUrl()
    {
        return "https://api.x.ai/v1/models";
    }
}