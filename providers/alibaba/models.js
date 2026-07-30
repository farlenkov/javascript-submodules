import ModelsRequest from '../common/models.js';

export default class AlibabaModels extends ModelsRequest
{
    // https://www.alibabacloud.com/help/en/model-studio/models

    GetUrl()
    {
        return "https://github.com/farlenkov/obsidian-canvas-llm/raw/refs/heads/master/assets/data/qwen.json";
    }

    GetHeaders()
    {
        return {};
    }

    ReadModel(model)
    {
        model.owner = this.name;
        return model;
    }
}