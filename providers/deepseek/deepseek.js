import Provider from '../common/provider.js';
import Generate from './generate.js';
import Models from './models.js';

export default class DeepSeek extends Provider
{
    id = "deepseek";
    name = "DeepSeek";
    keys = "https://platform.deepseek.com/api_keys";
    models = "https://api-docs.deepseek.com/quick_start/pricing";
    temperature = [0, 2, 1];
        
    ModelsRequest = Models;
    GenerateRequest = Generate;

    constructor(settings)
    {
        super();
        this.init(settings);
    }
}