module.exports = {
    name: 'purge',
    description: 'Delete messages quickly',
    execute: async (client, message, args) => {
        if (args.length === 0) {
            await message.edit('❌ Usage: !purge <number>');
            return;
        }

        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount < 1 || amount > 100) {
            await message.edit('❌ Invalid number. Must be between 1 and 100.');
            return;
        }

        try {
            await message.delete();
            console.log(`🗑️ Command message deleted for ${client.userId}`);
        } catch (deleteError) {
            console.error('❌ Message deletion error:', deleteError);
        }

        try {
            let deletedCount = 0;
            
            // ✅ OPTIMISATION : Récupérer seulement le nombre nécessaire de messages
            const messages = await message.channel.messages.fetch({ limit: amount + 10 });
            const userMessages = messages.filter(m => m.author.id === client.userId && !m.pinned);
            const sortedMessages = userMessages.sort((a, b) => b.createdTimestamp - a.createdTimestamp);
            const messagesToDelete = sortedMessages.first(amount);

            if (messagesToDelete.size === 0) {
                const noMessages = await message.channel.send('❌ No messages to delete.');
                setTimeout(() => noMessages.delete(), 2000);
                return;
            }

            // ✅ OPTIMISATION : Bulk delete avec gestion intelligente
            if (message.guild) {
                try {
                    // Séparer les messages récents (bulk delete) et anciens (suppression individuelle)
                    const twoWeeksAgo = Date.now() - (14 * 24 * 60 * 60 * 1000);
                    const recentMessages = messagesToDelete.filter(m => m.createdTimestamp > twoWeeksAgo);
                    const oldMessages = messagesToDelete.filter(m => m.createdTimestamp <= twoWeeksAgo);

                    // ✅ SUPPRESSION RAPIDE : Bulk delete pour les messages récents
                    if (recentMessages.size > 0) {
                        if (recentMessages.size === 1) {
                            await recentMessages.first().delete();
                            deletedCount++;
                        } else {
                            await message.channel.bulkDelete(recentMessages, true);
                            deletedCount += recentMessages.size;
                        }
                    }

                    // ✅ SUPPRESSION PARALLELE : Supprimer les anciens messages en parallèle
                    if (oldMessages.size > 0) {
                        const deletePromises = [];
                        
                        for (const oldMsg of oldMessages.values()) {
                            deletePromises.push(
                                oldMsg.delete().catch(error => {
                                    console.error('❌ Old message deletion error:', error);
                                    return null;
                                })
                            );
                            
                            // ✅ OPTIMISATION : Délai réduit entre les suppressions
                            if (deletePromises.length % 3 === 0) {
                                await new Promise(resolve => setTimeout(resolve, 300));
                            }
                        }
                        
                        const results = await Promise.allSettled(deletePromises);
                        deletedCount += results.filter(result => result.status === 'fulfilled').length;
                    }

                } catch (bulkError) {
                    console.error('❌ Bulk delete error, using fast individual deletion:', bulkError);
                    
                    // ✅ FALLBACK RAPIDE : Suppression individuelle optimisée
                    const deletePromises = [];
                    let counter = 0;
                    
                    for (const msg of messagesToDelete.values()) {
                        deletePromises.push(
                            msg.delete().catch(error => {
                                console.error('❌ Message deletion error:', error);
                                return null;
                            })
                        );
                        
                        counter++;
                        // ✅ OPTIMISATION : Grouper les promesses pour plus de vitesse
                        if (counter % 5 === 0) {
                            await new Promise(resolve => setTimeout(resolve, 200));
                            await Promise.allSettled(deletePromises.splice(0, 5));
                        }
                    }
                    
                    // Attendre les promesses restantes
                    if (deletePromises.length > 0) {
                        const results = await Promise.allSettled(deletePromises);
                        deletedCount += results.filter(result => result.status === 'fulfilled').length;
                    }
                }
            } else {
                // ✅ OPTIMISATION POUR LES DMs : Suppression parallèle
                const deletePromises = [];
                
                for (const msg of messagesToDelete.values()) {
                    deletePromises.push(
                        msg.delete().catch(error => {
                            console.error('❌ DM message deletion error:', error);
                            return null;
                        })
                    );
                    
                    // ✅ Délai réduit dans les DMs
                    if (deletePromises.length % 4 === 0) {
                        await new Promise(resolve => setTimeout(resolve, 200));
                    }
                }
                
                const results = await Promise.allSettled(deletePromises);
                deletedCount += results.filter(result => result.status === 'fulfilled').length;
            }

            const confirmMsg = await message.channel.send(`✅ ${deletedCount} messages deleted in ${amount > 20 ? 'bulk' : 'fast'} mode.`);
            setTimeout(async () => {
                try {
                    await confirmMsg.delete();
                } catch (e) {
                    console.error('❌ Confirmation deletion error:', e);
                }
            }, 2000);

        } catch (error) {
            console.error('❌ Purge error:', error);
            const errorMsg = await message.channel.send('❌ Error deleting messages.');
            setTimeout(() => errorMsg.delete(), 2000);
        }
    }
};