import providers from "./Providers.js"
import settings from '../settings/Settings.js';
import { compareStrings } from '$lib/svelte-obsidian/src/String.js';

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
            models.sort((a, b) => compareStrings(a.id, b.id, true));

            // models.sort((a, b) => 
            // {
            //     const parts1 = a.id.split("/").length;
            //     const parts2 = b.id.split("/").length;

            //     if (parts1 === 1)
            //         return -1;

            //     if (parts2 === 1)
            //         return 1;

            //     return 0;
            // });

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