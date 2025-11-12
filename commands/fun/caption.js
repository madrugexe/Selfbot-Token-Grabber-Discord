const { createCanvas, loadImage } = require('canvas');
const https = require('https');
const http = require('http');

module.exports = {
    name: 'caption',
    description: 'Add caption text to an image',
    execute: async (client, message, args) => {
        try {
            await message.delete().catch(() => {});

            if (args.length === 0) {
                const errorMsg = await message.channel.send('❌ Usage: `!caption <text>` (with an image attached)');
                setTimeout(() => errorMsg.delete().catch(() => {}), 3000);
                return;
            }

            // Vérifier s'il y a une image dans le message
            const imageAttachment = message.attachments.first();
            if (!imageAttachment) {
                const errorMsg = await message.channel.send('❌ Please attach an image to add caption!');
                setTimeout(() => errorMsg.delete().catch(() => {}), 3000);
                return;
            }

            // Vérifier que c'est une image supportée
            const supportedFormats = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
            const attachmentName = imageAttachment.name.toLowerCase();
            const isSupportedImage = supportedFormats.some(format => 
                attachmentName.endsWith(format)
            );

            if (!isSupportedImage) {
                const errorMsg = await message.channel.send('❌ Unsupported image format. Use PNG, JPG, JPEG, GIF, or WebP.');
                setTimeout(() => errorMsg.delete().catch(() => {}), 3000);
                return;
            }

            const captionText = args.join(' ');
            
            // Message de traitement
            const processingMsg = await message.channel.send('🔄 Processing image with caption...');

            try {
                // Fonction pour charger l'image avec timeout
                const loadImageWithTimeout = (url) => {
                    return new Promise((resolve, reject) => {
                        const timeout = setTimeout(() => {
                            reject(new Error('Image loading timeout'));
                        }, 10000);

                        loadImage(url)
                            .then(image => {
                                clearTimeout(timeout);
                                resolve(image);
                            })
                            .catch(error => {
                                clearTimeout(timeout);
                                reject(error);
                            });
                    });
                };

                // Charger l'image avec gestion d'erreur
                const image = await loadImageWithTimeout(imageAttachment.url);
                
                // Créer un canvas plus grand pour accommoder le caption
                const captionHeight = 80;
                const canvas = createCanvas(image.width, image.height + captionHeight);
                const ctx = canvas.getContext('2d');

                // Fond blanc pour le caption
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, image.width, captionHeight);

                // Bordure grise en bas du caption
                ctx.strokeStyle = '#DDDDDD';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, captionHeight);
                ctx.lineTo(image.width, captionHeight);
                ctx.stroke();

                // Ajouter l'image originale en dessous
                ctx.drawImage(image, 0, captionHeight);

                // Style du texte
                ctx.fillStyle = '#000000';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                // Ajuster la taille de la police
                let fontSize = 36;
                const maxWidth = image.width - 40;
                
                ctx.font = `bold ${fontSize}px Arial`;
                let textWidth = ctx.measureText(captionText).width;
                
                while (textWidth > maxWidth && fontSize > 12) {
                    fontSize -= 2;
                    ctx.font = `bold ${fontSize}px Arial`;
                    textWidth = ctx.measureText(captionText).width;
                }

                // Dessiner le texte
                ctx.fillText(captionText, image.width / 2, captionHeight / 2);

                // Convertir en buffer
                const buffer = canvas.toBuffer('image/png');

                // Envoyer l'image modifiée
                await message.channel.send({
                    content: `📝 **Caption:** ${captionText}`,
                    files: [{
                        attachment: buffer,
                        name: 'caption-image.png'
                    }]
                });

                // Supprimer le message de traitement
                await processingMsg.delete().catch(() => {});

            } catch (imageError) {
                console.error('Image processing error:', imageError);
                
                let errorMessage = '❌ Error processing image.';
                if (imageError.message.includes('Unsupported image type')) {
                    errorMessage = '❌ Unsupported image type. Try PNG, JPG, or WebP.';
                } else if (imageError.message.includes('timeout')) {
                    errorMessage = '❌ Image loading timeout. Try a smaller image.';
                }
                
                await processingMsg.edit(errorMessage);
                setTimeout(() => processingMsg.delete().catch(() => {}), 4000);
            }

        } catch (error) {
            console.error('caption error:', error);
            const errorMsg = await message.channel.send('❌ Error creating caption.');
            setTimeout(() => errorMsg.delete().catch(() => {}), 3000);
        }
    }
};