const fs = require('fs');
const nsfwData = JSON.parse(fs.readFileSync('./hentai.json', 'utf8'));

module.exports = {
    name: 'milf',
    description: 'Show multiple random milf images',
    execute: async (client, message, args) => {
        const category = nsfwData['ph'];

        if (!category || category.length === 0) {
            return message.channel.send(`❌ No content found for category \`ph\`.`);
        }

        const randomItem = category[Math.floor(Math.random() * category.length)];
        await message.channel.send(randomItem);
    }
};