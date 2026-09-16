<script>

    import { Settings } from 'lucide-svelte';

    let {
        provider,
        isActive,
        hasParams,
        clickProvider,
        clickProviderParams } = $props();

</script>

<div onclick={() => clickProvider(provider.id)} 
    class="vertical-tab-nav-item provider-list-item"
    class:is-active={isActive}>

    {provider.name}

    <button 
        type="button" 
        class="clickable-icon provider-params-btn"
        class:has-params={hasParams}
        aria-label="Open privider params" 
        onclick={e => clickProviderParams(e, provider)}>
        <Settings size={16}/> 
    </button>
</div>