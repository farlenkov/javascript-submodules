import providers from "./Providers.js"
import models from "./Models.js"
import settings from '../settings/Settings.js';

class AiClient
{
    async callModel(providerId, modelId, messages, mcp)
    {
        // GET PROVIDER

        const provider = providers.ById[providerId];
        const model = provider.ModelById[modelId];
        
        if (!provider)
            throw `[AiClient: Call] Invalid Provider ID: ${providerId}`;

        if (!model)
            throw `[AiClient: Call] Invalid Model ID: ${providerId} / ${modelId}`;

        // GET PARAMS

        const paramsKey = settings.getParamsKey(providerId, modelId);
        const modelParams = settings.getModelParams(paramsKey) || {};
        const providerParams = settings.getModelParams(providerId) || {};

        const callParams = Object.fromEntries(
            Object.entries({...providerParams, ...modelParams})
                .filter(([, v]) => v !== '' && v !== null && v !== undefined));

        // CALL LLM

        const result = await provider.callModel(model, messages, callParams, mcp);

        if (!result?.text)
            throw "API provider respond with empty message.";

        return result;
    }

    // SPEAK

    getVoices(providerId)
    {
        const provider = providers.ById[providerId];
        return provider.getVoices();
    }

    async speak(providerId, modelId, voice, text)
    {
        const provider = providers.ById[providerId];
        return await provider.speak(modelId, voice, text);
    }
}

const aiClient = new AiClient();
export default aiClient;