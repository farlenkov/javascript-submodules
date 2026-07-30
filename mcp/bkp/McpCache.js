import McpStorage from './McpStorage.js';

export default class McpCache extends McpStorage 
{
    constructor (plugin)
    {
        super(plugin, 'mcp-cache.json');
    }
}