import McpStorage from './McpStorage.js';

export default class McpConfig extends McpStorage 
{
    constructor (plugin)
    {
        super(plugin, 'mcp-config.json');
    }
}