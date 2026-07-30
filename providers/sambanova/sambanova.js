import Provider from '../common/provider.js';
import Generate from './generate.js';
import Models from './models.js';

export default class SambaNova extends Provider
{
    id = "sambanova";
    name = "SambaNova";
    keys = "https://cloud.sambanova.ai/apis";
    models = "https://cloud.sambanova.ai/plans/pricing";
    temperature = [0, 1, 1];
        
    ModelsRequest = Models;
    GenerateRequest = Generate;

    constructor(settings)
    {
        super();
        this.init(settings);
    }
}