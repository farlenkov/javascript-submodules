import { Modal } from "obsidian";
import { mount, unmount } from 'svelte'

export default class GenericModal extends Modal 
{
	constructor(appState, ViewClass, nameSpace, modalType) 
    {
		super(appState.app);
        this.appState = appState;
        this.nameSpace = nameSpace;
        this.modalType = modalType;
        this.ViewClass = ViewClass;
	}

	onOpen() 
    {
        this.containerEl.classList.add(this.nameSpace);
        this.containerEl.classList.add(this.nameSpace + '-' + this.modalType);

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

        this.containerEl.classList.remove(this.nameSpace);
        this.containerEl.classList.remove(this.nameSpace + '-' + this.modalType);
		this.contentEl.empty();
	}
}