const fs = require('fs');

module.exports = {
    name: 'joke',
    description: 'Tell a random joke',
    execute: async (client, message, args) => {
        fs.readFile('./joke.json', 'utf8', (err, data) => {
            if (err) return message.channel.send('Error reading jokes 😢');
            const jokes = JSON.parse(data).jokes;
            const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
            message.channel.send(randomJoke);  
       });
    }
};