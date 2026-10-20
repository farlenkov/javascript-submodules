import providers from "./Providers.js"
import settings from '../settings/Settings.svelte.js';

class Models
{    
    constructor ()
    {
        this.readLocal ();
    }

    async readLocal ()
    {
        while (!settings.settings?.Data)
            await new Promise(resolve => setTimeout(resolve, 1));

        while (!providers.List)
            await new Promise(resolve => setTimeout(resolve, 1));

        providers.List.forEach(provider => 
        {
            let models = settings.GetModels(provider.id);
            provider.ModelById = {};

            models.forEach(model =>
            {
                model.providerId = provider.id;
                provider.ModelById[model.id] = model;
            });
        });
    }

    async fetchModels(providerId)
    {
        let error = null;

        try
        {
            const provider = providers.ById[providerId];
            const models = await provider.fetchModels();            
            
            settings.SetModels(providerId, models);
            settings.save();
            this.readLocal();
        }
        catch (ex)
        {
            error = ex;
            // throw ex;
        }

        return error;
    }
}

const modelInfo = new Models();
export default modelInfo;