import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ComponentType,
} from "discord.js";

export const combineButton = async (message, userId) => {
  const embed = new EmbedBuilder()
    .setTitle(`You Uploaded Multiple Files`)
    .setDescription("Select Below which file you want to convert to");

  const button1 = new ButtonBuilder()
    .setCustomId(`my-button-combine-${userId}`)
    .setLabel("Combine PDF")
    .setStyle(ButtonStyle.Danger);

  const row1 = new ActionRowBuilder().addComponents(button1);
  await message.channel.send({
    embeds: [embed],
    components: [row1],
    ephemeral: true, // Set the ephemeral option to true
  });
};

export const pdfConverterButton = async (message, name, userId, username) => {
  const embed = new EmbedBuilder()
    .setTitle(`You Uploaded ${name}`)
    .setDescription("Select Below which file you want to convert to");

  const button1 = new ButtonBuilder()
    .setCustomId(`my-button-docx-${userId}`)
    .setLabel("Docx")
    .setStyle(ButtonStyle.Success);

  const button2 = new ButtonBuilder()
    .setCustomId("my-button-jpeg")
    .setLabel("Jpeg")
    .setStyle(ButtonStyle.Success);

  const button3 = new ButtonBuilder()
    .setCustomId(`my-button-combine-${userId}`)
    .setLabel("Combine PDF")
    .setStyle(ButtonStyle.Danger);
  const button4 = new ButtonBuilder()
    .setCustomId(`my-button-compress-${userId}`)
    .setLabel("Compress PDF")
    .setStyle(ButtonStyle.Danger);
  const button5 = new ButtonBuilder()
    .setCustomId(`my-button-protect-${userId}`)
    .setLabel("Protect PDF")
    .setStyle(ButtonStyle.Danger);

  const row1 = new ActionRowBuilder().addComponents(button3, button4, button5);

  const row2 = new ActionRowBuilder().addComponents(button1, button2);
  await message.channel.send({
    embeds: [embed],
    components: [row2, row1],
    ephemeral: true, // Set the ephemeral option to true
  });

  // await message.reply({
  //   content: `${username} Please Check your DM for the conversion options!`,
  //   ephemeral: true,
  // });
};

export const wordAndPptConvertedButton = async (
  type,
  message,
  name,
  userId,
  username
) => {
  const embed = new EmbedBuilder()
    .setTitle(`You Uploaded ${name}`)
    .setDescription("Select Below which file you want to convert to");

  const button = new ButtonBuilder()
    .setCustomId(`my-button-${type}-${userId}`)
    .setLabel("PDF")
    .setStyle(ButtonStyle.Danger);

  const row = new ActionRowBuilder().addComponents(button);

  await message.channel.send({
    embeds: [embed],
    components: [row],
    ephemeral: true, // Set the ephemeral option to true
  });

  // await message.reply({
  //   content: `${username} Please Check your DM for the conversion options!`,
  //   ephemeral: true,
  // });
};
