const { EmbedBuilder } = require("discord.js");
const guildRequirements = require("../schemas/guildRequirements");


exports.run = async (client, message, args) => {

    const selection = args[0];
    const req = await guildRequirements.findOne({ guildID: message.guild.id });

    if(!selection) {
        const craneEmbed = new EmbedBuilder()
        .setAuthor({ name: message.guild.name+" Setup" })
        .setDescription(`Ayarla komutları`)
        .setFooter({ text: `Developed by Crané` });

        message.channel.send({ embeds: [craneEmbed] })
    }

    if(["tag", "tags"].some(x => selection === x)) {
        args = args.filter(a => a !== "" && a !== " ").splice(1);
        if(!args[1]) return message.react("❌");
        await guildRequirements.findOneAndpdate({ guildID: message.guild.id }, {
            $set: {
                tag: args[1]
            }
        });
    }

    if(["unreg", "kayıtsız"].some(x => selection === x)) {
        const role = message.mentions.roles.first();
        if(!role) return message.react("❌");
        await guildRequirements.findOneAndpdate({ guildID: message.guild.id }, {
            $set: {
                unregRole: role.id
            }
        });
    }

    if(["vip", "vipRole"].some(x => selection === x)) {
        const role = message.mentions.roles.first();
        if(!role) return message.react("❌");
        await guildRequirements.findOneAndpdate({ guildID: message.guild.id }, {
            $set: {
                vipRole: role.id
            }
        });
    }

    if(["booster", "boosterRole"].some(x => selection === x)) {
        const role = message.mentions.roles.first();
        if(!role) return message.react("❌");
        await guildRequirements.findOneAndpdate({ guildID: message.guild.id }, {
            $set: {
                boosterRole: role.id
            }
        });
    }

    if(["men", "menRole", "erkek", "erkekRol"].some(x => selection === x)) {
        let roleRow = []
        const role = message.mentions.roles.cache.forEach(role => {
            roleRow.push(role.id)
        });
        if(roleRow.length === 0) return message.react("❌");
        for (let i=0;i<roleRow.length;i++) {
            await guildRequirements.findOneAndpdate({ guildID: message.guild.id }, {
                $set: {
                    menRole: roleRow[i]
                }
            });
        }
    }

    if(["women", "womenRole", "kadın", "kadınRol"].some(x => selection === x)) {
        let roleRow = []
        const role = message.mentions.roles.cache.forEach(role => {
            roleRow.push(role.id)
        });
        if(roleRow.length === 0) return message.react("❌");
        for (let i=0;i<roleRow.length;i++) {
            await guildRequirements.findOneAndpdate({ guildID: message.guild.id }, {
                $set: {
                    womenRole: roleRow[i]
                }
            });
        }
    }

    if(["register", "regStaff", "kayıtçı", "kayıtçıRol"].some(x => selection === x)) {
        let roleRow = []
        const role = message.mentions.roles.cache.forEach(role => {
            roleRow.push(role.id)
        });
        if(roleRow.length === 0) return message.react("❌");
        for (let i=0;i<roleRow.length;i++) {
            await guildRequirements.findOneAndpdate({ guildID: message.guild.id }, {
                $set: {
                    regStaffRole: roleRow[i]
                }
            });
        }
    }
};
exports.conf = {
  aliases: []
};

exports.help = {
  name: "ayarla"
};
