import { Modal } from "obsidian";
import { mount, unmount } from 'svelte'

export default class GenericModal extends Modal 
{
	constructor(appState, ViewClass, classList) 
    {
		super(appState.app);
        this.appState = appState;
        this.classList = classList || [];
        this.ViewClass = ViewClass;
	}

	onOpen() 
    {
        for (var i = 0; i < this.classList.length; i++)
            this.containerEl.classList.add(this.classList[i]);

        this.modelView = mount(this.ViewClass, 
        { 
            target : this.contentEl,
            props : { appState : this.appState, modal : this }
        });
	}
	
	onClose() 
    {
		if (this.modelView)
		{
			unmount(this.modelView);
            delete this.modelView;
		}

        for (var i = 0; i < this.classList.length; i++)
            this.containerEl.classList.remove(this.classList[i]);
        
		this.contentEl.empty();
	}
}