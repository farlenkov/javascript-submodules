<script>

    import { RefreshCcw , SquareArrowOutUpRight, XIcon, Settings  } from 'lucide-svelte';
    import modelSelectState from './ModelSelect.svelte.js';
    import providers from '../models/Providers.js';
    import settings from './Settings.js';
    import models from '../models/Models.js';
    import ProviderListItem from './ProviderListItem.svelte';
    import ModelSelectItem from './ModelSelectItem.svelte';
    import ModelParams from './ModelParams.svelte';
    import Modal from '$lib/svelte-obsidian/src/Modal.js';

    const RECENT_TAB = "recent";
    const FAVORITES_TAB = "favorites";

    let {
        app,
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
    
    let selectedProviderId = $state(providerId || settings.GetDefaultProvider());
    let selectedProvider = $derived(providers.ById[selectedProviderId]);
    let selectedProviderName = $derived(selectedProvider == null ? selectedProviderId[0].toUpperCase() + selectedProviderId.slice(1) : selectedProvider.name);
    let selectedProviderPrice = $derived(selectedProvider == null ? false : selectedProvider.price);
    let selectedProviderModels = $state([]);
    let selectedModel = $state();
    
    let hasParams = $state({});
    let hasKey = $derived(settings.HasKey(selectedProviderId));
    let hasModels = $derived(selectedProviderModels.length > 0);
    let isSpecial = $derived(selectedProviderId == RECENT_TAB || selectedProviderId == FAVORITES_TAB);
    let isUpdating = $derived(updating[selectedProviderId]);

    updateModels();

    for (const provider of providers.List)
        if (settings.getModelParams(provider.id))
            hasParams[provider.id] = true;

    if (modelSelectState.prevModelId !== modelId)
        modelSelectState.filterName = "";

    function clickProvider(providerId)
    {
        selectedProviderId = providerId;
        updateModels();
        errorMessage = null;
    }

    function clickModel (model)
    {
        modelSelectState.prevModelId = model.id;
        settings.AddRecentModel(model);
        onModelSelected(model);
    }

    function checkFilter(model)
    {
        if (selectedProviderPrice && modelSelectState.filterFree)
        {
            // if (typeof model.prompt !== 'number')
            //     return false;

            // if (typeof model.completion !== 'number')
            //     return false;

            if ((model.prompt + model.completion) != 0)
                return false;
        }

        let nameFilter = modelSelectState.filterName.trim();

        if (nameFilter && 
            model.id.toLowerCase().indexOf(nameFilter.toLowerCase()) < 0)
            return false;
        
        return true;
    }

    async function fetchModels()
    {
        errorMessage = null;

        if (updating[selectedProviderId])
            return;

        updating[selectedProviderId] = true;
        errorMessage = await models.fetchModels(selectedProviderId);
        updateModels();
        delete updating[selectedProviderId];
    }

    function updateModels()
    {
        const models = settings.GetModels(selectedProviderId);
        selectedProviderModels = models;
        // console.log("selectedProviderModels", selectedProviderId, [...selectedProviderModels]);

        selectedModel = null;

        for (const model of models)
        {
            if (selectedProviderId === providerId &&
                model.id === modelId)
            {
                selectedModel = model;
            }

            const paramsKey = settings.getParamsKey(model.providerId, model.id);
            hasParams[paramsKey] = settings.getModelParams(paramsKey) ? true : false;
        }
    }

    function clickModelParams(e, model)
    {
        e.stopPropagation();

        const paramsKey = settings.getParamsKey(model.providerId, model.id);
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
                
                <div onclick={() => clickProvider(RECENT_TAB)} 
                    class="vertical-tab-nav-item provider-list-item"                            
                    class:is-active={RECENT_TAB == selectedProviderId}>
                    Resent
                    <div class="vertical-tab-nav-item-chevron">
                        <svg xmlns="http://www.w3.org/2000/svg" 
                            width="24" height="24" viewBox="0 0 24 24" 
                            fill="none" stroke="currentColor" stroke-width="2" 
                            stroke-linecap="round" stroke-linejoin="round" 
                            class="svg-icon lucide-chevron-right">
                            <path d="m9 18 6-6-6-6"></path>
                        </svg>
                    </div>
                </div>

            </div>
        </div>  
            
    </div>

    <div class="vertical-tab-content-container svelte-llm-model-list-container">
        
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

                <input 
                    type="text"
                    class="models-filter-name inputbox2"
                    class:disabled={!isSpecial && (!hasKey || !hasModels)}
                    placeholder="Filter models by name"
                    disabled={!hasKey || !hasModels}
                    bind:value={modelSelectState.filterName}>

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

                        Models from {selectedProviderName}

                        <!-- {#if !isSpecial}
                            <button 
                                type="button" 
                                class="clickable-icon provider-params-btn"                            
                                aria-label="Open provider params" 
                                onclick={e => clickProviderParams()}>
                                <Settings size={16}/> 
                            </button>
                        {/if} -->
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
                                        model={selectedModel}
                                        hasParams={hasParams[settings.getParamsKey(selectedModel.providerId, selectedModel.id)]}
                                        {modelId}
                                        {isSpecial}
                                        {selectedProvider}
                                        {clickModelParams} />
                                    
                                {/if}

                                {#each selectedProviderModels as model}
                                    {#if checkFilter(model)}

                                        <ModelSelectItem 
                                            {model}
                                            {modelId}
                                            {isSpecial}
                                            hasParams={hasParams[settings.getParamsKey(model.providerId, model.id)]}
                                            {clickModel}
                                            {selectedProvider}
                                            {clickModelParams} />
                                    {/if}
                                {/each}
                            {/if}
                        {/if}
                    </div>
                </div>
            </div>
        
    </div>
</div>