const TOO_SLOW_YOU_DIE = 'Eeuuarrggghhfsefgggssss! You\'re just a wee bit too slow, and the monster claws your face off. You bleed out on the ground as it feasts upon your flesh. ';
const IN_THE_HALL = 'You\'re in the main hall. It\'s also dark and dusty. You head down the hall and hear a long shrill wail. There is a kitchen to your left, a bedroom to your right, a living room, and a long dark staircase downwards. Which do you choose?';
const ENTER_BEDROOM = 'The bedroom is gross. There\'s a pizza box with some fuzzy growth inside it and moth-eaten clothes strewn across the floor. And a dead rat in the corner. Look at the pizza, clothes, or the rat?';

//TODO - implement bleeding
//TODO - implement more candle stuff

export default class AdventureGame {
    defaultState: any;
    connections: any;
    rooms: any;

    constructor() {
        this.defaultState = {
            room: 'outside',
            bleedingStatus: 0,
            hasRat: false,
            hasMushroom: false,
            hasSlime: false,
            hasAxe: false,
            hasCandle: false,
            hasRecipe: false,
            isInvincible: false,
            gameOver: false,
            msg: '',
        };

        // TODO: better room handling
        // (If I store a reference to the function,
        // then when I call it, 'this' is the state, not the connections object)
        this.rooms = {
            'outside': this.fOutside,
            'bedRoom': this.fBedRoom,
            'hallEnd': this.fHallEnd,
            'livingRoom': this.fLivingRoom,
            'endGame': this.fEndGame,
        };

        this.connections = {}; //new Map();
    }

    go(userId: string, action: string) {
        console.log(`hit, userId: ${userId}`);

        if (!this.connections[userId] || this.connections[userId].gameOver) {
            console.log('resetting game');
            this.resetGame(userId);
        }

        let response = '';

        if (action.toLowerCase().search('status') != -1) {
            response = 'You have: \n';
            if (this.connections[userId].hasCandle) {
                response += '- a candle\n';
            }
            if (this.connections[userId].hasRat) {
                response += '- a dead rat\n';
            }
            if (this.connections[userId].hasSlime) {
                response += '- some nasty slime\n';
            }
            if (this.connections[userId].hasMushroom) {
                response += '- a moldy mushroom\n';
            }
            if (this.connections[userId].hasAxe) {
                response += '- an axe\n';
            }
            if (this.connections[userId].hasRecipe) {
                response += '- a potion recipe memorised (rat skull, mushroom, slime)\n';
            }
            response += '- a deep fear twisting in your gut\n';
            if (this.connections[userId].bleedingStatus > 0) {
                response += '...oh, and you\'re bleeding\n';
            }

            response += 'Now just resume where you left off...\n';
            response += this.connections[userId].msg;
        } else {
            // Get fn for which room they are in
            const roomFn = this.rooms[this.connections[userId].room];
            // Run action for room etc
            const newUserState = roomFn(this.connections[userId], action);
            // Persist change
            this.connections[userId] = newUserState;
            response = newUserState.msg;
        }

        return response;
    }

    resetGame(userId: string) {
        this.connections[userId] = JSON.parse(JSON.stringify(this.defaultState));
        this.connections[userId].room = 'outside';
    }

