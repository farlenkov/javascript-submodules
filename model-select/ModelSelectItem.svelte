<script>

    import { Settings } from 'lucide-svelte';
    import settings from '../settings/Settings.svelte.js';
    import providers from '../models/Providers.js';
    import { showContextMenu } from '$lib/svelte-obsidian/src/Menu.js';

    let {
        app,
        model,
        selectedModelId,
        clickModel,
        hasParams,
        clickModelParams,
        onBookmarkToggle } = $props();

    let providerName = getProviderName(model);
    let modelName = getModelName(model);
    let modelDesc = getModelDesc(model);
    let hasBookmark = $state(settings.hasBookmark(model));

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

        name += `<provider>${providerName}</provider>`;
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

    function onContextMenu(event)
    {
        const menu = 
        [{
            app : app,
            event : event,
            class : 'svelte-llm svelte-obsidian',
        }];

        if (!hasBookmark)
        {
            menu.push
            ({
                title : "Add bookmark",
                icon : "bookmark",
                class : "bookmark-add",
                onclick : () =>
                { 
                    hasBookmark = true;
                    settings.addBookmark(model);
                    onBookmarkToggle(model, true);
                }
            });
        }
        else
        {
            menu.push
            ({
                title : "Remove bookmark",
                icon : "bookmark-off",
                class : "bookmark-del",
                onclick : () =>
                { 
                    hasBookmark = false;
                    settings.delBookmark(model);
                    onBookmarkToggle(model, false);
                }
            });
        }

        showContextMenu(menu);
    }

</script>

<div 
    onclick={() => clickModel && clickModel(model) } 
    oncontextmenu={onContextMenu}
    class="vertical-tab-nav-item model-list-item"
    class:has-bookmark={hasBookmark}
    aria-label="{modelDesc}"
    class:is-active={selectedModelId == model.id}>

    <div class="model-name">
        {@html modelName}
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