import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";

export const pdfConverterButton = async (message, name, userId, username) => {
  const embed = new EmbedBuilder()
    .setTitle(`You Uploaded ${name}`)
    .setDescription("Select Below which file you want to convert to");

  const button1 = new ButtonBuilder()
    .setCustomId(`my-button-docx-${userId}`)
    .setLabel("Docx")
    .setStyle(ButtonStyle.Primary);

  const button2 = new ButtonBuilder()
    .setCustomId("my-button-jpeg")
    .setLabel("Jpeg")
    .setStyle(ButtonStyle.Secondary);

  const button3 = new ButtonBuilder()
    .setCustomId("my-button-ppt")
    .setLabel("Powerpoint")
    .setStyle(ButtonStyle.Success);

  const row = new ActionRowBuilder().addComponents(button1, button2, button3);

  await message.author.send({
    embeds: [embed],
    components: [row],
    ephemeral: true, // Set the ephemeral option to true
  });

  await message.reply({
    content: `${username} Please Check your DM for the conversion options!`,
    ephemeral: true,
  });
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
