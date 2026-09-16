import { sleep, delay } from '$lib/svelte-obsidian/src/Async.js';

class SettingsState
{
    // FileVersion = 2;

    getDefaults()
    {
        return {
            defaultModel : "gemini-3-flash-preview",
            defaultProvider : "google",
            recentModels : [],
            // launchCounter : 0,
            modelParams :
            {
                anthropic : { max_tokens : 4096 },

                local : { reasoning_effort : "none" },

                google :
                {
                    generationConfig : { thinkingConfig : { includeThoughts : true }},

                    safetySettings : 
                    [
                        // https://ai.google.dev/api/generate-content#v1beta.SafetySetting

                        { category : "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold : "BLOCK_NONE" },
                        { category : "HARM_CATEGORY_DANGEROUS_CONTENT", threshold : "BLOCK_NONE" },
                        { category : "HARM_CATEGORY_CIVIC_INTEGRITY", threshold : "BLOCK_NONE" },
                        { category : "HARM_CATEGORY_HATE_SPEECH", threshold : "BLOCK_NONE" },
                        { category : "HARM_CATEGORY_HARASSMENT", threshold : "BLOCK_NONE" }
                    ]
                }
            }};
    }

    async Init (plugin)
    {
        this.plugin = plugin;
        this.settings = plugin.settings;
        await this.upgrade();
    }

    async upgrade()
    {
        while (!this.settings.Data)
            await sleep(1);

        let hasChanges = false;
        const data = this.settings.Data;

        // KEYS

        ['Key', 'Models', 'FetchCounter', 'TextCounter'].forEach(key => 
        {
            if (data['ollama' + key])
            {
                data['local' + key] = data['ollama' + key];
                delete data['ollama' + key];
                hasChanges = true;
            }
        });

        // RECENT MODELS

        if (data.recentModels)
        {
            for (const model of data.recentModels)
            {
                if (model.providerId === 'ollama')
                {
                    model.providerId = 'local';
                    hasChanges = true;
                }
            }
        }

        // MODEL PARAMS

        if (!data.modelParams)
        {
            const defaults = this.getDefaults();
            data.modelParams = defaults.modelParams;
            // data.version = this.FileVersion;
            hasChanges = true;
        }

        // SAVE

        if (hasChanges)
            await this.save();
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

    GetDefaultProvider ()
    {
        const data = this.settings.Data;
        return data.defaultProvider;
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

    // MODEL PARAMS
    
    getParamsKey(providerId, modelId)
    {
        return `${providerId}//${modelId}`;
    }

    setModelParams (key, params)
    {
        const data = this.settings.Data;

        if (!data.modelParams)
            data.modelParams = {};

        if (params)
            data.modelParams[key] = params;
        else
            delete data.modelParams[key];

        this.save();
    }

    getModelParams (key)
    {
        const data = this.settings.Data;
        return data.modelParams?.[key];
    }

    // OTHER

    GetRelay ()
    {
        return this.settings.Data.relay;
    }
}

const settings = new SettingsState();
export default settings;