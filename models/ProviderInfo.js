import Alibaba      from '../providers/alibaba/alibaba.js';
import Anthropic    from '../providers/anthropic/anthropic.js';
import DeepSeek     from '../providers/deepseek/deepseek.js';
import Google       from '../providers/google/google.js';
import Groq         from '../providers/groq/groq.js';
import Ollama       from '../providers/ollama/ollama.js';
import OpenAI       from '../providers/openai/openai.js';
import OpenRouter   from '../providers/openrouter/openrouter.js';
import SambaNova    from '../providers/sambanova/sambanova.js';
import xAI          from '../providers/xai/xai.js';

import settings     from '../settings/Settings.js';

class ProviderInfo
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
            new Ollama(settings),
            new OpenAI(settings),
            new OpenRouter(settings),
            new SambaNova(settings),
            new xAI(settings)
        ];

        for (const provider of this.List)
            this.ById[provider.id] = provider;
    }
}

const providerInfo = new ProviderInfo();
export default providerInfo;