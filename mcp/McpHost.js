import { Client } from "@modelcontextprotocol/sdk/client";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export default class McpHost
{
    constructor (plugin)
    {
        this.app = plugin.app;
        this.plugin = plugin;
        this.settings = plugin.settings;
        this.serverByToolName = {};
        this.tools = [];

        this.init();
    }

    async init()
    {
        while (!this.settings.Data)
            await new Promise(resolve => setTimeout(resolve, 1));

        if (!this.settings.Data.mcpServers)
            return;

        const mcpServers = this.settings.Data.mcpServers;        

        for (let id in mcpServers)
        {
            const config = mcpServers[id];
            
            try
            {
                await this.createServer(id, config);
            }
            catch(ex)
            {
                console.error(
                    "MCP Client:", id, 
                    "Error:", ex);
            }
        }
    }

    async createServer(id, config)
    {
        // TRANSPORT

        let transport;

        if (config.url)
        {
            const url = new URL(config.url);
            transport = new StreamableHTTPClientTransport(url);
        }
        else if (config.command)
        {
            transport = new StdioClientTransport
            ({
                command : config.command,
                args    : config.args,
                env     : config.env || {}
            });
        }

        // CLIENT
        
        const server = new Client
        ({
            name: this.plugin.manifest.name,
            version: this.plugin.manifest.version
        });

        await server.connect(transport);
        server.config = config;
        server.id = id;

        // TOOLS
    
        const key = id.replace(/[-_.]/g, '');
        const tools = await server.listTools();
        server.toolRenameMap = {};
        server.toolByName = {};

        for (const tool of tools.tools)
        {
            const longName = `${key}_${tool.name}`;
            server.toolByName[longName] = tool;
            server.toolRenameMap[longName] = tool.name;
            this.serverByToolName[longName] = server;

            const renamedTool = {...tool};
            renamedTool.name = longName;
            this.tools.push(renamedTool);
        }
    }

    async functionCall(call)
    {
        const server = this.serverByToolName[call.name];

        if (!server)
        {
            console.error(
                `[McpHost] Tool not found: '${call.name}'`, 
                this.serverByToolName[call.name], 
                this.serverByToolName);

            return null;
        }

        const callTool = 
        {
            name      : server.toolRenameMap[call.name],
            arguments : call.arguments
        };

        console.groupCollapsed(`[LLM] Call Function: ${server.id} / ${callTool.name}`);
        console.log("⚙️", server.config);
        console.log("⚙️", server.toolByName[call.name]);
        console.log("↗", callTool);

        const start = performance.now();
        let result;
        
        try
        {
            result = await server.callTool(callTool);
        }
        catch(ex)
        {
            result = 
            {
                content : 
                [{
                    type : "text",
                    text : ex
                }]
            }
        }

        const duration = (performance.now() - start) / 1000;
        console.log("↙", `${(duration).toFixed(3)}s`, result);
        console.groupEnd();
        return result;
    }

    static getDefaultSettings()
    {
        return { mcpServers : {} };
    }
} 

async function obsidianFetch(input, init = {}) 
{
    const resp = await fetch(input, init);
    // console.log({url : input, opts : init, resp : resp});
    return resp;

    // const url = input instanceof URL
    //     ? input.toString()
    //     : input instanceof Request
    //         ? input.url
    //         : String(input);

    // const response = await requestUrl
    // ({
    //     url,
    //     method: init.method ?? "GET",
    //     headers: init.headers,
    //     body: init.body,
    //     throw: false,
    // });

    // console.log(response.headers);

    // return new Response(
    //     response.arrayBuffer, 
    //     {
    //         status: response.status,
    //         statusText: response.text,
    //         headers: response.headers,
    //     });
}