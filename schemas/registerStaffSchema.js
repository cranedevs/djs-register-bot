const { Schema, model } = require("mongoose");

const regSchema = new Schema({
    guildID: { type: String, default: "" },
    staffID: { type: String, default: "" },
    totalRegCount: { type: Number, default: 0 },
    registeredMenCount: { type: Number, default: 0 },
    registeredWomenCount: { type: Number, default: 0 },
});

module.exports = model("regStaffSchema", regSchema);