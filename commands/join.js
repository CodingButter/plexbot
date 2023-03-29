const { SlashCommandBuilder, ChannelType, VoiceChannel } = require("discord.js")
const { joinVoiceChannel, getVoiceConnections } = require("@discordjs/voice")
module.exports = {
  data: new SlashCommandBuilder()
    .setName("join_channel")
    .setDescription("Joins a Channel")
    .addChannelOption((option) => {
      return option
        .setName("channel")
        .setDescription("The channel to join")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildVoice)
    }),
  async execute(interaction) {
    await interaction.reply("Joining Channel")
    const voiceConnection = joinVoiceChannel({
      channelId: interaction.options.getChannel("channel").id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
      selfDeaf: false,
    })
    console.log(getVoiceConnections())
  },
}
