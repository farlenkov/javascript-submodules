<script>

    import { onMount } from 'svelte';
    import { RefreshCcw , SquareArrowOutUpRight, XIcon } from 'lucide-svelte';
    import providers from '../models/Providers.js';
    import settings from '../settings/Settings.svelte.js';
    import models from '../models/Models.js';
    import ProviderListItem from './ProviderListItem.svelte';
    import ModelSelectItem from './ModelSelectItem.svelte';
    import ModelParams from './ModelParams.svelte';
    import Modal from '$lib/svelte-obsidian/src/Modal.js';

    const RECENT_TAB = "recent";
    const BOOKMARKED_TAB = "bookmarked";

    let {
        app,
        state : modelSelectState,
        onModelSelected, 
        onShowSettings, 
        modelId,
        providerId } = $props();

    if (providerId && !providers.ById[providerId])
    {
        providerId = null;
        modelId = null;
    }

    let updating = $state({});
    let errorMessage = $state("");

    let selectedProviderId = $state(modelSelectState.activeTab || providerId || settings.GetDefaultProvider());
    let selectedProvider = $derived(providers.ById[selectedProviderId]);
    let selectedProviderName = $derived(selectedProvider == null ? selectedProviderId[0].toUpperCase() + selectedProviderId.slice(1) : selectedProvider.name);
    let selectedProviderPrice = $derived(selectedProvider == null ? false : selectedProvider.price);
    let selectedProviderModels = $state([]);
    let selectedModel = $state();

    let hasParams = $state({});
    let hasKey = $state(settings.HasKey(selectedProviderId));
    let hasModels = $derived(selectedProviderModels.length > 0);
    let isSpecial = $derived(selectedProviderId == RECENT_TAB || selectedProviderId == BOOKMARKED_TAB);
    let isUpdating = $derived(updating[selectedProviderId]);

    updateModels();

    for (const provider of providers.List)
        if (settings.getModelParams(provider.id))
            hasParams[provider.id] = true;

    onMount(() => 
    {
        // TODO ...
        const intervalId = setInterval(() => hasKey = settings.HasKey(selectedProviderId), 1000);

        return () => 
        {
            clearInterval(intervalId);
        };
    });

    function clickProvider(providerId)
    {
        selectedProviderId = providerId;
        hasKey = settings.HasKey(selectedProviderId);
        updateModels();
        errorMessage = null;
    }

    function clickModel (model)
    {
        modelSelectState.activeTab = selectedProviderId;
        modelSelectState.prevModelId = model.id;
        settings.AddRecentModel(model);
        onModelSelected(model);
    }

    function checkFilter(model)
    {
        if (selectedProviderPrice && modelSelectState.filterFree)
            if ((model.prompt + model.completion) != 0)
                return false;

        let nameFilter = modelSelectState.filterName.trim();

        if (nameFilter && 
            model.id.toLowerCase().indexOf(nameFilter.toLowerCase()) < 0)
            return false;

        return true;
    }

    async function fetchModels()
    {
        errorMessage = null;
        const updatingProviderId = selectedProviderId;

        if (updating[updatingProviderId])
            return;

        updating[updatingProviderId] = true;
        errorMessage = await models.fetchModels(updatingProviderId);
        updateModels();
        delete updating[updatingProviderId];
    }

    function updateModels()
    {
        const models = settings.GetModels(selectedProviderId);
        selectedProviderModels = [];
        selectedProviderModels = models;
        // console.log("selectedProviderModels", selectedProviderId, [...selectedProviderModels].length);

        selectedModel = null;

        for (const model of models)
        {
            if (model.providerId === providerId &&
                model.id === modelId)
            {
                selectedModel = model;
            }

            const paramsKey = model.getParamsKey();
            hasParams[paramsKey] = settings.getModelParams(paramsKey) ? true : false;
        }
    }

    function clickModelParams(e, model)
    {
        e.stopPropagation();

        const paramsKey = model.getParamsKey();
        const modelParams = settings.getModelParams(paramsKey) || {};

        new Modal(
            ModelParams, 
            {
                app,
                model,
                provider : providers.ById[model.providerId],
                params : modelParams,

                onChange : params => 
                {
                    settings.setModelParams(paramsKey, params);
                    updateModels();
                }
            }, 
            [
                "svelte-obsidian", 
                "canvas-llm", 
                "svelte-llm-model-params-container"
            ])
            .open();
    }

    function onBookmarkToggle(model, hasBookmark)
    {
        updateModels();
    }

    function clickProviderParams(e, provider)
    {
        e.stopPropagation();

        const paramsKey = provider.id;
        const providerParams = settings.getModelParams(paramsKey) || {};

        new Modal(
            ModelParams, 
            {
                app,
                provider : provider,
                params : providerParams,

                onChange : params => 
                {
                    settings.setModelParams(paramsKey, params);
                    hasParams[paramsKey] = params ? true : false;
                }
            }, 
            [
                "svelte-obsidian", 
                "canvas-llm", 
                "svelte-llm-model-params-container"
            ])
            .open();
    }

