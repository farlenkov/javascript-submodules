export default class SettingsState
{
    FileVersion = 1;

    constructor (plugin)
    {
        this.app = plugin.app;
        this.plugin = plugin;
    }

    async init (defaults)
    {
        await this.load(defaults);
        await this.save();
    }

    async load (defaults)
    {
        const data = await this.plugin.loadData();
        this.Data = Object.assign({}, defaults, data);
        this.Data.version = this.FileVersion;
    }

    async save ()
    {
        await this.plugin.saveData(this.Data);
    }

    up (counterKey)
    {
        const result = this.Data[counterKey]
            ? this.Data[counterKey] = this.Data[counterKey] + 1
            : this.Data[counterKey] = 1;

        this.save();
        return result;
    }
} 