import Provider from '../common/provider.js';
import Generate from './generate.js';
import Models from './models.js';

export default class xAI extends Provider
{
    id = "xai";
    name = "xAI";
    keys = "https://console.x.ai/team/default/api-keys";
    models = "https://docs.x.ai/docs/models";
    temperature = [0, 2, 1];
        
    ModelsRequest = Models;
    GenerateRequest = Generate;

    constructor(settings)
    {
        super();
        this.init(settings);
    }
}