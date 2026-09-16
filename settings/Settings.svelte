<script>

    import { SquareArrowOutUpRight } from 'lucide-svelte';

    import providers from "../models/Providers.js"
    import settings from "./Settings.js"

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
            <!-- <div class="vertical-tab-header-group-title">
                Settings
            </div> -->
            <div class="vertical-tab-header-group-items">

                {#each providers.List as provider}

                    <div class="setting-item">
                        <div class="setting-item-info">
                            <div class="setting-item-name">
                                {provider.name} 
                                <a 
                                    href="{provider.keys}" 
                                    target="_blank" 
                                    aria-label="{provider.settingsLinkLabel}">
                                    <SquareArrowOutUpRight size={16} />
                                </a>
                            </div>
                            <div class="setting-item-description"></div>
                        </div>
                        <div class="setting-item-control">
                            <textarea 
                                class="inputbox1" 
                                rows={getRowCount(settings.settings.Data[provider.id + "Key"])}
                                bind:value={settings.settings.Data[provider.id + "Key"]} 
                                placeholder="{provider.settingsInputLabel}"
                                onchange={() => settings.save()}></textarea>
                        </div>
                    </div>
                
                {/each}
                <div class="credits">
                    Canvas LLM is powered by <a href="https://svelteflow.dev">Svelte Flow</a> from <a href="https://xyflow.com">xyflow</a>.
                </div>
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

    .vertical-tab-header-group
    {
        padding: 0;
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

    .credits
    {
        text-align: center;
    }

</style>