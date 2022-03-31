const { MessageEmbed, Client } = require("discord.js");
const db = require("quick.db")

module.exports = {
   name: "setcolor",
    aliases: ["setbotcolor"],
    description: "Change bot embeds color",
    category: "Informations",
   run: async (client, message, args, color) => {
const superagent = require("superagent");

 let lang = db.get(`lang_${message.author.id}`);
  if(lang === null) lang = "auto";


if(!args[0] || args[0].length > 7) {
  return message.channel.send(`${message.author.username} provide me hex color , you want to use in embeds!`)
}
if(args[0].length === 7) {
  if (message.content.includes('#')) {
               db.set(`color_${message.author.id}`, args[0])

 return message.channel.send(`${message.author.username} Now all the embeds color will be ${args[0]}`)
            }
            else {
              return message.channel.send(`${message.author.username} provide me valid hex color`)
            }
} else {
  return message.channel.send(`${message.author.username} provide me valid hex color`)
}


  }}