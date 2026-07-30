export default class SettingsState
{
    FileVersion = 1;

    constructor(plugin, defaults)
    {
        this.app = plugin.app;
        this.plugin = plugin;
        this.init(defaults);
    }

    async init (defaults)
    {
        const data = await this.plugin.loadData();
        this.Data = Object.assign({}, defaults, data);
        this.Data.version = this.FileVersion;
        this.save();
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