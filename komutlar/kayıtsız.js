const { EmbedBuilder } = require("discord.js");
const guildRequirements = require("../schemas/guildRequirements");
const registeredMemberSchema = require("../schemas/registeredMemberSchema");

exports.run = async (client, message, args) => {

    const req = await guildRequirements.findOne({ guildID: message.guild.id });

    const member = message.mentions.members.first() || message.guild.members.cach.get(args[0]);
    args = args.filter(a => a !== "" && a !== " ").splice(1);

    if(!req) return message.channel.send({ content: `Database ayarlanmamış! Lütfen geliştirici ile iletişime geçin.` });
    if(req && !req.regStaffRole) return message.channel.send({ content: `Register Yetkili Rolü ayarlanmamış! Lütfen geliştirici ile iletişime geçin.` }); 
    if(req && !req.unregRole) return message.channel.send({ content: `Unregister Rolü ayarlanmamış! Lütfen geliştirici ile iletişime geçin.` }); 
    if(req && !req.tag) return message.channel.send({ content: `Tag ayarlanmamış! Lütfen geliştirici ile iletişime geçin.` }); 

    if(!req.regStaffRole.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(PermissionFlagsBits.Administrator)) return message.channel.send({ content: `Yeterli yetkiniz yok.` });
    if(!member) return message.channel.send({ content: `Bir üye belirtmelisiniz!` });
    
    const cranEmbed = new EmbedBuilder()
    .setAuthor({ name: member.user.username, iconURL: member.user.avatarURL({ dynamic: true }) })
    .setDescription(`${member} üyemizi başarıyla kayıtsıza attım!`)
    .setFooter({ text: `Developed by Crané?` });

    // member.roles.set([]) kullanılabilir.
    member._roles.forEach(role => {
        member.roles.remove(role);
    });
    member.roles.add(req.unregRole);
    member.setNickname(`${member.user.username.includes(req.tag) ? req.tag : "CRN"} İsim \` Yaş`).then(x => {
        message.channel.send({ embeds: [cranEmbed] })
    }).catch(err => { message.channel.send({ content: `Üyenin ismi çok uzun.` }); throw err; });
};
exports.conf = {
  aliases: []
};

exports.help = {
  name: "kayıtsız"
};
