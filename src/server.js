import express from "express";
import { PORT } from "./serverConfig/config.js";
import clientResponse from "./discord/discord.js";
import commandRegister from "./discord/command.js";
import bodyParser from "body-parser";
import axios from "axios";
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

Promise.all([clientResponse()]);

// const response = await axios.get(
//   "https://cdn.discordapp.com/attachments/1209182026452963383/1238945149577334904/gyanaranjan-resume-PvkBX5h-_2.pdf?ex=66412116&is=663fcf96&hm=e9efc3de57fd71242551b011ebcf1344168fc435883ee9f0cc7f720829096632&",
//   { responseType: "stream" }
// );
// const data = response.data;
// console.log(data);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
