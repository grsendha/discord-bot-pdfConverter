import { REST, Routes } from "discord.js";
import { DISCORD_BOT_TOKEN, CLIENT_ID } from "../serverConfig/config.js";

const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
];

const rest = new REST({ version: "10" }).setToken(DISCORD_BOT_TOKEN);

const commandRegister = async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
};

export default commandRegister;
