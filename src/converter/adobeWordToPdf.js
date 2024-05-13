import {
  ServicePrincipalCredentials,
  PDFServices,
  MimeType,
  CreatePDFJob,
  CreatePDFParams,
  CreatePDFResult,
  DocumentLanguage,
  SDKError,
  ServiceUsageError,
  ServiceApiError,
} from "@adobe/pdfservices-node-sdk";
import { createReadStream, createWriteStream, mkdirSync } from "fs";
import {
  ADOBE_SERVICES_CLIENT_ID,
  ADOBE_SERVICES_CLIENT_SECRET,
} from "../serverConfig/config.js";
import axios from "axios";

/**
 * This sample illustrates how to provide documentLanguage option when creating a pdf file from docx file.
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */
const wordtoPdf = async (wordUrl) => {
  let readStream;
  try {
    // Initial setup, create credentials instance
    const credentials = new ServicePrincipalCredentials({
      clientId: ADOBE_SERVICES_CLIENT_ID,
      clientSecret: ADOBE_SERVICES_CLIENT_SECRET,
    });

    // Creates a PDF Services instance
    const pdfServices = new PDFServices({ credentials });

    // Creates an asset(s) from source file(s) and upload
    const response = await axios.get(wordUrl, { responseType: "stream" });
    readStream = response.data;

    // readStream = createReadStream("resources/createPDFInput.docx");
    const inputAsset = await pdfServices.upload({
      readStream,
      mimeType: MimeType.DOCX,
    });

    // Create parameters for the job
    const params = new CreatePDFParams({
      documentLanguage: DocumentLanguage.EN_US,
    });

    // Creates a new job instance
    const job = new CreatePDFJob({ inputAsset, params });

    // Submit the job and get the job result
    const pollingURL = await pdfServices.submit({ job });
    const pdfServicesResponse = await pdfServices.getJobResult({
      pollingURL,
      resultType: CreatePDFResult,
    });

    // Get content from the resulting asset(s)
    const resultAsset = pdfServicesResponse.result.asset;
    const streamAsset = await pdfServices.getContent({ asset: resultAsset });
    return streamAsset.readStream;

    // Creates an output stream and copy result asset's content to it
    const outputFilePath = createOutputFilePath();
    console.log(`Saving asset at ${outputFilePath}`);

    const outputStream = createWriteStream(outputFilePath);
    streamAsset.readStream.pipe(outputStream);
  } catch (err) {
    if (
      err instanceof SDKError ||
      err instanceof ServiceUsageError ||
      err instanceof ServiceApiError
    ) {
      console.log("Exception encountered while executing operation", err);
    } else {
      console.log("Exception encountered while executing operation", err);
    }
  } finally {
    readStream?.destroy();
  }
};

// Generates a string containing a directory structure and file name for the output file
function createOutputFilePath() {
  const filePath = "output/CreatePDFFromDOCXWithOptions/";
  const date = new Date();
  const dateString =
    date.getFullYear() +
    "-" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + date.getDate()).slice(-2) +
    "T" +
    ("0" + date.getHours()).slice(-2) +
    "-" +
    ("0" + date.getMinutes()).slice(-2) +
    "-" +
    ("0" + date.getSeconds()).slice(-2);
  mkdirSync(filePath, { recursive: true });
  return `${filePath}create${dateString}.pdf`;
}

export default wordtoPdf;
