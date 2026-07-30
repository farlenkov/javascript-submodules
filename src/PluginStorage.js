export default class PluginStorage
{
    constructor(plugin, fileName)
    {
        this.app = plugin.app;
        this.plugin = plugin;
        this.fileName = fileName;
        this.filePath = `${plugin.app.vault.configDir}/plugins/${plugin.manifest.id}/${fileName}`;
    }

    async load()
    {
        const file = this.app.vault.getAbstractFileByPath(this.filePath);
        console.log(file, this.filePath);

        if (!file)
            return null;
        
        const text = await this.app.vault.read(file);
        const json = JSON.parse(text);
        return json;
    }

    async save(data) 
    {
        if (typeof data !== 'string')
            data = JSON.stringify(data, null, '\t');

        const file = this.app.vault.getAbstractFileByPath(this.filePath);
        await this.app.vault.modify(file, data);
    }
} 
