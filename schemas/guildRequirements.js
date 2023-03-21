const { Schema, model } = require("mongoose");

const regSchema = new Schema({
    guildID: { type: String, default: "" },


    // Register Kısmı
    tag: { type: String, default: "" },
    regStaffRole: { type: Array, default: [] },
    menRole: { type: Array, default: [] },
    womenRole: { type: Array, default: [] },
    unregRole: { type: String, default: "" },
    boosterRole: { type: String, default: "" },
    vipRole: { type: String, default: "" }
});

module.exports = model("guildRequirements", regSchema);