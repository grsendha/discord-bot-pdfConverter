import {
  ServicePrincipalCredentials,
  PDFServices,
  MimeType,
  ExportPDFParams,
  ExportPDFTargetFormat,
  ExportOCRLocale,
  ExportPDFJob,
  ExportPDFResult,
  SDKError,
  ServiceUsageError,
  ServiceApiError,
} from "@adobe/pdfservices-node-sdk";
import { createReadStream, createWriteStream } from "fs";
import axios from "axios";
import fs from "fs";

import {
  ADOBE_SERVICES_CLIENT_SECRET,
  ADOBE_SERVICES_CLIENT_ID,
} from "../serverConfig/config.js";

const pdfToWord = async (name, pdfUrl) => {
  let readStream;
  try {
    // Initial setup, create credentials instance
    const credentials = new ServicePrincipalCredentials({
      clientId: ADOBE_SERVICES_CLIENT_ID,
      clientSecret: ADOBE_SERVICES_CLIENT_SECRET,
    });

    // Creates a PDF Services instance
    const pdfServices = new PDFServices({ credentials });

    const response = await axios.get(pdfUrl, { responseType: "stream" });
    readStream = response.data;

    // Creates an asset(s) from source file(s) and upload
    // readStream = fs.createReadStream("resources/exportPDFInput.pdf");
    const inputAsset = await pdfServices.upload({
      readStream,
      mimeType: MimeType.PDF,
    });

    // Create parameters for the job
    const params = new ExportPDFParams({
      targetFormat: ExportPDFTargetFormat.DOCX,
      ocrLocale: ExportOCRLocale.EN_US,
    });

    // Creates a new job instance
    const job = new ExportPDFJob({ inputAsset, params });

    // Submit the job and get the job result
    const pollingURL = await pdfServices.submit({ job });
    const pdfServicesResponse = await pdfServices.getJobResult({
      pollingURL,
      resultType: ExportPDFResult,
    });

    // Get content from the resulting asset(s)
    const resultAsset = pdfServicesResponse.result.asset;
    const streamAsset = await pdfServices.getContent({ asset: resultAsset });
    return streamAsset.readStream;

    // Creates an output stream and copy stream asset's content to it
    const outputFilePath = createOutputFilePath(name);
    console.log(`Saving asset at ${outputFilePath}`);

    const outputStream = fs.createWriteStream(outputFilePath);
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
  }
};

function createOutputFilePath(name) {
  const filePath = "output/ExportPDFToDOCXWithOCROptions/";
  fs.mkdirSync(filePath, { recursive: true });
  return `${name}.docx`;
}

export default pdfToWord;
