import { Client, GatewayIntentBits } from "discord.js";
import { DISCORD_BOT_TOKEN, CLIENT_ID } from "../serverConfig/config.js";
import { parseStringify } from "../utils.js/utils.js";
import {
  imageHandler,
  wordHandler,
  pptToPdfHandler,
  wordToPdfHandler,
  compressHandler,
  combineHandler,
  protectHandler,
} from "../interactionHandler/handler.js";
import {
  combineButton,
  pdfConverterButton,
  wordAndPptConvertedButton,
} from "./button.js";

// const userConversions = {};
const userQueue = [];
const ConversionType = {
  PPTTOPDF: "PPTTOPDF",
  WORDTOPDF: "WORDTOPDF",
};
import {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from "discord.js";
import { Content } from "@adobe/pdfservices-node-sdk";

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
      if (attachment.length > 1) {
        const attachmentUrlArray = attachment.map((item) => {
          if (item.contentType === "application/pdf") return item.url;
        });
        const name = attachment[0]?.name.split(".")[0];
        const userId = message.author.id;
        const username = message.author.username;
        userQueue.push({
          userId,
          name,
          attachmentUrl: attachmentUrlArray,
        });
        combineButton(message, userId);
        return;
      }

      messageSwitcher(attachment, message);
    } catch (error) {
      throw new Error(error);
    }
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    const userId = interaction.user.id;
    const userConversion = userQueue.find((item) => item.userId === userId);

    if (interaction.customId === "protectPdfModal") {
      const userInput =
        interaction.fields.getTextInputValue("pdfPasswordInput");

      // You can perform any desired actions with the user input here
      await interaction.reply({
        content: `Password Submitted`,
        ephemeral: true,
      });
      await protectHandler(interaction, userConversion, userInput);
    }
    const index = userQueue.findIndex((item) => item.userId === userId);
    if (index !== -1) {
      userQueue.splice(index, 1);
    }
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;
    const userId = interaction.user.id;
    const userConversion = userQueue.find((item) => item.userId === userId);

    if (!userConversion) {
      return interaction.reply("No file conversion in progress.");
    }

    switch (interaction.customId) {
      case `my-button-docx-${userId}`:
        await wordHandler(interaction, userConversion);
        break;
      case "my-button-jpeg":
        await imageHandler(interaction, messageObject);
        break;
      case "my-button-ppt":
        await interaction.reply("You clicked ppt");
        break;
      case `my-button-${ConversionType.WORDTOPDF}-${userId}`:
        await wordToPdfHandler(interaction, userConversion);
        break;
      case `my-button-${ConversionType.PPTTOPDF}-${userId}`:
        await pptToPdfHandler(interaction, userConversion);
        break;
      case `my-button-combine-${userId}`:
        await combineHandler(interaction, userConversion);
        break;
      case `my-button-compress-${userId}`:
        {
          await compressHandler(interaction, userConversion);
        }
        break;
      case `my-button-protect-${userId}`:
        {
          await handleProtectPDFClick(interaction, userId, userConversion);
        }
        break;
      default:
        break;
    }
    if (!interaction.customId === `my-button-protect-${userId}`) {
      const index = userQueue.findIndex((item) => item.userId === userId);
      if (index !== -1) {
        userQueue.splice(index, 1);
      }
    }
  });

  client.login(DISCORD_BOT_TOKEN);
};

const messageSwitcher = async (attachment, message) => {
  const contentType = attachment[0]?.contentType;

  switch (contentType) {
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      {
        const name = attachment[0]?.name.split(".")[0];
        const attachmentUrl = attachment[0]?.url;
        const userId = message.author.id;
        const username = message.author.username;
        const type = ConversionType.PPTTOPDF;
        userQueue.push({
          userId,
          name,
          attachmentUrl,
        });
        wordAndPptConvertedButton(
          type,
          message,
          attachment[0]?.name,
          userId,
          username
        );
      }
      break;
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      {
        const name = attachment[0]?.name.split(".")[0];
        const attachmentUrl = attachment[0]?.url;
        const userId = message.author.id;
        const username = message.author.username;
        const type = ConversionType.WORDTOPDF;

        userQueue.push({
          userId,
          name,
          attachmentUrl,
        });
        wordAndPptConvertedButton(
          type,
          message,
          attachment[0]?.name,
          userId,
          username
        );
      }
      break;
    case "application/pdf":
      {
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
      break;
    default:
      return;
  }
};

const handleProtectPDFClick = async (interaction, userId, userConversion) => {
  // Create the modal

  const modal = new ModalBuilder()
    .setCustomId(`protectPdfModal`)
    .setTitle("Protect Your PDF");

  // Create the text input component for the password

  const passwordInput = new TextInputBuilder()
    .setCustomId("pdfPasswordInput")
    .setLabel("Enter your password")
    .setStyle(TextInputStyle.Short);

  // Add components to modal

  const firstActionRow = new ActionRowBuilder().addComponents(passwordInput);
  modal.addComponents(firstActionRow);

  // Show the modal to the user

  await interaction.showModal(modal);
};

export default clientResponse;
