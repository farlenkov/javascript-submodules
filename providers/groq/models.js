import ModelsRequest from '../common/models.js';

export default class GroqModels extends ModelsRequest
{
    // https://console.groq.com/docs/api-reference#models-list

    GetUrl()
    {
        return "https://api.groq.com/openai/v1/models";
    }
}