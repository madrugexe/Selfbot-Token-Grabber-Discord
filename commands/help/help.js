const HelpSystem = require('../../systems/HelpSystem');

module.exports = {
    name: 'help',
    description: 'Show main help',
    execute: async (client, message, args) => {
        await message.edit(HelpSystem.getMainHelp(client.config));
    }
};