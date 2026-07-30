import ModelsRequest from '../common/models.js';

export default class DeepSeekModels extends ModelsRequest
{
    // https://api-docs.deepseek.com/api/list-models

    GetUrl()
    {
        return "https://api.deepseek.com/models";
    }
}