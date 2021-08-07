import dotenv from 'dotenv';
dotenv.config();

import Discord from 'discord.js';
import { getComplimentOrInsult, checkAndReactToGifs, handleAdventure } from './lib/commands';

const client = new Discord.Client();

const PREFIX = '/';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {

  // Sends reply in function, returns true if sent
  if (checkAndReactToGifs(msg)) return;

  // Abort if message is not a command for the bot
  if (!msg.content.startsWith(PREFIX) || msg.author.bot) return;

  const args = msg.content.slice(PREFIX.length).trim().split(' ');
	const command = args.shift().toLowerCase();

  // /hello
  if (command === 'hello') {
    try {
      await msg.react('👋');
      await msg.channel.send(`Hello ${msg.author}! :)`);
      // await msg.reply(`Hello @${msg.author.username}! :)`);

    } catch (error) {
      console.error('Something broke:', error)
    }
  } // /compliment
  else if (command === 'compliment') {
    // Use mentioned user or the author if none
    const user = msg.mentions.users.first() || msg.author;
    const response = getComplimentOrInsult(user);
    msg.channel.send(response);
  }	// /args-info
  else if (command === 'args-info') {
		if (!args.length) {
			return msg.channel.send(`You didn't provide any arguments, ${msg.author}!`);
		}

		msg.channel.send(`Command name: ${command}\nArguments: ${args}`);
	} // choose your own adventure game
  else if (command === 'g') {
    const response = handleAdventure(msg.author, msg.content);
    msg.channel.send(`${msg.author}: ${response}`);
  }
});

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN);
