<script>

    import { Settings } from 'lucide-svelte';
    import settings from './Settings.js';
    import providers from '../models/Providers.js';

    let {
        model,
        modelId,
        clickModel,
        hasParams,
        isSpecial,
        clickModelParams } = $props();

    function getModelName(model)
    {
        let name = model.id;
        let parts = name.split('/');

        if (parts.length > 1)
        {
            const author = parts.shift();
            name = `<mark>${author}</mark>${parts.join('/')}`;
        }

        if (model.prompt + model.completion === 0)
            name = name.replace(':free', '<free>free</free>');

        if (isSpecial)
            name += `<provider>${getProviderName(model)}</provider>`;

        return name;
    }

    function getProviderName(model)
    {
        const provider = providers.ById[model.providerId];

        if (provider)
            return `(${provider.name})`;
        else
            return `(unknown)`;
    }

    function getModelDesc(model)
    {
        const provider = providers.ById[model.providerId];

        if (provider)
            return `[ ${provider.name} / ${model.owner} ] ${model.desc}`;
        else
            return `[ unknown / ${model.owner} ] ${model.desc}`;
    }

</script>

<div onclick={() => clickModel && clickModel(model) } 
    class="vertical-tab-nav-item model-list-item"
    aria-label="{getModelDesc(model)}"
    class:is-active={modelId == model.id}>

    <div class="model-name">
        {@html getModelName(model)}
    </div>

    <button 
        type="button" 
        class="clickable-icon model-params-btn"
        class:has-params={hasParams}
        aria-label="Open model params" 
        onclick={e => clickModelParams(e, model)}>
        <Settings size={16}/> 
    </button>
</div>