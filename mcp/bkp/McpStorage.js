import PluginStorage from '$lib/svelte-obsidian/src/PluginStorage.js';

export default class McpStorage extends PluginStorage 
{
    data = {};

    constructor (plugin, fileName)
    {
        super(plugin, fileName);
        this.load();

        plugin.onFileModify.on(file => 
        {
            if (file.path === this.filePath)
                this.load();
        });
    }

    async load()
    {
        this.data = await super.load() || {};
        console.log(this.fileName, this.data);
    }

    async save()
    {
        await super.save(this.data);
    }
}