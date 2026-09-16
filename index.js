const { Client, GatewayIntentBits, Events } = require("discord.js");
require("dotenv").config({ debug: false });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

let petrificationTrap = null;

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  const channelId = process.env.CHANNEL_ID;
  if (message.channel.id !== channelId) return;

  if (petrificationTrap) {
    if (message.author.id === petrificationTrap.setterId) return;

    clearTimeout(petrificationTrap.expireTimer);
    const trap = petrificationTrap;
    petrificationTrap = null;

    const member = await message.guild.members
      .fetch(message.author.id)
      .catch(() => null);
    if (!member) return;

    if (!member.moderatable) {
      return;
    }

    try {
      await member.timeout(
        trap.durationMs,
        `Petrified by the Medusa Device (${trap.distance})`,
      );
      await message.channel.send(
        `Medusa activated! <@${message.author.id}> has been petrified for **${trap.durationSec} second(s)**! (${trap.distance})`,
      );
    } catch (err) {
      await message.channel.send(
        "An error occurred while activating the device.",
      );
    }
    return;
  }

  const match = message.content
    .trim()
    .match(/^(\d+)\s*(?:meter|meters|m)\s+(\d+)\s*(?:second|seconds|s)$/i);

  if (match) {
    if (message.author.id !== process.env.OWNER_ID) return;

    const distanceVal = match[1];
    const seconds = parseInt(match[2], 10);

    if (seconds <= 0 || seconds > 2419200) {
      await message.reply("Duration must be between 1 second and 28 days.");
      return;
    }

    if (petrificationTrap) {
      clearTimeout(petrificationTrap.expireTimer);
    }

    const durationMs = seconds * 1000;
    const expireTimer = setTimeout(() => {
      petrificationTrap = null;
    }, durationMs);

    petrificationTrap = {
      setterId: message.author.id,
      distance: `${distanceVal} meter`,
      durationSec: seconds,
      durationMs: durationMs,
      expireTimer: expireTimer,
    };

    await message.channel.send(
      `Medusa device set: **${distanceVal} meter, ${seconds} second**.!`,
    );
  }
});

client.login(process.env.DISCORD_TOKEN);
