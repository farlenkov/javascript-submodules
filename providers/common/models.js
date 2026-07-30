import ProviderRequest from './request.js'

export default class ModelsRequest extends ProviderRequest
{
    constructor(provider)
    {
        super(provider);
    }

    async exec()
    {
        const options = 
        {
            throw : false,
            url : this.GetUrl(),
            headers : this.GetHeaders()
        };
        
        const data = await this.CallHttp(options, `Fetch Models: ${this.provider.name}`);
        const result = this.ReadModels(data);
        return result;
    }

    GetHeaders()
    {
        return {
            "Authorization" : "Bearer " + this.getKey("Models"),
            "Content-Type" : "application/json", 
            "Accept" : "application/json" };
    }

    ReadModels(data)
    {
        const result = data.data.map(model => this.ReadModel(model));
        return result;
    }

    ReadModel(model)
    {
        return { 
            id : model.id,
            name : model.display_name || model.displayName || model.id,
            desc : model.description || model.display_name || model.displayName || model.id,
            owner : model.owned_by || this.name,
            context : model.context_window || model.context_length || -1,
            prompt : -1,
            completion : -1 };
    }
}