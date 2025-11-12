module.exports = {
    name: 'configrpc',
    description: 'Show RPC help',
    execute: async (client, message, args) => {
        await message.edit(
            `# ConfigRPC Help
➜ *Use individual commands for each RPC setting*

**📋 Available Commands:**
・\`${client.config.prefix}configrpc_name <text>\` - Change RPC name
・\`${client.config.prefix}configrpc_details <text>\` - Change RPC details  
・\`${client.config.prefix}configrpc_state <text>\` - Change RPC state
・\`${client.config.prefix}configrpc_type <type>\` - Change RPC type
・\`${client.config.prefix}configrpc_largeimage <url>\` - Change large image
・\`${client.config.prefix}configrpc_smallimage <url>\` - Change small image
・\`${client.config.prefix}configrpc_button <url> <text>\` - Change first button
・\`${client.config.prefix}configrpc_button2 <url> <text>\` - Change second button
・\`${client.config.prefix}configrpc_on\` - Enable custom RPC
・\`${client.config.prefix}configrpc_off\` - Disable custom RPC
・\`${client.config.prefix}configrpc_list\` - Show commands list

**🎮 RPC Types:** PLAYING, WATCHING, LISTENING, COMPETING, STREAMING

**💡 Example:** \`!configrpc_name Ghost $B\``
        );
    }
};