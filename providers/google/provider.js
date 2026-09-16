import Provider from '../common/provider.js';
import Generate from './generate.js';
import Models from './models.js';

export default class Google extends Provider
{
    id = "google";
    name = "Google";
    keys = "https://aistudio.google.com/app/apikey";
    models = "https://ai.google.dev/gemini-api/docs/pricing";

    ModelsRequest = Models;
    GenerateRequest = Generate;

    constructor(settings)
    {
        super();
        this.init(settings);
    }
}



