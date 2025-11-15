<script>

    import { SquareArrowOutUpRight } from 'lucide-svelte';

    import providers from "../models/ProviderInfo.svelte.js"
    import settings from "./Settings.svelte.js"

    function getRowCount(value)
    {
        if (!value)
            return 1;
        else
            return value.split("\n").length || 1;
    }

</script>

<div class="vertical-tab-content-container">
    <div class="vertical-tab-content">
        <div class="vertical-tab-header-group">
            <div class="vertical-tab-header-group-title">
                API Keys
            </div>
            <div class="vertical-tab-header-group-items">

                {#each providers.List as provider}

                    <div class="setting-item">
                        <div class="setting-item-info">
                            <div class="setting-item-name">
                                {provider.name} 
                                <a 
                                    href="{provider.keys}" 
                                    target="_blank" 
                                    aria-label="Get API key from {provider.name}">
                                    <SquareArrowOutUpRight size={16} />
                                </a>
                            </div>
                            <div class="setting-item-description"></div>
                        </div>
                        <div class="setting-item-control">
                            <textarea 
                                class="inputbox1" 
                                rows={getRowCount(settings.Data[provider.id + "Key"])}
                                bind:value={settings.Data[provider.id + "Key"]} 
                                placeholder="API key for {provider.name}"
                                onchange={() => settings.Save()}></textarea>
                        </div>
                    </div>
                
                {/each}
            </div>
        </div>
    </div>
</div>

<style>

    .vertical-tab-content
    {
        padding-top: var(--size-4-4);
        padding-bottom: var(--size-4-4);
    }

    .setting-item-name 
    { 
        display: flex;
        align-items: center;
        gap: 0.5em;
    }

    textarea
    {
        resize: none; 
        overflow: hidden; 
        white-space: nowrap;
        width: 100%;
    }

</style>