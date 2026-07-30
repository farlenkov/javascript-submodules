import Provider from '../common/provider.js';
import Generate from './generate.js';
import Models from './models.js';

export default class Alibaba extends Provider
{
    id = "alibaba";
    name = "Alibaba";
    keys = "https://modelstudio.console.alibabacloud.com/?tab=playground#/api-key";
    models = "https://www.alibabacloud.com/help/en/model-studio/models";
    temperature = [0, 2, 1];
    untested = true;
    
    ModelsRequest = Models;
    GenerateRequest = Generate;

    constructor(settings)
    {
        super();
        this.init(settings);
    }
}