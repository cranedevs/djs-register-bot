const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const guildRequirements = require("../schemas/guildRequirements");
const registeredMemberSchema = require("../schemas/registeredMemberSchema");


exports.run = async (client, message, args) => {

    const req = await guildRequirements.findOne({ guildID: message.guild.id });

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    let memberInfoList = [];

    if(!req) return message.channel.send({ content: `Database ayarlanmamış! Lütfen geliştirici ile iletişime geçiniz.` });
    if(req && !req.regStaffRole) return message.channel.send({ content: `Register Yetkili Rolü ayarlanmamış! Lütfen geliştirici ile iletişime geçiniz.` });
    
    
    if(!req.regStaffRole.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(PermissionFlagsBits.Administrator)) return message.channel.send({ content: `Yeterli yetkiniz bulunmamakta.` });
    if(!member) return message.channel.send({ content: `Bir üye etiketlemelisiniz!` });

    const data = await registeredMemberSchema.findOne({ guildID: message.guild.id });

    if(data && !data.memberInfo) return message.channel.send({ content: `Üyenin isim geçmişi bulunmamakta!` });

    for (let i=0;i<5;i++) {
        memberInfoList.push(data.memberInfo[i]);
    }

    const cranEmbed = new EmbedBuilder()
    .setAuthor({ content: member.user.username, iconURL: member.user.avatarURL({ dynamic: true })})
    .setDescription(`${member} adlı üyenin kaydedilen son 5 ismi aşağıda belirtilmiştir. \n\n ${memberInfo.map(x => `${x.name} | ${x.role.map(x => `<@&${x}> | ${Math.floor(x.date / 1000)}`)}`)}`)
    .setFooter({ text: `Developed by Crané?` });

    message.channel.send({ embeds: [cranEmbed] });
};
exports.conf = {
  aliases: []
};

exports.help = {
  name: "isimler"
};
