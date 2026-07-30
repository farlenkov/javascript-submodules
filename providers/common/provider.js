export default class Provider
{
    constructor()
    {

    }

    init (settings)
    {
        this.settings = settings;
        this.settingsLinkLabel = "Get API key for " + this.name;
        this.settingsInputLabel = "API key for " + this.name;
    }

    async fetchModels()
    {
        const req = new this.ModelsRequest(this);
        return await req.exec();
    }

    async callModel(model, messages, mcp)
    {
        const req = new this.GenerateRequest(this, model, messages, mcp);
        return await req.exec();
    }
    
    // SPEAK

    getVoices()
    {
        throw "Not implemented";
    }

    async speak(model, text)
    {
        throw "Not implemented";
    }
}