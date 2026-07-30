import ModelsRequest from '../common/models.js';

export default class GoogleModels extends ModelsRequest
{
    // https://ai.google.dev/api/models#models_list-SHELL

    GetUrl()
    {
        return "https://generativelanguage.googleapis.com/v1beta/models?key=" + this.getKey("Models");
    }

    GetHeaders()
    {
        return {};
    }

    ReadModels(data)
    {
        const result = [];

        data.models.forEach(model => 
        {
            if (model.supportedGenerationMethods.indexOf('generateContent') < 0)
                return;

            result.push
            ({ 
                id : model.name.replace("models/", ""),
                name : model.displayName,
                desc : model.description,
                owner : this.name,
                context : model.inputTokenLimit,
                prompt : -1,
                completion : -1
            })
        });

        return result;
    }
}