import {
  ServicePrincipalCredentials,
  PDFServices,
  MimeType,
  CombinePDFJob,
  CombinePDFParams,
  CombinePDFResult,
  SDKError,
  ServiceUsageError,
  ServiceApiError,
} from "@adobe/pdfservices-node-sdk";
import { createReadStream, createWriteStream } from "fs";
import {
  ADOBE_SERVICES_CLIENT_ID,
  ADOBE_SERVICES_CLIENT_SECRET,
} from "../serverConfig/config.js";
import axios from "axios";

/**
 * This sample illustrates how to combine multiple PDF files into a single PDF file.
 * <p>
 * Note that the SDK supports combining upto 20 files in one operation.
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */
const pdfCombine = async (inputFiles) => {
  let readStreams = []; // Array to store read streams for input files
  try {
    // Initial setup, create credentials instance
    const credentials = new ServicePrincipalCredentials({
      clientId: ADOBE_SERVICES_CLIENT_ID,
      clientSecret: ADOBE_SERVICES_CLIENT_SECRET,
    });

    // Creates a PDF Services instance
    const pdfServices = new PDFServices({ credentials });

    // Create read streams for each input file
    for (const file of inputFiles) {
      const response = await axios.get(file, { responseType: "stream" });
      readStreams.push(response.data);
      // readStreams.push(createReadStream(file));
    }

    // Upload assets from read streams
    const inputAssets = await Promise.all(
      readStreams.map(async (readStream) => {
        const asset = await pdfServices.uploadAssets({
          streamAssets: [
            {
              readStream,
              mimeType: MimeType.PDF,
            },
          ],
        });
        return asset[0];
      })
    );

    // Create parameters for the job
    const params = new CombinePDFParams();
    inputAssets.forEach((asset) => {
      params.addAsset(asset);
    });

    // Create a new job instance
    const job = new CombinePDFJob({ params });

    // Submit the job and get the job result
    const pollingURL = await pdfServices.submit({ job });
    const pdfServicesResponse = await pdfServices.getJobResult({
      pollingURL,
      resultType: CombinePDFResult,
    });

    // Get content from the resulting asset(s)
    const resultAsset = pdfServicesResponse.result.asset;
    const streamAsset = await pdfServices.getContent({ asset: resultAsset });

    return streamAsset.readStream;
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
    // Destroy all read streams
    readStreams.forEach((stream) => {
      stream.destroy();
    });
  }
};

export default pdfCombine;
