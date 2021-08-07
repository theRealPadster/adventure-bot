# Discord bot to play a text-based adventure game
This choose your own adventure game is based on the sms-based one I wrote here: https://github.com/theRealPadster/buildyourownadventurebot.

## .env setup
```
CLIENT_TOKEN="yourtoken"
```

## Playing the game
To start the game, just mention the bot. To continue playing, mention the bot and then type your command.
e.g. `@AdventureBot status` or `@AdventureBot enter kitchen`

## Development
Run TypeScript watch task and use nodemon to apply changes in real time.
1. `yarn watch`
2. `yarn dev`
