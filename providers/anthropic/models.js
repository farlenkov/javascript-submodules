import ModelsRequest from '../common/models.js';

export default class AnthropicModels extends ModelsRequest
{
    // https://docs.anthropic.com/en/api/models-list

    GetUrl()
    {
        return "https://api.anthropic.com/v1/models?limit=1000";
    }

    GetHeaders()
    {
        return {
            "x-api-key" : this.getKey("Models"),
            "content-type" : "application/json",
            "anthropic-version" : "2023-06-01" };
    }
}