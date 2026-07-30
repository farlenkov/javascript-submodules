import Provider from '../common/provider.js';
import Generate from './generate.js';
import Models from './models.js';

export default class Ollama extends Provider
{
    id = "ollama";
    name = "Ollama";
    keys = "https://docs.ollama.com/quickstart";
    models = "https://ollama.com/search";
    temperature = [0, 2, 1];
    isLocal = true;
        
    ModelsRequest = Models;
    GenerateRequest = Generate;

    constructor(settings)
    {
        super();
        this.init(settings);
        this.settingsLinkLabel = "View Ollama quickstart guide";
        this.settingsInputLabel = "Base url, http://localhost:11434/api";
    }
}