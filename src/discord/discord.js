import { Client, GatewayIntentBits } from "discord.js";
import { DISCORD_BOT_TOKEN, CLIENT_ID } from "../serverConfig/config.js";
import { parseStringify } from "../utils.js/utils.js";
import { imageHandler, wordHandler } from "../interactionHandler/handler.js";
import pdfConverterButton from "./button.js";

// const userConversions = {};
const userQueue = [];

const clientResponse = async () => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    const attachment = parseStringify(message.attachments);
    try {
      if (attachment[0]?.contentType === "application/pdf") {
        const name = attachment[0]?.name.split(".")[0];
        const attachmentUrl = attachment[0]?.url;
        const userId = message.author.id;
        const username = message.author.username;

        userQueue.push({
          userId,
          name,
          attachmentUrl,
        });

        await pdfConverterButton(
          message,
          attachment[0]?.name,
          userId,
          username
        );
        await message.delete();
      }
    } catch (error) {
      throw new Error(error);
    }
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    const userId = interaction.user.id;
    // const messageObject = userConversions[userId];

    const userConversion = userQueue.find((item) => item.userId === userId);

    if (!userConversion) {
      return interaction.reply("No file conversion in progress.");
    }

    if (interaction.customId === `my-button-docx-${userId}`) {
      // await interaction.reply(`You clicked ${userConversion.name}`);
      await wordHandler(interaction, userConversion);
    } else if (interaction.customId === "my-button-jpeg") {
      await imageHandler(interaction, messageObject);
    } else if (interaction.customId === "my-button-ppt") {
      await interaction.reply("You clicked ppt");
    }
    const index = userQueue.findIndex((item) => item.userId === userId);
    if (index !== -1) {
      userQueue.splice(index, 1);
    }
  });

  client.login(DISCORD_BOT_TOKEN);
};

export default clientResponse;
