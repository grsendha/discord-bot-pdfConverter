import pdfToWord from "../converter/adobePdf.js";
import pdfToImage from "../converter/adobePdfToImage.js";

export const wordHandler = async (interaction, messageObject) => {
  await interaction.deferReply({
    ephemeral: true,
  });

  await interaction.editReply({
    content: "Conversion In Progress...",
  });

  const convertedStream = await pdfToWord(
    messageObject.name,
    messageObject.attachmentUrl
  );
  if (convertedStream) {
    const chunks = [];
    for await (const chunk of convertedStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    await interaction.editReply({
      content: "Conversion complete!",
      files: [
        {
          attachment: buffer,
          name: `${messageObject.name}.docx`,
        },
      ],
    });
  }
};

export const imageHandler = async (interaction, messageObject) => {
  await interaction.deferReply({
    ephemeral: true,
  });

  await interaction.editReply({
    content: "Conversion In Progress...",
  });

  const convertedStream = await pdfToImage(
    messageObject.name,
    messageObject.attachmentUrl
  );
  if (convertedStream) {
    const chunks = [];
    for await (const chunk of convertedStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    await interaction.editReply({
      content: "Conversion complete!",
      files: [
        {
          attachment: buffer,
          name: `${messageObject.name}.zip`,
        },
      ],
    });
  }
};
