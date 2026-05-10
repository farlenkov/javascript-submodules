import { Plugin } from 'obsidian';
import { createNewFile } from './File.js';

export default class FilePlugin extends Plugin 
{
    async onload() 
    {
        this.registerFileView();
        this.registerMenuItem();

        this.addRibbonIcon(
            this.MENU_ICON, 
            this.RIBBON_LABEL, 
            () => { this.createNewFile("/"); });
    }

    async onunload() 
    {
        
    }

    async registerFileView()
    {
        this.registerExtensions(
            [this.FILE_EXT], 
            this.VIEW_TYPE);

        this.registerView(
            this.VIEW_TYPE,
            (leaf) => new this.FILE_VIEW(leaf, this));
    }
    
    async registerMenuItem()
    {
        const fileMenuEvent = this.app.workspace.on(
            'file-menu', 
            (menu, menuFile) => 
            {
                if (menuFile.extension === undefined) 
                { 
                    menu.addItem((item) => 
                    {
                        item.setTitle(this.MENU_LABEL)
                            .setIcon(this.MENU_ICON) 
                            .onClick(async () =>
                            {
                                this.createNewFile(menuFile.path);
                            });
                    });
                }
            });

        this.registerEvent(fileMenuEvent);
    }
    
    async createNewFile(folderPath)
    {
        const fileJson = await this.getDefaultContent();

        await createNewFile(
            this.app, 
            folderPath,
            this.FILE_NAME,
            this.FILE_EXT,
            fileJson);
    }

    async getDefaultContent()
    {
        return {};
    }
}