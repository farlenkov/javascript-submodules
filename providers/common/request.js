export default class ProviderRequest
{
    constructor(provider)
    {
        this.provider = provider;
        this.settingsLLM = provider.settings;
        this.settings = provider.settings.settings;
    }

    getKey(type)
    {
        const keys = this.settings.Data[`${this.provider.id}Key`].trim().split("\n");
        const index = this.settings.up(`${this.provider.id}${type}Counter`);
        return keys[index % keys.length].trim();
    }

    async CallHttp(options, note)
    {
        try
        {
            console.groupCollapsed(`[LLM] ${note}`);
            console.log("↗", options);
            
            const start = performance.now();
            const relay = this.settingsLLM.GetRelay();
            let resp;

            if (!relay || this.provider.isLocal)
            {
                resp = await requestUrl(options);
            }
            else
            {
                const throwOpt = options.throw;
                delete options.throw;

                resp = await requestUrl
                ({
                    url : relay,
                    method : "POST",
                    throw : throwOpt,
                    body : JSON.stringify(options)
                });
            }

            const duration = (performance.now() - start) / 1000;
            console.log("↙", `${(duration).toFixed(3)}s`, resp);
            
            // PARSE

            const text = await resp.text;
            const data = this.ParseResponse(text);
            this.CheckError(data);

            console.groupEnd();
            return data;
        }
        catch (err)
        {
            console.groupEnd();
            throw err;
        }
    }

    ParseResponse(text)
    {
        try
        {
            const data = JSON.parse(text);
            return data;
        }
        catch(ex)
        {
            throw text;
        }
    }

    CheckError(data)
    {
        if (typeof data?.error == "string")
            throw data.error;

        if (typeof data?.error?.message == "string")
            throw data.error.message;
    }
}