const fs = require('fs');
const nsfwData = JSON.parse(fs.readFileSync('./hentai.json', 'utf8'));

module.exports = {
    name: 'x',
    description: 'Show multiple random X images',
    execute: async (client, message, args) => {
        const category = nsfwData['x'];

        if (!category || category.length === 0) {
            return message.channel.send(`❌ No content found for category \`x\`.`);
        }

        const randomItem = category[Math.floor(Math.random() * category.length)];
        await message.channel.send(randomItem);
    }
};