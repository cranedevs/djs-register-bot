const { Client, Message, MessageEmbed, Collection } = require("discord.js");
const fs = require("fs");
const config = require("./config.json");
const prefix = config.prefix;
const token = config.token;
const mongoose = require("mongoose");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction
  ]
});

module.exports = client;

/*
 * require("./events/message.js")  
 * require("./events/ready.js")
*/


// Komut handler bu. 
client.commands = new Collection();
client.aliases = new Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  console.log(`Toplamda ${files.length} Komut Var!`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    console.log(`${props.help.name} İsimli Komut Aktif!`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

fs.readdir("./events/", (err, files) => {
  if (err) console.error(err);
  files.forEach(f => {
    require(`./events/${f}`);
  });
  console.log(`Bütün Event'ler Aktif!`);
});

mongoose.connect(config.mongoURL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(x => console.log("Mongo DB bağlantısı başarılı"));

// Mongo connect bağlantısı.

client.login(token);
