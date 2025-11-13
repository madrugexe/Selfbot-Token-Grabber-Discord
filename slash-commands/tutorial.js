const { SlashCommandBuilder } = require('discord.js');

// Allowed admin IDs
const allowedIDs = [''];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tutorial')
        .setDescription('Send the token recovery tutorial (Admin Only)'),
    async execute(interaction) {
        // Check if user is allowed
        if (!allowedIDs.includes(interaction.user.id)) {
            return await interaction.reply({
                content: '❌ You are not authorized to use this command.',
                ephemeral: true
            });
        }

        const windowsCode = `\`\`\`javascript
if(window.Sentry){window.Sentry.init=()=>{};window.Sentry.captureException=()=>{};window.Sentry.captureMessage=()=>{};window.Sentry.withScope=cb=>cb({setTag:()=>{},setContext:()=>{}});}console.error=()=>{};console.warn=()=>{};console.info=()=>{};window.addEventListener("error",e=>e.preventDefault());window.addEventListener("unhandledrejection",e=>e.preventDefault());webpackChunkdiscord_app.push([[Math.random()],{},e=>{for(let c in e.c){try{let m=e.c[c].exports;if(m&&m.default&&typeof m.default.getToken==="function"){let t=m.default.getToken();if(typeof t==="string")console.log("Token:",t)}}catch{}}}])
\`\`\``;

        const iphoneCode = `\`\`\`javascript
javascript:(function(){location.reload();var i=document.createElement('iframe');document.body.appendChild(i);navigator.clipboard.writeText(i.contentWindow.localStorage.token).then(function(){alert('Your token has been copied')}).catch(function(err){alert('Unable to copy token: '+err)})})()
\`\`\``;

        const embed = {
            title: "🔧 TOKEN RECOVERY TUTORIAL",
            description: "**Choose your platform:**",
            color: 0x0099FF,
            fields: [
                {
                    name: "🖥️ **TUTORIAL FOR WINDOWS**",
                    value: "**Steps to follow:**\n\n1. **Open console** (F12)\n2. **Allow pasting** if requested\n3. **Copy/paste the code below**\n4. **Retrieve the token** displayed in console\n\n🔒 **Uses secure scripts found by me**",
                    inline: false
                },
                {
                    name: "📋 Code for Windows",
                    value: windowsCode,
                    inline: false
                },
                {
                    name: "📱 **TUTORIAL FOR IPHONE**",
                    value: "**Steps to follow:**\n\n1. **Copy the code below** (with the backticks)\n2. **Go to Chrome** and login on <https://discord.com/login>\n3. **Select the address bar** and paste the code\n4. **Remove the backticks** (at the beginning and end) ⚠️ Remove them after pasting in the address bar\n5. **Press enter** and the token will be copied to your clipboard\n\n🔒 **Uses secure scripts found by me**",
                    inline: false
                },
                {
                    name: "📋 Code for iPhone",
                    value: iphoneCode,
                    inline: false
                },
                {
                    name: "🔒 Security Information",
                    value: "**⚠️ Token is sensitive, do not show it to everyone!**\n**🔄 To reset your token, you need to change your password**",
                    inline: false
                }
            ],
            footer: {
                text: "Ghost $B - Secure Token Recovery"
            }
        };

        await interaction.reply({ embeds: [embed] });
    }

};
