import Provider from '../common/provider.js';
import Generate from './generate.js';
import Models from './models.js';

export default class Local extends Provider
{
    id = "local";
    name = "Local";
    keys = "https://github.com/farlenkov/obsidian-canvas-llm#local-runtimes";
    models = "https://github.com/farlenkov/obsidian-canvas-llm#local-runtimes";
    isLocal = true;
        
    ModelsRequest = Models;
    GenerateRequest = Generate;

    constructor(settings)
    {
        super();
        this.init(settings);
        this.settingsLinkLabel = "View tested local runtimes";
        this.settingsInputLabel = "Base url, http://localhost:1234/v1";
    }
}