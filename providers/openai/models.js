import ModelsRequest from '../common/models.js';

export default class OpenAIModels extends ModelsRequest
{
    // https://platform.openai.com/docs/api-reference/models/list

    GetUrl()
    {
        return "https://api.openai.com/v1/models";
    }
}