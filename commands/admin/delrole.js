module.exports = {
    name: 'delrole',
    description: 'Delete a specific server role',
    execute: async (client, message, args) => {
        if (!message.guild) {
            return message.edit('❌ This command can only be used in a server.');
        }

        if (!message.member.permissions.has('MANAGE_ROLES')) {
            return message.edit('❌ You need the "Manage Roles" permission to use this command.');
        }

        const roleName = args.join(' ');
        if (!roleName) {
            return message.edit('❌ Please specify a role name to delete.');
        }

        const role = message.guild.roles.cache.find(r => r.name === roleName);
        if (!role) {
            return message.edit(`❌ Role "${roleName}" not found.`);
        }

        if (!role.editable) {
            return message.edit('❌ I cannot delete this role. It may be higher than my highest role.');
        }

        try {
            await role.delete();
            await message.edit(`✅ Role "${roleName}" deleted successfully.`);
        } catch (error) {
            console.error('Delete role error:', error);
            await message.edit('❌ Failed to delete the role.');
        }
    }
};