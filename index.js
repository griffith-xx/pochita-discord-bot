const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config({ debug: false });

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers
    ]
});

client.once('clientReady', async (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);

    const channelId = process.env.CHANNEL_ID;
    const roleId = process.env.ADVERTISER_ROLE_ID; 

    const channel = await client.channels.fetch(channelId).catch(console.error);

    if (!channel) {
        console.error("Channel not found!");
        return;
    }

    const sendPing = () => {
        const gccArenaLink = "https://discord.com/channels/1416789228825870428/1517949393087631501";
        const cardChroniclesLink = "https://discord.com/channels/1303002484255625216/1511785581904924752";

        const reminderEmbed = new EmbedBuilder()
            .setColor('#FF5555')
            .setTitle('⏳ Time to Work! / Announcement')
            .setDescription(`📢 Team <@&${roleId}>, it's time to update your posts!\n\nPlss post/forward your ads from ${gccArenaLink} to ${cardChroniclesLink}`)
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                { name: '🕒 Interval', value: 'Every 1.5 hours', inline: true },
                { name: '🔔 Status', value: 'Active', inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Automated Reminder System', iconURL: client.user.displayAvatarURL() });

        channel.send({ 
            content: `<@&${roleId}>`,
            embeds: [reminderEmbed] 
        }).catch(console.error);
    };

    sendPing();

    const intervalTime = 1.5 * 60 * 60 * 1000;
    setInterval(sendPing, intervalTime);
});

client.login(process.env.DISCORD_TOKEN);