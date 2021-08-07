// TODO: can I just grab the types?
import Discord from 'discord.js';

export const fillInName = (str: string, author: Discord.User) => {
  return str.replace('$1', `<@${author.id}>`);
};

export const getRandomArrayItem = (arr: any[]) => {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
};
