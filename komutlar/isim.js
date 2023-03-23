const { EmbedBuilder } = require("discord.js");
const guildRequirements = require("../schemas/guildRequirements");
const registeredMemberSchema = require("../schemas/registeredMemberSchema");

exports.run = async (client, message, args) => {

    const req = await guildRequirements.findOne({ guildID: message.guild.id });

    const member = message.mentions.members.first() || message.guild.members.cach.get(args[0]);
    args = args.filter(a => a !== "" && a !== " ").splice(1);
    const name = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");;
    const age = args.filter(arg => !isNaN(arg))[0] || "";
    let lastName;

    if(!req) return message.channel.send({ content: `Database ayarlanmamış! Lütfen geliştirici ile iletişime geçin.` });
    if(req && !req.regStaffRole) return message.channel.send({ content: `Register Yetkili Rolü ayarlanmamış! Lütfen geliştirici ile iletişime geçin.` }); 
    if(req && !req.tag) return message.channel.send({ content: `Tag ayarlanmamış! Lütfen geliştirici ile iletişime geçin.` }); 

    if(!req.regStaffRole.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(PermissionFlagsBits.Administrator)) return message.channel.send({ content: `Yeterli yetkiniz yok.` });
    if(!member) return message.channel.send({ content: `Bir üye belirtmelisiniz!` });
    if(!name) return message.channel.send({ content: `Bir isim belitmelisiniz!` });
    if(!age) lastName = `${req.tag ? req.tag : "CRN"} ${name}`
    else lastName = `${req.tag ? req.tag : "CRN"} ${name} \` ${age}`
    
    
    await registeredMemberSchema.findOneAndUpdate({ guildID: message.guild.id, memberID: member.id }, { $set: { staffID: message.author.id }, $push: { memberInfo: { name: lastName, role: "ISIM_DEGISTIRME", date: Date.now() } } })
    member.setNickname(`${lastName}`).then(x => {
        message.channel.send({ content: `${member} üyemizin ismini başarıyla değiştirdim!` });
    }).catch(err => { message.channel.send({ content: `Üyenin ismi çok uzun.` }); throw err; });
};
exports.conf = {
  aliases: []
};

exports.help = {
  name: "isim"
};
