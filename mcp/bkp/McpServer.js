export default class McpServer
{
    constructor (id, config, client)
    {
        this.id = id;
        this.config = config;
        this.client = client;
    }

    async connect()
    {
        const resp = await this.client.listTools();
        this.tools = resp.tools;
    }
}