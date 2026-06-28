import { TextFileView } from 'obsidian';
import { mount, unmount } from 'svelte'

export default class FileView extends TextFileView  
{
    constructor(leaf, plugin, viewType, AppView, AppState) 
    {
        super(leaf);

        this.plugin = plugin;
        this.AppView = AppView;
        this.viewType = viewType;

        // this.appState = new AppState();
        // this.appState.requestSave = () => this.requestSave();

        // this.appState.view = this;
        // this.appState.plugin = plugin;
        // this.appState.app = plugin.app;
        // this.appState.leaf = plugin.leaf;
    }

    getViewType() 
    {
        return this.viewType;
    }

    async setViewData (fileContents, clear)
    {
        this.fileJson = JSON.parse(fileContents);
        this.unmountView();
        
        const viewRoot = this.contentEl;
        viewRoot.classList.add(...this.ROOT_CLASS);
        viewRoot.empty();

        this.appView = mount(this.AppView, 
        { 
            target : viewRoot, 
            props : 
            { 
                content : this.fileJson,
                view : this 
            } 
        });
    }

    getViewData()
    {
        return JSON.stringify(this.fileJson, null, '\t');
    }

    async onClose()
    {
        this.clear();
    }

    clear()
    {
        this.unmountView();

        const viewRoot = this.contentEl;
        viewRoot.classList.remove(...this.ROOT_CLASS);
        viewRoot.empty();
    }

    unmountView()
    {
        if (this.appView)
        {
            unmount(this.appView);
            delete this.appView;
        }
    }
}