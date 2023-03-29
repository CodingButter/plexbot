require("dotenv").config()
const fs = require("fs")
const { Client, Events, GatewayIntentBits, Collection, REST, Routes } = require("discord.js")
const path = require("path")
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
})
require("./startplex")

client.commands = new Collection()
const commands = []

const commandsPath = path.join(__dirname, "commands")
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"))

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file)
  const command = require(filePath)

  if ("data" in command && "execute" in command) {
    commands.push(command.data.toJSON())
    client.commands.set(command.data.name, command)
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing either the 'data' or 'execute' property.`
    )
  }
}

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_ID)
;(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`)

    const data = await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    )
    console.log(`Successfully reloaded ${data.length} application (/) commands.`)
  } catch (error) {
    console.error(error)
  }
})()

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) return
  const command = interaction.client.commands.get(interaction.commandName)
  if (!command) {
    console.error(`No command matching ${interaction.commandName} found.`)
    return
  }
  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      })
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      })
    }
  }
})

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.login(process.env.DISCORD_BOT_ID)
