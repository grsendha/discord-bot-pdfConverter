import pdfCompressor from "../converter/adbobeCompress.js";
import pdfCombine from "../converter/adobeCombine.js";
import pdfToWord from "../converter/adobePdf.js";
import pdfToImage from "../converter/adobePdfToImage.js";
import pdfProtect from "../converter/adobeProtect.js";
import pptToPdf from "../converter/adobepptTopdf.js";
import wordtoPdf from "../converter/adobewordToPdf.js";

export const wordHandler = async (interaction, messageObject) => {
  // await interaction.deferReply({
  //   ephemeral: true,
  // });

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
      ephemeral: true,
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

export const wordToPdfHandler = async (interaction, messageObject) => {
  await interaction.deferReply({
    ephemeral: true,
  });

  await interaction.editReply({
    content: "Conversion In Progress...",
  });

  const convertedStream = await wordtoPdf(messageObject.attachmentUrl);
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
          name: `${messageObject.name}.pdf`,
        },
      ],
    });
  }
};

export const pptToPdfHandler = async (interaction, messageObject) => {
  await interaction.deferReply({
    ephemeral: true,
  });

  await interaction.editReply({
    content: "Conversion In Progress...",
  });
  const convertedStream = await pptToPdf(messageObject.attachmentUrl);
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
          name: `${messageObject.name}.pdf`,
        },
      ],
    });
  }
};

export const compressHandler = async (interaction, messageObject) => {
  await interaction.deferReply({
    ephemeral: true,
  });

  await interaction.editReply({
    content: "Conversion In Progress...",
  });
  const convertedStream = await pdfCompressor(messageObject.attachmentUrl);
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
          name: `${messageObject.name}.pdf`,
        },
      ],
    });
  }
};

export const combineHandler = async (interaction, messageObject) => {
  await interaction.deferReply({
    ephemeral: true,
  });

  await interaction.editReply({
    content: "Conversion In Progress...",
  });
  console.log({ messageObject });
  const convertedStream = await pdfCombine(messageObject.attachmentUrl);
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
          name: `${messageObject.name}-combined.pdf`,
        },
      ],
    });
  }
};

export const protectHandler = async (interaction, messageObject, password) => {
  // await interaction.deferReply({
  //   ephemeral: true,
  // });

  await interaction.editReply({
    content: "Conversion In Progress...",
  });
  console.log({ messageObject });
  const convertedStream = await pdfProtect(
    messageObject.attachmentUrl,
    password
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
          name: `${messageObject.name}.pdf`,
        },
      ],
    });
  }
};
