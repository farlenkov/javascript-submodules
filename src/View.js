import { TextFileView } from 'obsidian';
import { mount, unmount } from 'svelte'

export default class FileView extends TextFileView  
{
    constructor(leaf, plugin, viewType, RootView) 
    {
        super(leaf);

        this.app = plugin.app;
        this.plugin = plugin;
        this.viewType = viewType;
        this.RootView = RootView;
    }

    getViewType() 
    {
        return this.viewType;
    }

    setViewData (fileContents, clear)
    {
        this.fileJson = JSON.parse(fileContents);
        this.unmountView();
        this.mountView(this.fileJson);
    }

    getViewData()
    {
        return JSON.stringify(this.fileJson, null, '\t');
    }

    mountView(content)
    {
        const viewRoot = this.contentEl;
        viewRoot.classList.add(...this.ROOT_CLASS);
        viewRoot.empty();

        this.rootView = mount(this.RootView, 
        { 
            target : viewRoot, 
            props : 
            { 
                content : content,
                view : this 
            } 
        });
    }

    unmountView()
    {
        if (this.rootView)
        {
            unmount(this.rootView);
            delete this.rootView;
        }
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
}