    fEndGame(userState, action) {
        let msg = '';

        if (action.toLowerCase().search(/drink|potion/) != -1) {
            msg += 'The potion tastes fowl, but you feel the strength of a thousand men flow through your veins and know that right now, you are invincible. ';
            userState.isInvincible = true;
            msg += userState.hasAxe ? 'Take out the axe ' : 'Stay ';
            msg += 'and fight, or run like a coward?';
        }
        else if (action.toLowerCase().search(/axe|fight/) != -1) {
            msg += 'You drop the bowl to the floor with a clatter and ';
            if (userState.hasAxe) {
                msg += 'pull out the axe. The beast rounds the corner as you raise the axe above your head for a strike. ';
            }
            else {
                msg += 'realise you really should have taken that axe. ';
            }

            if (userState.isInvincible && userState.hasAxe) {
                msg += 'Gaahrhgfushgsg!! It howls as you cleave its head in two. ';
                msg += 'Now, feeling weak, as though the effort has sapped your strength, you head back outside. ';
                msg += 'You have defeated the monster. You win. Now go have a nap. ';
                userState.gameOver = true;
            }
            else {
                msg += TOO_SLOW_YOU_DIE;
                userState.gameOver = true;
            }
        }
        else if (action.toLowerCase().search(/run|leave|exit|flee/) != -1) {
            if (userState.isInvincible) {
                msg += 'Gogogogogogogo! You book it through the old house and burst through the front door. The monster follows you and chases you down the street. ';
                msg += 'Eventually you will tire, and then you will be eaten. The massacre of the town will be on your hands. ';
                msg += 'I hope you\'re proud of yourself.';
                userState.gameOver = true;
            }
            else {
                msg += TOO_SLOW_YOU_DIE;
                userState.gameOver = true;
            }
        }
        else {
            msg += TOO_SLOW_YOU_DIE;
            userState.gameOver = true;
        }

        userState.msg = msg;
        return userState;
    }

    fBedRoom(userState, action) {
        let msg = '';

        if (action.toLowerCase().search(/pizza|food|growth|mold/) != -1) {
            msg += 'You spy some spotted mushrooms in the moldy mess. ';
            if (userState.hasRecipe && !userState.hasMushroom) {
                msg += 'Perfect. You pocket a few mushrooms for the potion.';
                userState.hasMushroom = true;
            }
            msg += 'Wait, did that one fuzzy glob just move? Eww...';
            msg += 'Take a look at the rat, clothes, or get out of here?';
        }
        else if (action.toLowerCase().search('rat') != -1) {
            msg += 'It\'s a rat long past his prime. Or his time at all. ';
            if (!userState.hasRat) {
                if (userState.hasRecipe) {
                    msg += 'Perfect. You pocket the rat skull for the potion.';
                    userState.hasRat = true;
                }
                else {
                    msg += 'Why are you even looking? It looks dreadful, and not to mention the smell...';
                }
            }
            else {
                msg += 'You\'ve removed the skull. You monster. ';
            }
            msg += 'Take a look at the pizza, clothes, or get out of here?';
        }
        else if (action.toLowerCase().search('cloth') != -1) {
            msg += 'On closer inspection, the clothes aren\'t just moth-eaten, they\'ve been ripped to shreds. By something big, by the looks of it. ';
            msg += 'Take a look at the pizza, the rat, or get out of here?';
        }
        else if (action.toLowerCase().search(/leave|out|exit|hall|door/) != -1) {
            msg += 'You head back into the hall. ';
            msg += 'Do you check the living room, kitchen or the basement?';
            userState.room = 'hallEnd';
        }
        else {
            msg += ENTER_BEDROOM;
        }

        userState.msg = msg;
        return userState;
    }

