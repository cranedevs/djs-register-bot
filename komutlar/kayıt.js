const { 
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    StringSelectMenuBuilder,
    PermissionFlagsBits
} = require("discord.js");

const registerStaffSchema = require("../schemas/registerStaffSchemachema")
const registerMemberSchema = require("../schemas/registeredMemberSchema")
const guildRequirements = require("../schemas/guildRequirements")

exports.run = async (client, message, args) => {

    const req = await guildRequirements.findOne({ guildID: message.guild.id });

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    args = args.filter(a => a !== "" && a !== " ").splice(1);
    const name = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");;
    const age = args.filter(arg => !isNaN(arg))[0] || "";
    let lastName;

    if(!req) return message.channel.send({ content: `Database ayarlanmamış! Lütfen geliştirici ile iletişime geçin.` });
    if(req && !req.regStaffRole) return message.channel.send({ content: `Register Yetkili Rolü ayarlanmamış! Lütfen geliştirici ile iletişime geçin.` }); 
    if(req && !req.menRole) return message.channel.send({ content: `Erkek Rolü ayarlanmamış! Lütfen geliştirici ile iletişime geçin.` }); 
    if(req && !req.womenRole) return message.channel.send({ content: `Kadın Rolü ayarlanmamış! Lütfen geliştirici ile iletişime geçin.` }); 
    if(req && !req.unregRole) return message.channel.send({ content: `Unregister Rolü ayarlanmamış! Lütfen geliştirici ile iletişime geçin.` }); 
    if(req && !req.tag) return message.channel.send({ content: `Tag ayarlanmamış! Lütfen geliştirici ile iletişime geçin.` }); 

    if(!req.regStaffRole.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(PermissionFlagsBits.Administrator)) return message.channel.send({ content: `Yeterli yetkiniz yok.` });
    if(!member) return message.channel.send({ content: `Bir üye belirtmelisiniz!` });
    if(!name) return message.channel.send({ content: `Bir isim belitmelisiniz!` });
    if(!age) lastName = `${req.tag ? req.tag : "CRN"} ${name}`
    else lastName = `${req.tag ? req.tag : "CRN"} ${name} \` ${age}`
    
    if(isTaggedOpen) {
        if(req && req.tag.some(x => !member.user.username.includes(x)) && !member.roles.cache.has(req.boosterRole) && !member.roles.cache.has(req.vipRole)) return message.channel.send({ content: `**Şu anda taglı alımdayız. Kayıt olabilmek için tag alabilir, sunucuya boost basabilirsiniz. VIP üye kaydı için \`.vip\` komutunu kullanınız**` });
    }

    member.setNickname(`${lastName}`).catch(x => {message.channel.send(`Bir hata oluştu.`); console.log(x)});

    const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setCustomId("MEN")
        .setLabel("Erkek")
        .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
        .setCustomId("WOMEN")
        .setLabel("Kadın")
        .setStyle(ButtonStyle.Danger)
    )

    const disabledRow = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setCustomId("REG_SUCCESS")
        .setLabel("Kayıt Tamamlandı!")
        .setStyle(ButtonStyle.Success)
        .setDisabled(true)
    )

    const emb = new EmbedBuilder()
    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
    .setDescription(`**${member} üyemizin adını başarıyla ${lastName} ayarladım!\n Lütfen 30 saniye içerisinde cinsiyeti belirtiniz.\n\n Üyeyi kaydetmeden önce üyenin önceki isimlerine bakmanız önerilir.**`)
    .setFooter({ text: ` Developed By Crané?` });

    let msg = await message.channel.send({ embeds: [emb], components: [row] })
    const filter = button => button.member.id === message.author.id;
    const collector = msg.createMessageComponentCollector({ filter: filter, time: 30000 });

    const embMen = new EmbedBuilder()
    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
    .setDescription(`**${member} üyemiz başarıyla ERKEK olarak kaydedildi.**`)
    .setFooter({ text: ` Developed By Crané?` });

    const embWomen = new EmbedBuilder()
    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
    .setDescription(`**${member} üyemiz başarıyla KADIN olarak kaydedildi.**`)
    .setFooter({ text: `Developed By Crané?` });

    collector.on("collect", async crane => {
        if(crane.customId === "MEN") {
            await member.roles.remove(req.unregRole);
            for (let i=0;i<req.menRole.length;i++) {
                member.roles.add(req.menRole[i]);
            }
            await registerMemberSchema.findOneAndUpdate({ guildID: message.guild.id, memberID: member.id }, { $set: { staffID: message.author.id }, $push: { memberInfo: { name: lastName, role: req.menRole.map(x => `<@&${x}>`), date: Date.now() } } })
            await registerStaffSchema.findOneAndUpdate({ guildID: message.guild.id, memberID: message.author.id }, { $inc: { totalRegCount: 1, registeredMenCount: 1 }});
            message.channel.send({ embeds: [embMan] })
        }
        if(crane.customId === "WOMEN") {
            await member.roles.remove(req.unregRole);
            for (let i=0;i<req.womenRole.length;i++) {
                member.roles.add(req.womenRole[i]);
            }
            await registerMemberSchema.findOneAndUpdate({ guildID: message.guild.id, memberID: member.id }, { $set: { staffID: message.author.id }, $push: { memberInfo: { name: lastName, role: req.womenRole.map(x => `<@&${x}>`), date: Date.now() } } })
            await registerStaffSchema.findOneAndUpdate({ guildID: message.guild.id, memberID: message.author.id }, { $inc: { totalRegCount: 1, registeredWomenCount: 1 }});
            message.channel.send({ embeds: [embWoman] })
        }
    });

    collector.on("end", async () => {
        if(msg) msg.delete();
    });
};
exports.conf = {
  aliases: ["k", "e", "kadın", "kız", "erkek", "bayan", "bay", "mr", "mrs"]
};

exports.help = {
  name: "kayıt"
};
