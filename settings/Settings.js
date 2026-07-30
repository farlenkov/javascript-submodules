class SettingsState
{
    getDefaults()
    {
        return {
            defaultModel : "gemini-3-flash-preview",
            defaultProvider : "google",
            recentModels : [],
            launchCounter : 0 };
    }

    async Init (plugin)
    {
        this.plugin = plugin;
        this.settings = plugin.settings;
    }

    async save ()
    {
        await this.settings.save();
    }

    // API KEYS

    HasKey (providerId)
    {
        return this.settings.Data[providerId + "Key"] ? true : false;
    }

    GetKey (providerId)
    {
        return this.settings.Data[providerId + "Key"];
    }

    // AI MODELS

    HasModels (providerId)
    {
        let models = this.settings.Data[providerId + "Models"];

        if (!models)
            return false;
        else
            return models.length > 0;
    }

    GetModels (providerId)
    {
        return this.settings.Data[providerId + "Models"] || [];
    }

    SetModels (providerId, models)
    {
        return this.settings.Data[providerId + "Models"] = models;
    }

    AddRecentModel (model)
    {
        const data = this.settings.Data;

        try
        {
            for (var i = 0; i < data.recentModels.length; i++)
            {
                var recentModel = data.recentModels[i];

                if (recentModel.providerId == model.providerId &&
                    recentModel.id == model.id)
                {
                    data.recentModels.splice(i, 1);
                    i--
                }
            }

            data.recentModels.unshift(model);

            while (data.recentModels.length > 14)
                data.recentModels.splice(13, 1);

            this.save();
        }
        catch (ex)
        {
            console.error(ex);
        }
    }

    GetDefaultModel ()
    {
        const data = this.settings.Data;
        
        if (!data.recentModels ||
            data.recentModels.length == 0)
        {
            return {
                providerId : data.defaultProvider,
                id : data.defaultModel };
        }
        else
        {
            return data.recentModels[0];
        }
    }

    // OTHER

    GetRelay ()
    {
        return this.settings.Data.relay;
    }
}

const settings = new SettingsState();
export default settings;