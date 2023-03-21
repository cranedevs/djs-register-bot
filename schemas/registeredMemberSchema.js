const { Schema, model } = require("mongoose");

const regSchema = new Schema({
    guildID: { type: String, default: "" },
    staffID: { type: String, default: "" },
    memberID: { type: String, default: "" },
    memberInfo: { type: Array, default: [] },
    date: { type: Number, default: Date.now() }
});

module.exports = model("regMemberSchema", regSchema);