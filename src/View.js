import { TextFileView } from 'obsidian';
import { mount, unmount } from 'svelte'

export default class FileView extends TextFileView  
{
    constructor(leaf, plugin, AppView, AppState) 
    {
        super(leaf);

        this.plugin = plugin;
        this.AppView = AppView;

        this.appState = new AppState();
        this.appState.requestSave = () => this.requestSave();

        this.appState.view = this;
        this.appState.plugin = plugin;
        this.appState.app = plugin.app;
        this.appState.leaf = plugin.leaf;
    }

    getViewType() 
    {
        return this.VIEW_TYPE;
    }

    async setViewData (fileContents, clear)
    {
        this.fileContents = fileContents;        
        this.unmountView();
        
        const viewRoot = this.contentEl;
        viewRoot.classList.add(...this.ROOT_CLASS);
        viewRoot.empty();

        this.appView = mount(this.AppView, 
        { 
            target : viewRoot, 
            props : { appState : this.appState } 
        });
    }

    getViewData()
    {
        return this.fileContents;
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