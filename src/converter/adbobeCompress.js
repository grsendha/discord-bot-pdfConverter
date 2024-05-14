import {
  ServicePrincipalCredentials,
  PDFServices,
  MimeType,
  CompressPDFJob,
  CompressPDFParams,
  CompressionLevel,
  CompressPDFResult,
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
 * This sample illustrates how to compress PDF by reducing the size of the PDF file
 * on the basis of provided compression level.
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */
const pdfCompressor = async (pdfUrl) => {
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

    // readStream = createReadStream("resources/compressPDFInput.pdf");
    const inputAsset = await pdfServices.upload({
      readStream,
      mimeType: MimeType.PDF,
    });

    // Set the compression level
    const params = new CompressPDFParams({
      compressionLevel: CompressionLevel.HIGH,
    });

    // Creates a new job instance
    const job = new CompressPDFJob({ inputAsset, params });

    // Submit the job and get the job result
    const pollingURL = await pdfServices.submit({ job });
    const pdfServicesResponse = await pdfServices.getJobResult({
      pollingURL,
      resultType: CompressPDFResult,
    });

    // Get content from the resulting asset(s)
    const resultAsset = pdfServicesResponse.result.asset;
    const streamAsset = await pdfServices.getContent({ asset: resultAsset });

    return streamAsset.readStream;
  } catch (err) {
    if (err._errCode == "PDF_ALREADY_COMPRESSED") {
      return "PDF already compressed";
    }
    if (
      err instanceof SDKError ||
      err instanceof ServiceUsageError ||
      err instanceof ServiceApiError
    ) {
      throw new Error(err);
    } else {
      throw new Error(err);
    }
  } finally {
    readStream?.destroy();
  }
};

export default pdfCompressor;

// Generates a string containing a directory structure and file name for the output file
