import Alibaba      from './alibaba.js';
import Anthropic    from './anthropic.js';
import DeepSeek     from './deepseek.js';
import Google       from './google.js';
import Groq         from './groq.js';
import OpenAI       from './openai.js';
import OpenRouter   from './openrouter.js';
import SambaNova    from './sambanova.js';
import xAI          from './xai.js';

class ProviderInfo
{
    List = 
    [
        new Alibaba(),
        new Anthropic(),
        new DeepSeek(),
        new Google(),
        new Groq(),
        new OpenAI(),
        new OpenRouter(),
        new SambaNova(),
        new xAI()
    ];

    constructor ()
    {
        this.ById = {};
        this.List.forEach(provider => this.ById[provider.id] = provider);
    }
}

const providerInfo = new ProviderInfo();
export default providerInfo;