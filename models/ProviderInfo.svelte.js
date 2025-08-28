import Alibaba      from '../providers/alibaba.js';
import Anthropic    from '../providers/anthropic.js';
import DeepSeek     from '../providers/deepseek.js';
import Google       from '../providers/google.js';
import Groq         from '../providers/groq.js';
import OpenAI       from '../providers/openai.js';
import OpenRouter   from '../providers/openrouter.js';
import SambaNova    from '../providers/sambanova.js';
import xAI          from '../providers/xai.js';

import settings          from '../settings/Settings.svelte.js';

class ProviderInfo
{
    constructor ()
    {
        this.init();
    }

    async init()
    {
        while (!settings.Data)
            await new Promise((resolve) => setTimeout(resolve, 1));
        
        this.List = 
        [
            new Alibaba(settings),
            new Anthropic(settings),
            new DeepSeek(settings),
            new Google(settings),
            new Groq(settings),
            new OpenAI(settings),
            new OpenRouter(settings),
            new SambaNova(settings),
            new xAI(settings)
        ];

        this.ById = {};
        this.List.forEach(provider => this.ById[provider.id] = provider);
    }
}

const providerInfo = new ProviderInfo();
export default providerInfo;