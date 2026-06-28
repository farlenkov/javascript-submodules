import { normalizePath } from 'obsidian';

export async function createNewFile(app, folderPath, baseName, fileExt, content)
{
    let counter = 0;
    let filePath = `${folderPath}/${baseName}.${fileExt}`;

    while (await isFileExists(app, filePath))
    {
        counter++;
        filePath = `${folderPath}/${baseName} ${counter}.${fileExt}`;
    }

    content = typeof content === 'string' 
        ? content 
        : JSON.stringify(content, null, '\t');

    const file = await app.vault.create(filePath, content);
    const leaf = app.workspace.getLeaf();
    await leaf.openFile(file);
}

export async function isFileExists(app, filePath)
{
    const normalizedFilePath = normalizePath(filePath);
    const file = app.vault.getFileByPath(normalizedFilePath);
    return file != null;
}

export function loadAllFilesInFolder(app, folderPath) 
{
    const allFiles = app.vault.getFiles();
    return allFiles.filter(file => file.path.startsWith(folderPath));
}