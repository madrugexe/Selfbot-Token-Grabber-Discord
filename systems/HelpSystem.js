const commandCategories = {
    flood: {
        '!setflood': '<number> <message> - Set a flood message',
        '!modifflood': '<number> <message> - Modify an existing message',
        '!delflood': '<number> - Delete a message',
        '!listflood': '- Show all flood messages',
        '!clearflood': '- Clear the entire sequence',
        '!flood': '<delay> - Start flood (delay in ms)',
        '!stopflood': '- Stop flood',
        '!countflood': '- Show message count'
    },
    utils: {
        '!ping': '- Show bot ping',
        '!calc': '<expression> - Calculate an expression',
        '!panel': '- Create private DM panel',
        '!snipe': '- View last deleted message',
        '!purge': '<number> - Delete messages',
        '!test': '- Test the $B'
    },
    stats: {
        '!stats': '- Show statistics',
        '!userinfo': '<@user> - User information',
        '!serverinfo': '- Server information',
        '!avatar': '<@user> - Show avatar',
        '!banner': '<@user> - Show banner'

    },
    admin: {
        '!kick': '<@user> - Kick a user',
        '!ban': '<@user> - Ban a user',
        '!mute': '<@user> - Mute a user',
        '!delrole': '- Delete a specific server role (requires permissions)',
        '!delsalon': '- Delete a specific server channel (requires permissions)'
    },
    rpc: {
        '!configrpc list': '- Show all RPC commands',
        '!configrpc_off': '- stop RPC',
        '!configrpc_on': '- start RPC'
    },
    fun: {
        '!nitrotroll': '- Send fake nitro code to troll',
        '!joke': '- Tell a random joke',
        '!rate': '<@user> - Rate a user with random appreciation',
        '!caca': '<@user> - Throw "caca" on a user with random response',
        '!secret': '- ??? Shh... its confidential ',
        '!coinflip': '- Flip a coin and show "Heads 🪙" or "Tails',
        '!goat': '- Show bot credits',
        '!caption': '<text> - Add caption text to an image (attach an image)'
    },
    token: {
        '!tokenfuck': '<token> - nuke a token',
        '!checktoken': '<token> - check if a token is valid',
        '!tokeninfo': '<token> - see token info',
        '!spytoken': '<@user> - Show the beginning of a users token'
    },
    nsfw: {
        '!hentai': 'Show multiple random hentai images',
        '!gore': 'Show multiple random gore images',
        '!milf': 'Show multiple random milf images',
        '!x': 'Show multiple random X images'
    },
    stalk: {
        '!stalk': '<@user> - Start stalking a user',
        '!stopstalk': '- Stop stalking',
        '!stalkview': '- View captured messages with file links',
        '!stalkstatus': '- Show current stalk status',
        '!stalkclear': '- Clear stored messages',
        '!stalkhistory': '- View stalk history'
},
    friend: {
        '!dmfriends': '<message> - Send message to all friends',
        '!leavegroups': '- Leave all groups',
        '!leaveservers': '- Leave all servers',
        '!antigroup': '<on/off> - Enable/disable anti-group',
        '!closedm': '- Close all your DMs'
    },
    vocal: {
        '!joinvc': '<id> - Join a voice channel by ID',
        '!leavevc': '- Leave the voice channel',
        '!vocalview': '<@user> or <id user> - Check if user is in voice and get link'
    },
    nuke: {
        '!raid': '- Destroy a Discord server requires permissions',
        '!spam': '<number of spam> <message> - Start massive spam'
    }
};

class HelpSystem {
    static getMainHelp(config) {
        return `**${config.botName}**\n\n**📂 Available categories:**\n` +
               `💥\`!helpflood\` - Flood commands\n` +
               `🛠️\`!helputils\` - Utility commands\n` +
               `👑\`!helpadmin\` - Admin commands\n` +
               `🎮\`!helprpc\` - RPC commands\n` +
               `🎲\`!helpfun\` - Fun commands\n` +
               `📊\`!helpstats\` - Statistics and info commands\n` +
               `🔑\`!helptoken\` - Token commands\n` +
               `🕵️\`!helpstalk\` - User stalking commands\n` +
               `🤝\`!helpfriend\` - Friends and DM management commands\n` +
               `🎤\`!helpvocal\` - Voice channel commands\n` +
               `💣\`!helpnuke\` - Server nuke commands\n` +
               `🔞\`!helpnsfw\` - NSFW commands\n\n` +
               `**💡 Use !help<category> to see specific commands**`;
    }

    static getCategoryHelp(category, config) {
        if (!commandCategories[category]) {
            return '❌ Category not found.';
        }
        
        let helpText = `**${config.botName} - ${category} Commands**\n\n`;
        for (const [cmd, desc] of Object.entries(commandCategories[category])) {
            helpText += `\`${cmd} ${desc}\`\n`;
        }
        return helpText;
    }

    static getAllCategories() {
        return commandCategories;
    }
}

module.exports = HelpSystem;