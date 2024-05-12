import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";

const pdfConverterButton = async (message, name, userId) => {
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

  await message.channel.send({
    embeds: [embed],
    components: [row],
    ephemeral: true, // Set the ephemeral option to true
  });

  await message.reply({
    content: "Check your direct messages for the conversion options!",
    ephemeral: true,
  });
};

export default pdfConverterButton;