</script>

<div class="vertical-tabs-container">

    <div class="vertical-tab-header">
        <div class="vertical-tab-header-group">
            <div class="vertical-tab-header-group-title provider-list-title">
                Providers
            </div>
            <div class="vertical-tab-header-group-items">  

                {#each providers.List as provider}
                    {#if !provider.untested}

                        <ProviderListItem
                            {provider}
                            isActive={provider.id == selectedProviderId}
                            hasParams={hasParams[provider.id]}
                            {clickProvider}
                            {clickProviderParams} />

                    {/if}
                {/each}

            </div>

            <div class="vertical-tab-header-group-title provider-list-title">
                Untested
            </div>
            <div class="vertical-tab-header-group-items">

                {#each providers.List as provider}
                    {#if provider.untested}

                        <ProviderListItem
                            {provider}
                            isActive={provider.id == selectedProviderId}
                            hasParams={hasParams[provider.id]}
                            {clickProvider}
                            {clickProviderParams} />
                        
                    {/if}
                {/each}

            </div>
            
            <div class="vertical-tab-header-group-title provider-list-title">
                Your
            </div>
            <div class="vertical-tab-header-group-items">

                <div onclick={() => clickProvider(BOOKMARKED_TAB)} 
                    class="vertical-tab-nav-item provider-list-item"
                    class:is-active={BOOKMARKED_TAB == selectedProviderId}>
                    Bookmarks
                </div>
                
                <div onclick={() => clickProvider(RECENT_TAB)} 
                    class="vertical-tab-nav-item provider-list-item"
                    class:is-active={RECENT_TAB == selectedProviderId}>
                    Resent
                </div>

            </div>
        </div>  
            
    </div>

    <div 
        class="vertical-tab-content-container svelte-llm-model-list-container"
        class:is-special={isSpecial}>
        
        <models-filter>

            <models-buttons>

                <button 
                    class="clickable-icon" 
                    class:disabled={isUpdating || !hasKey}
                    disabled={isUpdating || !hasKey}
                    aria-label="Refresh models from {selectedProviderName}" 
                    onclick={fetchModels}>
                    <RefreshCcw size={16}/>  
                </button>

                <button 
                    class="clickable-icon" 
                    aria-label="Review models from {selectedProviderName}" 
                    disabled={isSpecial}
                    onclick={() => window.open(selectedProvider.models)}>
                    <SquareArrowOutUpRight size={16}/>  
                </button>

            </models-buttons>

            <div class='models-filter-name'>
                <input 
                    type="text"
                    class="models-filter-name-input inputbox2"
                    class:disabled={!isSpecial && (!hasKey || !hasModels)}
                    placeholder="Filter models by name"
                    disabled={!isSpecial && (!hasKey || !hasModels)}
                    bind:value={modelSelectState.filterName}>

                {#if modelSelectState.filterName}
                    <button 
                        class="models-filter-name-clear clickable-icon"
                        aria-label="Clear"
                        disabled={!isSpecial && (!hasKey || !hasModels)}
                        onclick={() => modelSelectState.filterName = ''}>
                        <XIcon size={16}/>
                    </button>
                {/if}
            </div>

            <label 
                class="models-filter-free"
                class:disabled={!selectedProviderPrice || !hasKey || !hasModels}
                aria-label="Show only free models">
                <input 
                    type="checkbox" 
                    disabled={!selectedProviderPrice || !hasKey || !hasModels}
                    bind:checked={modelSelectState.filterFree}> Free
            </label>

        </models-filter>

        <div class="vertical-tab-content">
            <div class="vertical-tab-header-group">
                <div class="vertical-tab-header-group-title">

                    {#if isSpecial}
                        {selectedProviderName} models
                    {:else}
                        Models from {selectedProviderName}
                    {/if}

                </div>
                <div class="vertical-tab-header-group-items">

                    {#if !isSpecial && selectedProvider.untested}
                        <untested>
                            Access to this provider is implemented according to its documentation, but has not been tested by the developer of Canvas LLM. 
                            If you use it, please <a href="https://github.com/farlenkov/obsidian-canvas-llm/issues">share</a> your results with me.
                        </untested>
                    {/if}

                    {#if !isSpecial && !hasKey}
                        <div class="error-message">
                            {#if selectedProvider.isLocal}
                                You did not provide base URL for <b>{selectedProvider.name}</b>.
                                <br>
                                <br>
                                You can read quickstart guide here:
                                <br>
                                <a href="{selectedProvider.keys}" target="_blank" title="Read quickstart guide">
                                    {selectedProvider.keys}
                                </a>
                                <br>
                                <br>
                                And paste your base URL in settings:
                            {:else}
                                You did not provide the API key for <b>{selectedProvider.name}</b>.
                                <br>
                                <br>
                                You can get API key here:
                                <br>
                                <a href="{selectedProvider.keys}" target="_blank" title="Get API Key">
                                    {selectedProvider.keys}
                                </a>
                                <br>
                                <br>
                                And paste your API key in settings:
                            {/if}
                            <br>
                            <div class="button-wrapper">
                                <button 
                                    onclick={onShowSettings}>
                                    Open Settings
                                </button>
                            </div>
                        </div>
                    {:else}
                        {#if !isSpecial && !hasModels}
                            <div class="error-message">
                                List of models for <b>{selectedProvider.name}</b> not downloaded yet.
                                <br>
                                <div class="button-wrapper">

                                    <button
                                        disabled={isUpdating}
                                        onclick={fetchModels}>
                                        
                                        {#if isUpdating}
                                            Getting models...
                                        {:else}
                                            Get model list
                                        {/if}
                                    </button>

                                </div>

                                {#if errorMessage}
                                    <error>
                                        {errorMessage}
                                        <button type="button" class="btn-dark" onclick={() => {errorMessage = null}}>
                                            <XIcon size={24} strokeWidth={2}/>
                                        </button>
                                    </error>
                                {/if}
                            </div>
                        {:else}
                            {#if errorMessage}
                                <error>
                                    {errorMessage}
                                    <button type="button" class="btn-dark" onclick={() => {errorMessage = null}}>
                                        <XIcon size={24} strokeWidth={2}/>
                                    </button>
                                </error>
                            {/if}

                            {#if selectedModel}

                                <ModelSelectItem 
                                    {app}
                                    model={selectedModel}
                                    hasParams={hasParams[selectedModel.getParamsKey()]}
                                    selectedModelId={modelId}
                                    {clickModel}
                                    {selectedProvider}
                                    {clickModelParams}
                                    {onBookmarkToggle} />
                                
                            {/if}

                            {#each selectedProviderModels as model (model.id)}
                                {#if checkFilter(model)}

                                    <ModelSelectItem 
                                        {app}
                                        {model}
                                        selectedModelId={modelId}
                                        hasParams={hasParams[model.getParamsKey()]}
                                        {clickModel}
                                        {selectedProvider}
                                        {clickModelParams}
                                        {onBookmarkToggle} />
                                {/if}
                            {/each}
                        {/if}
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>