import Provider from '../common/provider.js';
import Generate from './generate.js';
import Models from './models.js';

export default class OpenRouter extends Provider
{
    id = "openrouter";
    name = "OpenRouter";
    keys = "https://openrouter.ai/settings/keys";
    models = "https://openrouter.ai/models";
    price = true;
    temperature = [0, 2, 1];
        
    ModelsRequest = Models;
    GenerateRequest = Generate;

    constructor(settings)
    {
        super();
        this.init(settings);
    }
}