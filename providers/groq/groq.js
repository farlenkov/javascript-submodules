import Provider from '../common/provider.js';
import Generate from './generate.js';
import Models from './models.js';

export default class Groq extends Provider
{
    id = "groq";
    name = "Groq";
    keys = "https://console.groq.com/keys";
    models = "https://console.groq.com/docs/models";
    temperature = [0, 2, 1];
        
    ModelsRequest = Models;
    GenerateRequest = Generate;

    constructor(settings)
    {
        super();
        this.init(settings);
    }    
}