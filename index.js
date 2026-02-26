const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField } = require('discord.js');
const config = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`Bot Blondasa śmiga! Zalogowano jako: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'partner') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply("Nie masz uprawnień!");
        }

        const partnerName = args[0]; // Może być @maciejowsk (jako tekst)
        const inviteLink = args[1];  // Link do serwera
        const description = args.slice(2).join(" "); // Reszta to opis

        if (!partnerName || !inviteLink || !description) {
            return message.reply("Użycie: `!partner [Nazwa_Partnera] [Link] [Opis]`");
        }

        const partnerChannel = client.channels.cache.get(config.partnerChannelId);
        const logChannel = client.channels.cache.get(config.logChannelId);

        const partnerEmbed = new EmbedBuilder()
            .setTitle("🤝 Nowa Współpraca!")
            .setColor("#5865F2")
            .setDescription(description)
            .addFields(
                { name: "👤 Realizator", value: `${message.author}`, inline: true },
                { name: "🔗 Zaproszenie", value: `[Dołącz teraz](${inviteLink})`, inline: true },
                { name: "👥 Partner", value: `${partnerName}`, inline: true }
            )
            .setFooter({ text: config.footerText })
            .setTimestamp();

        try {
            if (partnerChannel) {
                await partnerChannel.send({ embeds: [partnerEmbed] });
                message.reply(`✅ Wysłano partnerstwo dla **${partnerName}**!`);
                if (logChannel) logChannel.send(`📢 **Log:** ${message.author.tag} dodał partnerstwo z **${partnerName}**.`);
            } else {
                message.reply("❌ Błąd: Nieprawidłowe ID kanału w config.json!");
            }
        } catch (error) {
            console.error(error);
            message.reply("❌ Coś poszło nie tak. Sprawdź konsolę!");
        }
    }
});

client.login(config.token);