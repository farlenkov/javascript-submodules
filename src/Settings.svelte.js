export default class SettingsState
{
    FileVersion = 1;
    Data = $state();

    async init (plugin)
    {
        this.app = plugin.app;
        this.plugin = plugin;

        await this.load();
        await this.save();
    }

    async load ()
    {
        this.Data = await this.plugin.loadData() ?? {};
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