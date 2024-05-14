import {
  ServicePrincipalCredentials,
  PDFServices,
  MimeType,
  ProtectPDFParams,
  EncryptionAlgorithm,
  ProtectPDFJob,
  ProtectPDFResult,
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
 * This sample illustrates how to convert a PDF file into a password protected PDF file
 * The password is used for encrypting PDF contents and will be required for viewing the PDF file
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */
const pdfProtect = async (pdfUrl, password) => {
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

    // readStream = createReadStream("resources/protectPDFInput.pdf");
    const inputAsset = await pdfServices.upload({
      readStream,
      mimeType: MimeType.PDF,
    });

    // Create parameters for the job
    const params = new ProtectPDFParams({
      userPassword: password,
      encryptionAlgorithm: EncryptionAlgorithm.AES_256,
    });

    // Create a new job instance
    const job = new ProtectPDFJob({ inputAsset, params });

    // Submit the job and get the job result
    const pollingURL = await pdfServices.submit({ job });
    const pdfServicesResponse = await pdfServices.getJobResult({
      pollingURL,
      resultType: ProtectPDFResult,
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
    readStream?.destroy();
  }
};

export default pdfProtect;
