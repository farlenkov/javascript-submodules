import GenerateRequest from '../common/generate.js';

export default class AlibabaGenerate extends GenerateRequest
{
    // https://www.alibabacloud.com/help/en/model-studio/multi-round-conversation

    GetModelUrl(model, key)
    {
        return "https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions";
    }
}