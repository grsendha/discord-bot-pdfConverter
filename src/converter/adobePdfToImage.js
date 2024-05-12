import {
  ServicePrincipalCredentials,
  PDFServices,
  MimeType,
  ExportPDFToImagesParams,
  ExportPDFToImagesTargetFormat,
  ExportPDFToImagesOutputType,
  ExportPDFToImagesJob,
  ExportPDFToImagesResult,
  SDKError,
  ServiceUsageError,
  ServiceApiError,
} from "@adobe/pdfservices-node-sdk";
import { createReadStream, createWriteStream, mkdirSync } from "fs";
import axios from "axios";
import {
  ADOBE_SERVICES_CLIENT_ID,
  ADOBE_SERVICES_CLIENT_SECRET,
} from "../serverConfig/config.js";

/**
 * This sample illustrates how to export a PDF file to JPEG.
 * <p>
 * The resulting file is a ZIP archive containing one image per page of the source PDF file
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */
const pdfToImage = async (name, pdfUrl) => {
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
    const response = await axios.get(pdfUrl, { responseType: "stream" });
    readStream = response.data;

    // readStream = createReadStream("resources/exportPDFToImageInput.pdf");
    const inputAsset = await pdfServices.upload({
      readStream,
      mimeType: MimeType.PDF,
    });

    // Create parameters for the job
    const params = new ExportPDFToImagesParams({
      targetFormat: ExportPDFToImagesTargetFormat.JPEG,
      outputType: ExportPDFToImagesOutputType.ZIP_OF_PAGE_IMAGES,
    });

    // Creates a new job instance
    const job = new ExportPDFToImagesJob({ inputAsset, params });

    // Submit the job and get the job result
    const pollingURL = await pdfServices.submit({ job });
    const pdfServicesResponse = await pdfServices.getJobResult({
      pollingURL,
      resultType: ExportPDFToImagesResult,
    });

    // Get content from the resulting asset(s)
    const resultAsset = pdfServicesResponse.result.assets;
    const streamAsset = await pdfServices.getContent({ asset: resultAsset[0] });

    return streamAsset.readStream;

    // Creates an output stream and copy stream asset's content to it
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
  const filePath = "output/ExportPDFToJPEGZip/";
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
  return `${filePath}export${dateString}.zip`;
}

export default pdfToImage;
