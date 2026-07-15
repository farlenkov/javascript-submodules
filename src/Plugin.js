import { Plugin } from 'obsidian';
import { createNewFile } from './File.js';

export default class FilePlugin extends Plugin 
{
    async registerFileView(FileView)
    {
        this.registerExtensions(
            [FileView.FILE_EXT], 
            FileView.VIEW_TYPE);

        this.registerView(
            FileView.VIEW_TYPE,
            (leaf) => new FileView(leaf, this));
    }
    
    async registerMenuItem(
        menuLabel, 
        menuIcon,
        fileName,
        fileExt,
        defaultContent)
    {
        const fileMenuEvent = this.app.workspace.on(
            'file-menu', 
            (menu, menuFile) => 
            {
                if (menuFile.extension === undefined) 
                { 
                    menu.addItem((item) => 
                    {
                        item.setTitle(menuLabel)
                            .setIcon(menuIcon) 
                            .onClick(async () =>
                            {
                                this.createNewFile(
                                    menuFile.path, 
                                    fileName, 
                                    fileExt,
                                    defaultContent);
                            });
                    });
                }
            });

        this.registerEvent(fileMenuEvent);
    }
    
    async createNewFile(
        folderPath, 
        fileName, 
        fileExt,
        defaultContent)
    {
        if (typeof defaultContent === 'function')
            defaultContent = defaultContent();
        
        await createNewFile(
            this.app, 
            folderPath,
            fileName,
            fileExt,
            defaultContent);
    }

    async getDefaultContent()
    {
        return {};
    }
}