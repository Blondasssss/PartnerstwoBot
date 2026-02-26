const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Pobieramy dane z ustawień Rendera (Environment Variables)
const prefix = "!";
const partnerChannelId = process.env.PARTNER_CHANNEL_ID;
const logChannelId = process.env.LOG_CHANNEL_ID;

client.once('ready', () => {
    console.log(`Bot Blondasa na hostingu! Zalogowano jako: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'partner') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return;

        const partnerName = args[0]; 
        const inviteLink = args[1];
        const description = args.slice(2).join(" ");

        if (!partnerName || !inviteLink || !description) {
            return message.reply("Użycie: `!partner [Kto] [Link] [Opis]`");
        }

        const partnerChannel = client.channels.cache.get(partnerChannelId);

        const partnerEmbed = new EmbedBuilder()
            .setTitle("🤝 Nowa Współpraca!")
            .setColor("#5865F2")
            .setDescription(description)
            .addFields(
                { name: "👤 Realizator", value: `${message.author}`, inline: true },
                { name: "🔗 Zaproszenie", value: `[Dołącz teraz](${inviteLink})`, inline: true },
                { name: "👥 Partner", value: `${partnerName}`, inline: true }
            )
            .setFooter({ text: "System Partnerstw - Blondas" })
            .setTimestamp();

        try {
            if (partnerChannel) {
                await partnerChannel.send({ embeds: [partnerEmbed] });
                await message.react('✅');
            }
        } catch (error) {
            console.error("Błąd wysyłania:", error);
        }
    }
});

client.login(process.env.TOKEN);
