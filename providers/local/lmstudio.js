import Provider from '../common/provider.js';
import Generate from './generate.js';
import Models from './models.js';

export default class LMStudio extends Provider
{
    id = "lmstudio";
    name = "LM Studio";
    keys = "https://lmstudio.ai/docs/developer/core/server";
    models = "https://lmstudio.ai/docs/app/basics/download-model";
    // temperature = [0, 2, 1];
    isLocal = true;
        
    ModelsRequest = Models;
    GenerateRequest = Generate;

    constructor(settings)
    {
        super();
        this.init(settings);
        this.settingsLinkLabel = "View LM Studio quickstart guide";
        this.settingsInputLabel = "Base url, http://localhost:1234/v1";
    }
}