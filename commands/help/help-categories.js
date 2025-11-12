const HelpSystem = require('../../systems/HelpSystem');

// Générer dynamiquement les commandes d'aide pour chaque catégorie
const categories = Object.keys(HelpSystem.getAllCategories());

categories.forEach(category => {
    const commandName = `help${category}`;
    
    module.exports[commandName] = {
        name: commandName,
        description: `Show ${category} commands`,
        execute: async (client, message, args) => {
            await message.edit(HelpSystem.getCategoryHelp(category, client.config));
        }
    };
});

// Exporter chaque commande individuellement
module.exports.helpflood = module.exports.helpflood;
module.exports.helputils = module.exports.helputils;
module.exports.helpadmin = module.exports.helpadmin;
module.exports.helprpc = module.exports.helprpc;
module.exports.helpfun = module.exports.helpfun;
module.exports.helpstats = module.exports.helpstats;
module.exports.helptoken = module.exports.helptoken;
module.exports.helpnsfw = module.exports.helpnsfw;
module.exports.helpstalk = module.exports.helpstalk;
module.exports.helpfriend = module.exports.helpfriend;
module.exports.helpnuke = module.exports.helpnuke;
module.exports.helpvocal = module.exports.helpvocal;