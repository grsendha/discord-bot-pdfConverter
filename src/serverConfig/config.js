import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT;
export const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
export const CLIENT_ID = process.env.CLIENT_ID;
export const ADOBE_SERVICES_CLIENT_ID = process.env.ADOBE_SERVICES_CLIENT_ID;
export const ADOBE_SERVICES_CLIENT_SECRET =
  process.env.ADOBE_SERVICES_CLIENT_SECRET;
