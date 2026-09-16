import Alibaba      from '../providers/alibaba/provider.js';
import Anthropic    from '../providers/anthropic/provider.js';
import DeepSeek     from '../providers/deepseek/provider.js';
import Google       from '../providers/google/provider.js';
import Groq         from '../providers/groq/provider.js';
import Local        from '../providers/local/provider.js';
import OpenAI       from '../providers/openai/provider.js';
import OpenRouter   from '../providers/openrouter/provider.js';
import SambaNova    from '../providers/sambanova/provider.js';
import xAI          from '../providers/xai/provider.js';

import settings     from '../settings/Settings.js';

class Providers
{
    constructor ()
    {
        this.ById = {};
        this.init();
    }

    async init()
    {
        while (!settings.settings?.Data)
            await new Promise(resolve => setTimeout(resolve, 1));
        
        this.List = 
        [
            new Alibaba(settings),
            new Anthropic(settings),
            new DeepSeek(settings),
            new Google(settings),
            new Groq(settings),
            new Local(settings),
            new OpenAI(settings),
            new OpenRouter(settings),
            new SambaNova(settings),
            new xAI(settings)
        ];

        for (const provider of this.List)
            this.ById[provider.id] = provider;
    }
}

const providerInfo = new Providers();
export default providerInfo;