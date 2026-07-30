import Provider from '../common/provider.js';
import Generate from './generate.js';
import Models from './models.js';

export default class OpenAI extends Provider
{
    id = "openai";
    name = "OpenAI";
    keys = "https://platform.openai.com/api-keys";
    models = "https://platform.openai.com/docs/pricing";
    temperature = [0, 2, 1];
        
    ModelsRequest = Models;
    GenerateRequest = Generate;

    constructor(settings)
    {
        super();
        this.init(settings);
    }
}