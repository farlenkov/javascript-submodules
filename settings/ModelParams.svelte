<script>
    import { XIcon, Copy, ClipboardPaste, Undo2 } from 'lucide-svelte';

    const { model, provider, params, onChange } = $props();

    let values = $state({...params});
    let backup = $state(null);

    let values_list = $derived([...Object.entries(values), ...[["",""]]].map(e => 
    {
        if (typeof e[1] !== 'object')
            return e;
        
        e[1] = JSON.stringify(e[1]);
        return e;
    }));

    function onParamChange(
        name_old, 
        name_new, 
        value)
    {
        backup = null;
        name_new = typeof name_new === 'string' ? name_new.trim() : name_new;
        value = typeof value === 'string' ? value.trim() : value;

        // DELETE

        if (!name_new)
        {
            if (name_old)
            {
                delete values[name_old];
                save();
            }

            return;
        }

        // RENAME

        if (name_old && name_old != name_new)
            delete values[name_old];

        // JSON or NUMBER

        try
        {
            values[name_new] = JSON.parse(value);
            save();
            return;
        }
        catch (err)
        {
            // OK
        }

        // STRING

        values[name_new] = value;
        save();
    }

    function save()
    {
        onChange(Object.keys(values).length > 0 ? values : null);
    }

    function clickClear()
    {
        backup = {...values};
        values = {};
        onChange(null);
    }

    function clickUndo()
    {
        values = backup;
        backup = null;
    }

    async function clickCopy()
    {
        if (!navigator.clipboard)
            return;

        if (Object.keys(values).length == 0)
            return;

        const text = JSON.stringify(values);
        await navigator.clipboard.writeText(text);
    }

    async function clickPaste()
    {
        backup = null;

        if (!navigator.clipboard)
            return;

        const text = await navigator.clipboard.readText();        
        const data = JSON.parse(text);

        if (Object.keys(data).length > 0)
        {
            values = data;
            save();
        }
    }

</script>

<div>
    <h3 class="provider-name">{provider.name}</h3>
    <div class="model-name">{model ? model.id : "(All models)"}</div>

    <div class="params-list">

        {#each values_list as [name, value], index}

            <div class="params-list-item">

                <input 
                    type="text" 
                    class="param-name"
                    value={name} 
                    placeholder={index == 0 ? "temperature" : "name"}
                    onchange={e => onParamChange(name, e.currentTarget.value, value)}>

                <input 
                    type="text" 
                    class="param-value"
                    value={value} 
                    placeholder={index == 0 ? "1.1" : "value"}
                    onchange={e => onParamChange(name, name, e.currentTarget.value)}>

            </div>

        {/each}
    </div>

    <div class="buttons">
        

        {#if !backup}
            <button 
                class="clear" 
                class:hidden={values_list.length <= 1} 
                onclick={clickClear} 
                aria-label="Remove all params">
                <XIcon size={16} />
                Clear
            </button>
        {:else}
            <button class="undo" onclick={clickUndo} aria-label="Restore params">
                <Undo2 size={16} />
                Undo
            </button>
        {/if}


        <div class="copy-paste">
            <button onclick={clickCopy} aria-label="Copy params">
                <Copy size={16} />
                Copy
            </button>
            <button onclick={clickPaste} aria-label="Paste params">
                <ClipboardPaste size={16} />
                Paste
            </button>
        </div>
    </div>

</div>