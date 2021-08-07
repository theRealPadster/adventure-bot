import dotenv from 'dotenv';
dotenv.config();

import Discord from 'discord.js';

import AdventureGame from './lib/adventure';
const adventureGame = new AdventureGame();

const client = new Discord.Client();

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {

  const BOT_ID = client.user.id;
  // If user didn't mention the bot, ignore
  if (!msg.mentions.users.get(BOT_ID) || msg.author.bot) return;

  // const command = msg.content.slice(`<@!${BOT_ID}>`.length);
  const command = msg.content.replace(`<@!${BOT_ID}>`,'').trim();
  console.log(command);

  // const args = msg.content.slice(`<@!${BOT_ID}>`.length).trim().split(' ');
	// const command = args.shift().toLowerCase();
  // console.log(command, args, msg.content);

  const response = adventureGame.go(msg.author.id, command);
  msg.channel.send(`${msg.author}: ${response}`);
});

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN);