    fHallEnd(userState, action) {
        let msg = '';

        if (action.toLowerCase().search('living') != -1) {
            //TODO - implement candle better, and in other rooms?...
            if (!userState.hasCandle) {
                msg += 'You see a candle and some matches. There is a bright flare as you light it up. ';
                userState.hasCandle = true;
            }
            msg += 'The living room is full of junk and the walls are grimy. ';
            if (userState.hasRecipe && !userState.hasSlime) {
                msg += ' But oh, the slime on the walls could work for the potion maybe, you scoop some off. Ick.';
                userState.hasSlime = true;
            }
            if (!userState.hasAxe) {
                msg += 'There is an axe on the table. Take the axe or just leave?';
                userState.room = 'livingRoom';
            }
            else {
                msg += 'Nothing much left here, so you head back into the hall. ';
                msg += 'Head to the kitchen, bedroom, or stairs?';
            }
        }
        else if (action.toLowerCase().search(/left|kitchen/) != -1) {
            msg += 'You enter the kitchen. It smells like something died in here. And then came back from the dead. And died again. ';
            msg += 'You cover your mouth and look around. There is an old book lying on the table, open to a page. ';

            //if have everything
            if (userState.hasRecipe
                && userState.hasRat
                && userState.hasMushroom
                && userState.hasSlime ) {
                msg += 'You\'ve got all the ingredients now, so you find a bowl and dump everything in. You light it with the candle and a LOUD pop sounds! ';
                msg += 'The smoke clears and the bowl is now full of dark purple liquid.';
                msg += 'You hear a gutteral, inhuman roar coming from the cellar, and claws scrabbling up the stairs. '
                msg += 'Something\'s coming! Drink it, '
                if (userState.hasAxe) {
                    msg += 'take out the axe, '
                }
                msg += 'or run?';
                userState.room = 'endGame';
            }
            else {
                if (userState.hasCandle) {
                    msg += 'You hold out your candle and take a look. ';
                    msg += 'It\'s a recipe for a potion! Calls for a rat skull, a mushroom, and some slime. ';
                    userState.hasRecipe = true;
                }
                else {
                    msg += ' You can\'t make it out in the dark. You need a light. ';
                }
                msg += 'You head back into the hall. ';
                msg += 'Do you check the living room, bedroom or the basement?';
            }
        }
        else if (action.toLowerCase().search(/right|bed/) != -1) {
            msg += ENTER_BEDROOM;
            userState.room = 'bedRoom';
        }
        else if (action.toLowerCase().search(/down|stair|basement|cellar/) != -1) {
            msg += 'With a great roar, a massive hairy beast lurches from the shadows and devours your entire being in one bite! Welp. GG. ';
            userState.gameOver = true;
        }
        else {
            msg += IN_THE_HALL;
        }

        userState.msg = msg;
        return userState;
    }

    fLivingRoom(userState, action) {
        let msg = '';

        if (userState.fBleedingStatus > 0) {
            msg += 'Your cut is worse than you thought, and it\'s starting to bleed more. ';
        }

        //look for light
        if (action.toLowerCase().search('light') != -1) {
            msg += 'You trip on some debris, and run your hand along the wall. It feels...slimy. There is a light switch, but it stopped working years ago. ';
            msg += 'You find a candle and some matches. The room is illuminated in a bright flash as you light the candle. ';
            msg += 'The first thing you notice is all the dust everywhere. Then you see an axe, just sitting there on the coffee table. Do you take it, or just leave?';
            userState.hasCandle = true;
        } //leave living room (go to hall end)
        else if (action.toLowerCase().search(/door|leave|exit|go|out/) != -1) {
            msg += 'You trip on some debris and stumble through the doorway. ';
            msg += IN_THE_HALL;
            userState.room = 'hallEnd';
        } //take axe
        else if (action.toLowerCase().search(/take|axe/) != -1) {
            msg += 'You take the axe. It\'s hefty in your hands and has a little blood on the blade.';
            msg += 'You then head out the doorway, axe in hand.';
            msg += IN_THE_HALL;
            userState.hasAxe = true;
            userState.room = 'hallEnd';
        } else {
            msg = 'You stand around in the dark for a bit, hyperventilating. You take some time to think, what do you do?';
        }

        userState.msg = msg;
        return userState;
    }

    fOutside(userState, action) {
        let msg = '';

        //go through window
        if (action.toLowerCase().search('window') != -1) {
            msg = 'You pull yourself up, through the window, but cut yourself on the glass. It\'s not too deep, but it stings. The house is dark. You find yourself in a living room. Do you fumble around around looking for a light, or look for a doorway?';
            userState.bleedingStatus = 1;
            userState.room = 'livingRoom';
        } //enter door
        else if (action.toLowerCase().search('door') != -1) {
            msg = 'The door creaks loudly as you pull it open. You step inside. It is dark and the house smells of death. You\'re in the main hallway, and take a quick look around. There is a living room, a bedroom, a kitchen, and a dark staircase. Where do you go?';
            userState.room = 'hallEnd';
        } //first time here, or invalid
        else {
            msg = 'You see a dark and scary abandoned house. There is a broken window on the right side, by the corner. The door is slightly ajar. Do you take the window or use front door? (You can also type \'status\' to see your inventory at any time, just resume for the previous message afterwards)';
        }

        userState.msg = msg;
        return userState;
    }
}
