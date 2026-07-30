import providers from "./ProviderInfo.js"

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

        // CALL LLM

        let result = await provider.callModel(model, messages, mcp);

        if (!result?.text &&
            !result?.think)
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