const fs = require('fs');
const nsfwData = JSON.parse(fs.readFileSync('./hentai.json', 'utf8'));

module.exports = {
    name: 'hentai',
    description: 'Show multiple random hentai images',
    execute: async (client, message, args) => {
        const category = nsfwData['hentai'];

        if (!category || category.length === 0) {
            return message.channel.send(`❌ No content found for category \`hentai\`.`);
        }

        const randomItem = category[Math.floor(Math.random() * category.length)];
        await message.channel.send(randomItem);
    }
};