import Provider from '../common/provider.js';
import Generate from './generate.js';
import Models from './models.js';

export default class Anthropic extends Provider
{
    id = "anthropic";
    name = "Anthropic";
    keys = "https://console.anthropic.com/account/keys";
    models = "https://docs.anthropic.com/en/docs/about-claude/pricing";
        
    ModelsRequest = Models;
    GenerateRequest = Generate;

    constructor(settings)
    {
        super();
        this.init(settings);
    }
}