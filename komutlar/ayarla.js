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

    if(["tagged", "taglıalım"].some(x => selection === x)) {
        args = args.filter(a => a !== "" && a !== " ").splice(1);
        if(!args[0]) return message.react("❌");
        if(args[0] === "aç") {
            await guildRequirements.findOneAndUpdate({ guildID: message.guild.id }, {
                $set: {
                    isTaggedOpen: true
                }
            }, { upsert: true }).then(async x => {
                const controle = await guildRequirements.findOne({ guildID: message.guild.id });
                console.log(controle.isTaggedOpen)
                message.channel.send({ content: `Taglı Alım başarıyla ${controle.isTaggedOpen ? `Açık` : `Kapalı`} olarak kaydedildi!` });
            })
        } else if(args[0] === "kapat") {
            await guildRequirements.findOneAndUpdate({ guildID: message.guild.id }, {
                $set: {
                    isTaggedOpen: false
                }
            }, { upsert: true }).then(async x => {
                const controle = await guildRequirements.findOne({ guildID: message.guild.id });
                message.channel.send({ content: `Taglı Alım başarıyla ${controle.isTaggedOpen ? `Açık` : `Kapalı`} olarak kaydedildi!` });
            })
        }
    }

    if(["tag", "tags"].some(x => selection === x)) {
        args = args.filter(a => a !== "" && a !== " ").splice(1);
        if(!args[0]) return message.react("❌");
        await guildRequirements.findOneAndUpdate({ guildID: message.guild.id }, {
            $set: {
                tag: args[0]
            }
        }, { upsert: true }).then(x => {
            message.channel.send({ content: `Tag başarıyla ${args[0]} olarak kaydedildi!` });
        })
    }

    if(["unreg", "kayıtsız"].some(x => selection === x)) {
        const role = message.mentions.roles.first();
        if(!role) return message.react("❌");
        await guildRequirements.findOneAndUpdate({ guildID: message.guild.id }, {
            $set: {
                unregRole: role.id
            }
        }, { upsert: true }).then(x => {
            message.channel.send({ content: `Kayıtsız başarıyla ${role} olarak kaydedildi!` });
        })
    }

    if(["vip", "vipRole"].some(x => selection === x)) {
        const role = message.mentions.roles.first();
        if(!role) return message.react("❌");
        await guildRequirements.findOneAndUpdate({ guildID: message.guild.id }, {
            $set: {
                vipRole: role.id
            }
        }, { upsert: true }).then(x => {
            message.channel.send({ content: `VIP başarıyla ${role} olarak kaydedildi!` });
        })
    }

    if(["booster", "boosterRole"].some(x => selection === x)) {
        const role = message.mentions.roles.first();
        if(!role) return message.react("❌");
        await guildRequirements.findOneAndUpdate({ guildID: message.guild.id }, {
            $set: {
                boosterRole: role.id
            }
        }, { upsert: true }).then(x => {
            message.channel.send({ content: `Booster başarıyla ${role} olarak kaydedildi!` });
        })
    }

    if(["men", "menRole", "erkek", "erkekRol"].some(x => selection === x)) {
        let roleRow = []
        const role = message.mentions.roles.forEach(role => {
            roleRow.push(role.id)
        });
        if(roleRow.length === 0) return message.react("❌");
        for (let i=0;i<roleRow.length;i++) {
            await guildRequirements.findOneAndUpdate({ guildID: message.guild.id }, {
                $push: {
                    menRole: roleRow[i]
                }
            }, { upsert: true });
        }
        message.channel.send({ content: `Men Role başarıyla ${roleRow.length > 1 ? roleRow.map(x => `<@&${x}>`) : `<@&${roleRow[0]}>`} olarak kaydedildi!` });
    }

    if(["women", "womenRole", "kadın", "kadınRol"].some(x => selection === x)) {
        let roleRow = []
        const role = message.mentions.roles.forEach(role => {
            roleRow.push(role.id)
        });
        if(roleRow.length === 0) return message.react("❌");
        for (let i=0;i<roleRow.length;i++) {
            await guildRequirements.findOneAndUpdate({ guildID: message.guild.id }, {
                $push: {
                    womenRole: roleRow[i]
                }
            }, { upsert: true });
        }
        message.channel.send({ content: `Women Role başarıyla ${roleRow.length > 1 ? roleRow.map(x => `<@&${x}>`) : `<@&${roleRow[0]}>`} olarak kaydedildi!` });
    }

    if(["register", "regStaff", "kayıtçı", "kayıtçıRol"].some(x => selection === x)) {
        let roleRow = []
        const role = message.mentions.roles.forEach(role => {
            roleRow.push(role.id)
        });
        if(roleRow.length === 0) return message.react("❌");
        for (let i=0;i<roleRow.length;i++) {
            await guildRequirements.findOneAndUpdate({ guildID: message.guild.id }, {
                $push: {
                    regStaffRole: roleRow[i]
                }
            }, { upsert: true });
        }
        message.channel.send({ content: `Register Staff Role başarıyla ${roleRow.length > 1 ? roleRow.map(x => `<@&${x}>`) : `<@&${roleRow[0]}>`} olarak kaydedildi!` });
    }
};
exports.conf = {
  aliases: []
};

exports.help = {
  name: "ayarla"
};
