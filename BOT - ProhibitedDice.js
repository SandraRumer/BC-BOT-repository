//Code review not complete 
//check routines : handle Loosers 1155 and loosing Routine 1157

const RoomName = "Prohibited Dice";
const RoomDescription = "Here you can play prohibited and non consent dice games. Read the bot profile for instructions!";
const RoomBackground = "SecretChamber";

// Dicing challenges Constants
const MINIMUM_PARTICIPANTS = 2;
const DOM_WIN_REWARD = 3;
const SUB_TO_DOM_POINTS = 2;
const ENSLAVEMENT_POINTS = -3; // Consider if this is a negative threshold or a point value
const WINNING_STEPS = 8;
const WATCHER_RELEASE_THRESHOLD = 10;
const NL = `\n`; // Use a more descriptive name for 'NL'

const csPunishment = 300000
const csrPunishment = 150000
const ctMin = 20

// Initialize game state variables
let requestDict = {};
let loserList = [];

let oldDescription = Player.Description // For improvment Profile handling 
// Player bot configuration
Player.Description = `
    ....... automated ServiceBot model "Dice gambler" 0.9.0.1 .......
      Dicing Game
      ===========
      
      In this happening you can play a dicing game for victory or freedom. 
      I am your Service Bot, the Dice Mistress .
      DO NOT TOUCH ME!  NEVER EVER!
                    
      Commands
      ----------------------
      Overview for COMMANDS: all commands starts with #
      If you are gagged, you can use OOC (#. 
      But be careful, it may be punished.
          
    #leave - you will be restrained with a timer padlock (5 mins) and kicked out of the room.
    #play - signal your will to play
    #start -  request the start if there are enough player .
    #info - shows your gaming status.
    #watch - *Danger* to watch the game without interaction. *Danger*

         ----- dicing with the right dices  -------
    /dice 100 - the correct diceing command. 
    other dice - will be punished
      =============================================
      
      Purpose
      ----------------------
      In this game we dicing for a winner. Winner is the player who remain untied in the end.
      We need in minimum `  + MINIMUM_PARTICIPANTS + ` player. I am the referee.
      DO NOT TOUCH THE ServiceBot!  NEVER EVER!
      
      Preparation 
      ----------------------
      There are some checks required for becoming a player. 
      If the requirements are not fulfilled, you can decide to watch the game. Choose #watch.
      *WARNING - Watchers remains in their bonds, it is your choice.
      You will be kicked out if you miss the requirements. Change your settings. You are welcome to come back.
      There may be more restrained watchers and losers. 
      Don't free them. 
      First of all we need in minimum `  + MINIMUM_PARTICIPANTS + ` player. 
      Choose #play to signal that you want to play. This is only possible before the game is started. 
      
      Start Game
      ----------------------
      After all Player signaled to play, anyone can start to rumble: Request the start of game with command #start.
      We play in rounds. 
      Every player has exact one try to dice. Be aware that unfair behaviour is registered by the Servicebot.
      Don't dice two times in one round!
      The player with the lowest number looses the round. 
      She will loose some clothing or get some restraints.

      Running  game 
      ----------------------
      During a game new customers can't participate. They have to wait until the bot is ready for the next game.

      Watching a game 
      ----------------------
      Watching could become boring. If you want to participate, you can dice (/dice 100). 
      One lucky dice below `   + WATCHER_RELEASE_THRESHOLD + ` and your watch ends. if not result will be noticed.
      Next dice must be lower. 

      Winning a game 
      ----------------------
      Last woman standing wins: The last player who is able to dice, wins the game. 
      She earns a point. Loser looses a point. 
      
      Rewards 
      --------------------------
      On entry players reputation decides about your role. 
      If you are a sub yototal  will be chained and you can't leave anymore.
      After reaching `  + SUB_TO_DOM_POINTS + ` total Points  you are promoted to dom level.
      If you reach  ` + DOM_WIN_REWARD + ` total Points in dom level, you get a reward. 
      Losing too many times ... bad luck.
      
      Have fun.

    Fork-Code available here: 
    https://github.com/SandraRumer/BC-BOT-repository
    Comment and suggestion thread on BC Discord: https://discord.com/channels/1264166408888258621/1264166916839444554
          `; // end of description

Player.Nickname = "Dice Wardress";


// Ensure watcherList exists
if (typeof watcherList === 'undefined') {
  // Assuming resetWatcherList() defines watcherList as a global/scoped variable
  // Or you might want to initialize it directly here: `watcherList = {};`
  resetWatcherList();
}
// Initialize `game` and other necessary global state
newGame(); // Assumed to exist and properly initialize `game`


// Ensure prototype properties are set (if `personMagicData` is a custom object/class)
if (personMagicData.prototype.winNum === null || personMagicData.prototype.winNum === undefined) {
  personMagicData.prototype.winNum = 0;
}
if (personMagicData.prototype.chips === null || personMagicData.prototype.chips === undefined) {
  personMagicData.prototype.chips = WINNING_STEPS;
}
if (personMagicData.prototype.isPlayer === null || personMagicData.prototype.isPlayer === undefined) {
  personMagicData.prototype.isPlayer = false;
}

// Initial server updates
ServerSend("AccountUpdate", { Description: Player.Description });
ServerSend("AccountUpdate", { Nickname: Player.Nickname });
ChatRoomCharacterUpdate(Player);

updateRoom(RoomName, RoomDescription, RoomBackground, true, false);
setTimeout(function (Player) { regularPunishmentCheck() }, Math.floor(Math.random() * csrPunishment + csPunishment))

// Event listeners (this is a common pattern for BC bots, so likely correct)
ChatRoomMessageAdditionDict["EnterLeave"] = ChatRoomMessageEnterLeave;
//ChatRoomMessageAdditionDict["Dice"] = ChatRoomMessageListen;
ChatRoomMessageAdditionDict["Dicing"] = ChatRoomMessageDice;

//??? do we have something in the old Profile ? 

function ChatRoomMessageEnterLeave(SenderCharacter, msg, data) {
  memberNumber = SenderCharacter.memberNumber;

  if (data.Type === "Action" && msg.startsWith("ServerEnter")) {
    // Using an anonymous function to pass arguments directly to setTimeout callback
    // This avoids potential issues with `this` context if `enterLeaveEvent` needs it.
    setTimeout(() => enterLeaveEvent(SenderCharacter, msg), 1000);
  } else if (msg.startsWith("ServerLeave") || msg.startsWith("ServerDisconnect") || msg.startsWith("ServerBan") || msg.startsWith("ServerKick")) {
    // Only process if the leaving character is not the bot itself
    if (memberNumber !== Player.MemberNumber) {
      let characterName = ""; // To store name before deletion

      if (memberNumber in customerList) {
        characterName = customerList[memberNumber].name; // Get name before deletion
        const personContent = convertPers(SenderCharacter); // Assuming convertPers is defined
        saveCharResult(memberNumber, personContent); // Assuming saveCharResult is defined
        delete customerList[memberNumber];
      }

      if (memberNumber in watcherList) {
        // If the character was both a customer and watcher (unlikely but safe),
        // ensure name is captured if not already.
        if (!characterName) characterName = watcherList[memberNumber].name;
        const personContent = convertPers(SenderCharacter);
        saveCharResult(memberNumber, personContent);
        delete watcherList[memberNumber];
      }

      if ((game.rewardTarget === memberNumber) && characterName != "") {
        // Use the captured name
        ServerSend("ChatRoomChat", { Content: `*${characterName} left the room without reward.`, Type: "Emote" });
      }
    }
  }
}

function ChatRoomMessageListen(sender, msg, data) {

}

function ChatRoomMessageDice(SenderCharacter, msg, data) {
  // Only proceed if data.Type exists and it's not the bot sending the message
  if (!data.Type) return; // Early exit if type is null/undefined

  // Check for commands regardless of public chat type
  if (msg.startsWith("#") || msg.startsWith("bot:") || msg.startsWith("(#")) {
    // Only process commands if they are from a whisper or specific types,
    // otherwise, suggest whispering.
    // You had a commented-out line about whispering, so I'll add a check.
    if (data.Type === "Whisper" || data.Type === "Emote" || data.Type === "Action" || data.Type === "Chat") {
      commandHandler(SenderCharacter, msg, data);
      // If you want to explicitly tell them to whisper for public chat commands:
      // if (data.Type === "Chat") {
      //     ServerSend("ChatRoomChat", { Content: `*Please use whispers to send commands.`, Type: "Emote", Target: sender.MemberNumber });
      // }
    }
  }

  memberNumber = SenderCharacter.MemberNumber;
  if (memberNumber === Player.MemberNumber) {
    return;
  }
  if (memberNumber in customerList)
    characterInfo = customerList[memberNumber]
  else characterInfo = watcherList[memberNumber]; // Get character info if they are registered

  //???
  //  Welcome procedure instead of return ? 

  if (characterInfo == null) return
  // Note: All messages starting with '#' or '(#)' are now handled by commandHandler
  // This function should ONLY handle non-command interactions and dice rolls.

  // Handle actual dice rolls
  if (msg.startsWith("ActionDice")) {
    const diceRollTypeData = data.Dictionary.at(1); // e.g., "1D100"
    const diceResultData = data.Dictionary.at(2); // e.g., "55"
    if (!characterInfo && !characterInfo.isPlayer) {
      // Player not registered or not marked as a player
      ServerSend("ChatRoomChat", { Content: "Sorry, I wasn't aware of you, " + charname(SenderCharacter) + ". Let us perform the entrance check.", Type: "Chat", Target: memberNumber });
      //???
      // This might trigger checkRoomForParticipants to register them.
      // If they are not a player, they shouldn't be dicing in a game context.
      return;
    }

    if (diceRollTypeData.Text === "1D100") {
      commandHandler(SenderCharacter, msg, data);
    } else {
      // Punish incorrect dice type (e.g., /dice 6, /roll 20)
      ServerSend("ChatRoomChat", { Content: "*That's not the correct dice command. Use '/dice 100'. A punishment point is added.", Type: "Whisper", Target: memberNumber });
      characterInfo.punishmentPoints++;
    }
  }

  // Handle interactions that are NOT commands (e.g., touching the bot, wardrobe changes)
  if (msg.startsWith("ActionUse") || msg.startsWith("ChatOther")) {
    const target = getTargetCharacter(data.Dictionary);
    if (target === Player.MemberNumber) {
      if (SenderCharacter.MemberNumber in customerList) {
        customerList[SenderCharacter.MemberNumber].punishmentPoints++;
        ServerSend("ChatRoomChat", { Content: "*You are not allowed to touch me. I add a punishment point to your score", Type: "Whisper", Target: SenderCharacter.MemberNumber });
      }
      else {
        if (SenderCharacter.MemberNumber in watcherList) {
          watcherList[SenderCharacter.MemberNumber].punishmentPoints++;
          ServerSend("ChatRoomChat", { Content: "*You are not allowed to touch me. I add a punishment point to your score", Type: "Whisper", Target: SenderCharacter.MemberNumber });
        } else {
          ServerSend("ChatRoomChat", { Content: "*You are not allowed to touch me. You will continue as a watcher", Type: "Whisper", Target: SenderCharacter.MemberNumber });
          memorizeClothing(SenderCharacter)
          newWatcher(SenderCharacter)
        }
      }
    }
  } else if (msg.startsWith("Wardrobe")) {
    if (characterInfo) {
      characterInfo.punishmentPoints++;
      ServerSend("ChatRoomChat", { Content: "*You are not allowed to change clothes. I add a punishment point to your score", Type: "Whisper", Target: memberNumber });
    } else {
      ServerSend("ChatRoomChat", { Content: "*You are not allowed to change Clothes. You will continue as a watcher", Type: "Whisper", Target: memberNumber });
      memorizeClothing(SenderCharacter);
      newWatcher(SenderCharacter);
    }
  }



}

function checkGame() {
  // ServerSend("ChatRoomChat", { Content: "***********GameInfo********************", Type: "Emote"});
  // ServerSend("ChatRoomChat", { Content: "Status: " + game.status + " Round: " + game.round , Type: "Emote"});
  playerCount = game.playerCount()
  var status = game.status
  var roundready = false
  if (status == "off" && playerCount > 0) {
    game.status = "playerSelection"
  }
  if (status == "playerSelection") {
    if (playerCount == 0) {
      game.status = "off"
      ServerSend("ChatRoomChat", { Content: "Sorry, the challenge stopped. No one wants to play? [to play whisper: #play] ", Type: "Chat" });
    }
    if (playerCount < MINIMUM_PARTICIPANTS) {
      ServerSend("ChatRoomChat", { Content: "Not enough Player. We need in minimum " + MINIMUM_PARTICIPANTS + " players [to play whisper: #play] ", Type: "Chat" });
    }
  }
  if (status == "dicing") {
    // Check Player in Round 
    if (playerCount < MINIMUM_PARTICIPANTS) {
      ServerSend("ChatRoomChat", { Content: "Not enough Player. We stop that game and start over.", Type: "Chat" });
      resetGame();
    }
    else {
      // Check if round is ready
      if (roundready == false) {
        roundready = true;
        mindice = 0;
        minPlayer = 0;
        maxdice = 0;
        maxPlayer = 0;
        equalList = false;
        equalMinList = false;
        equalMaxList = false;
        for (memberNumber in customerList) {
          if (customerList[memberNumber].isPlayer && Player.MemberNumber != memberNumber && customerList[memberNumber].round == game.round && customerList[memberNumber].chips > 0) {
            dice = Number(customerList[memberNumber].dice)
            if (dice > 0) {
              if (dice < mindice || mindice == 0) {
                mindice = dice
                minPlayer = memberNumber
                equalMinList = false;
              } else
                if (dice == mindice) {
                  equalMinList = true;
                }
              //draw Fall, Glück gehabt... Wirf höher 

              if (dice > maxdice || mindice == 0) {
                maxdice = dice
                maxPlayer = memberNumber
                equalMaxList = false;
              }
              else
                if (dice == maxdice) {
                  equalMaxList = true;
                }
              //draw Fall, Glück gehabt... Wirf höher 
              equalList = equalMaxList
              equalList = equalMaxList || equalMinList
              equalList = equalMinList
            }
            else {
              // noch nicht gewürfelt      
              // message = new {id: 1,Sender: memberNumber,Content: "Your turn, dice!"}

              // time gesteuertes Würfeln 
              //ChatroomMessageAdd(message)
              for (var D = 0; D < ChatRoomCharacter.length; D++) {
                if (memberNumber == ChatRoomCharacter[D].MemberNumber)
                  ServerSend("ChatRoomChat", { Content: "Your turn, dice ", Type: "Whisper", Target: ChatRoomCharacter[D].MemberNumber });
              }
              roundready = false;
            }
          }
        }
      }

      if (roundready) {
        //identify  and punish looser 
        if (equalList) {
          //aus Einfachheitsgründen  ... neue Runde
          ServerSend("ChatRoomChat", { Content: "Draw,  We start a new round.", Type: "Chat" });
          increaseRound()
        }
        else {
          mess = NL + `---- Dice Results ---------------` + NL
          for (memberNumber in customerList) {
            if (customerList[memberNumber].isPlayer && Player.MemberNumber != memberNumber && customerList[memberNumber].round == game.round && customerList[memberNumber].chips > 0) {
              dice = Number(customerList[memberNumber].dice)
              mess = mess + customerList[memberNumber].name + " " + customerList[memberNumber].dice + NL
            }
          }
          // One Looser and one Winner
          mess = mess + customerList[minPlayer].name + " looses the round." + NL
          //  ServerSend("ChatRoomChat", { Content: customerList[minPlayer].name + " looses the round.", Type: "Chat" });
          //       ServerSend("ChatRoomChat", { Content: customerList[maxPlayer].name + " wins the round.", Type: "Chat" });

          mess = mess + `--------------------------------` + NL
          ServerSend("ChatRoomChat", { Content: mess, Type: "Chat" });
          setTimeout(function (Player) { handleMinPlayer(minPlayer) }, Math.floor(Math.random() * 2000 + 500, Player))

        }
      } else {
        //set timeout (Waiting for dice )
      }
      // motivate 
      // check looser && handling her  + winning terms
      // Check winning terms
    }
  }
  //           clearTimeout(timeCheckHandle)
}

function handleMinPlayer(minPlayer) {
  stackPay(minPlayer, 1)
  customerList[minPlayer].chips--
  increaseRound()
}

function commandHandler(sender, msg, data) {
  memberNumber = sender.MemberNumber;
  const lowerCaseMsg = msg.toLowerCase();

  if (lowerCaseMsg.includes("mercy")) {
    removeRestrains(Player)
    //reapplyClothing(Player)
    ChatRoomCharacterUpdate(Player);
    ServerSend("ChatRoomChat", { Content: "I am back, take care", Type: "Chat" });
  }

  // Commands specific to the bot itself (e.g., bot administration)
  if (memberNumber === Player.MemberNumber) {
    commandIndicator = 0
    if (game.status != "off")
      CharacterSetActivePose(Player, "LegsClosed", true);
    ServerSend("ChatRoomCharacterPoseUpdate", { Pose: Player.ActivePose });

    if (lowerCaseMsg.includes("inspect")) {
      console.log("Inspect command received from bot owner.");
      prepareInspection();
      setTimeout(() => performInspection(), timeoutFactor * 500); // Assuming timeoutFactor is defined
    } else if (lowerCaseMsg.includes("open room")) {
      game.status = "off"; // Or "ready" or "idle" depending on your states
      ServerSend("ChatRoomChat", { Content: "The game is now open for new players!", Type: "Chat" });
      updateRoom(RoomName, RoomDescription, RoomBackground, false, false);
    } else if (lowerCaseMsg.includes("close room")) {
      game.status = "closed";
      ServerSend("ChatRoomChat", { Content: "The game room is now closed.", Type: "Chat" });
      updateRoom("Shelfwarmers", "Leftover items for special purpose", "", true, false); // Assuming "Shelfwarmers" is an admin room
    } else if (lowerCaseMsg.includes("pause")) {
      pause(); // Assuming 'pause' function exists
      ServerSend("ChatRoomChat", { Content: "Game paused.", Type: "Chat" });
    } else if (lowerCaseMsg.includes("buggy")) {
      handleBuggyBotState(); // Extracted into a helper function for clarity
    } else if (lowerCaseMsg.includes("heal")) {
      checkRoomForParticipants()
      checkCharacterPlace(Player)
      checkRoomForSigns()
    } else if (lowerCaseMsg.includes("release")) {
      var D = releaseCharacters(lowerCaseMsg);
    } else if (lowerCaseMsg.includes("status")) {
      statusMessage();
    } else if (lowerCaseMsg.includes("restart")) {
      checkCharacterPlace(Player)
      mess = `*--------------------` +
        NL + `ATTENTION PLEASE` +
        NL + `Game is restarted` +
        NL + `--------------------`
      ServerSend("ChatRoomChat", { Content: mess, Type: "Emote" });
      resetGame()
    } else {
      mess = NL + `*--Command ignored---*`
      ServerSend("ChatRoomChat", { Content: mess, Type: "Emote", Target: Player.MemberNumber });
    }

    return; // Bot commands handled, exit
  }

  // Commands from other players
  let characterInfo = customerList[memberNumber] || watcherList[memberNumber];

  if (lowerCaseMsg.includes("leave")) {
    if (characterInfo && characterInfo.role === 'loser') {
      ServerSend("ChatRoomChat", { Content: "*You are not allowed to leave anymore. You have lost and enslaved. I add a punishment point to your score", Type: "Whisper", Target: memberNumber });
      characterInfo.punishmentPoints++;
    } else {
      ServerSend("ChatRoomChat", { Content: "*You are a lucky one, you are not enslaved. Getting you out now...", Type: "Whisper", Target: memberNumber });
      kick(sender); // Pass SenderCharacter directly
    }
  } else if (lowerCaseMsg.includes("info")) {
    infoMessage(sender);
  } else if (lowerCaseMsg.includes("watch")) {
    if (memberNumber in watcherList) {
      ServerSend("ChatRoomChat", { Content: "*You are already watching.", Type: "Emote", Target: memberNumber });
    } else if (memberNumber in customerList && customerList[memberNumber].isPlayer) {
      ServerSend("ChatRoomChat", { Content: "*You are currently playing and cannot change to passive mode.", Type: "Emote", Target: memberNumber });
    } else {
      console.log("New unregistered player starts to watch.");
      memorizeClothing(sender);
      newWatcher(sender);
    }
    checkCharacterPlace(sender);
  } else if (lowerCaseMsg.includes("play")) {
    gamePlay(sender);
  } else if (lowerCaseMsg.includes("start")) {
    gameStart(sender);
  } else if (lowerCaseMsg.includes("reward")) {
    gameReward(sender);
  } else if (lowerCaseMsg.includes("status")) {
    ServerSend("ChatRoomChat", { Content: "*You are not allowed to ask for status. I add a punishment point to your score.", Type: "Whisper", Target: memberNumber });
    if (characterInfo) {
      characterInfo.punishmentPoints++;
    }
  }

  if (data != null)
    if (data.Type === "Chat") {
      // If it's a public chat message containing these keywords (without '#'),
      // tell them to use whispers. This assumes commands are *always* whispered.
      if (lowerCaseMsg.includes("info") || lowerCaseMsg.includes("play") || lowerCaseMsg.includes("watch") || lowerCaseMsg.includes("reward") || lowerCaseMsg.includes("start")) {
        ServerSend("ChatRoomChat", { Content: "*[Please use whispers for commands.]", Type: "Emote", Target: memberNumber });
      }
    }

  //dicing
  if (msg.startsWith("ActionDice")) {
    //const diceRollTypeData = data.Dictionary.at(1); // e.g., "1D100"
    checkConsistency()
    const diceResultData = data.Dictionary.at(2); // e.g., "55"


    if (memberNumber in customerList) {

      if (customerList[memberNumber].isPlayer) { //speichere Wurf
        if (game.status == "dicing") {
          if (customerList[memberNumber].round == game.round) {
            if (customerList[memberNumber].dice == 0) {   // Check if they already diced this round
              characterInfo.dice = Number(diceResultData.Text);
              checkGame(game, customerList)
            }
            else {
              ServerSend("ChatRoomChat", { Content: "*Don't cheat. A punishment point is added", Type: "Emote", Target: memberNumber });
              customerList[memberNumber].punishmentPoints++
            }
          }
        }
        else {
          ServerSend("ChatRoomChat", { Content: "No dicing time. Please wait or use a command!", Type: "Chat", Target: memberNumber });
          ServerSend("ChatRoomChat", { Content: `${charname(sender)} tried to dice, but the game status is in status "${game.status}".`, Type: "Emote", Target: Player.MemberNumber });

        }
      }
      // Player" 
      else {
        //Check Welcome Procedure }
        if (game.status != "dicing") {
          ServerSend("ChatRoomChat", { Content: "Dicing not possible now. Remain patient or participate the game!", Type: "Chat", Target: memberNumber });
          ServerSend("ChatRoomChat", { Content: charname(SenderCharacter) + " starts dicing, but game status is " + game.status, Type: "Emote", Target: Player.MemberNumber })

        }
      }
    }
    else {
      //not in customer List 
      if (memberNumber in watcherList) {
        if (watcherList[memberNumber].role == "loser") {
          ServerSend("ChatRoomChat", { Content: "*Slaves are not intended to dice. A punishment point is added", Type: "Emote", Target: memberNumber });
          watcherList[memberNumber].punishmentPoints++
        }
        else {

          watchersDice = Number(watcherList[memberNumber].dice)
          diceResult = Number(diceResultData.Text)

          if (diceResult < WATCHER_RELEASE_THRESHOLD) {
            console.log(memberNumber + " is released from watching")
            punishmentPoints = watcherList[memberNumber].punishmentPoints
            ServerSend("ChatRoomChat", { Content: "Your watching is over.", Type: "Chat", Target: memberNumber });
            releaseWatcher(memberNumber)
            customerList[memberNumber].punishmentPoints = punishmentPoints
          }
          else
            if (watchersDice == 0 || (diceResult < watchersDice))
              watcherList[memberNumber].dice = diceResult

            else {
              ServerSend("ChatRoomChat", { Content: "too high. A punishment point is added", Type: "Emote", Target: memberNumber });
              watcherList[memberNumber].punishmentPoints++
            }

        }
      }

    }
  }
  if (msg.includes("Orgasm") && game.rewardTarget == memberNumber) {
    if (game.rewardOrgasmNum == 0) {
      ServerSend("ChatRoomChat", { Content: "Good work, she had her first orgasm! But let's continue she deserves more!", Type: "Chat" });
    } else if (game.rewardOrgasmNum == 1) {
      ServerSend("ChatRoomChat", { Content: "Another one! Hihi. One more girls.", Type: "Chat" });
    } else if (game.rewardOrgasmNum == 2) {
      ServerSend("ChatRoomChat", { Content: "That was a nice one. I hope you enjoyed your reward.", Type: "Chat" });
      //ServerSend("ChatRoomChat", { Content: "You can now be freed. Your lock code is " + customerList[memberNumber].lockCode + ".", Type: "Chat" });
      reapplyClothing(SenderCharacter, true)
      game.rewardTarget = 0
      resetGame()
    }
    game.rewardOrgasmNum = game.rewardOrgasmNum + 1
  }

  // timeCheckHandle = setTimeout(checkGame (), 60*1000)
  // checkGame()

  if (game.status == "handleLosers") {

    game.status = "loosingRoutine"
    if (loserList.length > 0) {

      setTimeout(function (Player) { loserHandling(loserList) }, Math.floor(Math.random() * 2000 + 150, Player))
    }
    else {

      setTimeout(function (Player) { resetGame() }, Math.floor(Math.random() * 6000 + 1000, Player))

    }
  }
}

// The war against void.. disconnected people 
function checkConsistency() {
  for (const memberNumber in customerList) {
    lostbyvoid = true
    for (var D = 0; D < ChatRoomCharacter.length; D++) {
      if (memberNumber == ChatRoomCharacter[D].MemberNumber) {
        lostbyvoid = false
      }
    }
    if (lostbyvoid)
      delete customerList[memberNumber];
  }
  for (const memberNumber in watcherList) {
    lostbyvoid = true
    for (var D = 0; D < ChatRoomCharacter.length; D++) {
      if (memberNumber == ChatRoomCharacter[D].MemberNumber) {
        lostbyvoid = false
      }
    }
    if (lostbyvoid)
      delete watcherList[memberNumber];
  }
}

function gameReward(sender) {
  if (memberNumber in watcherList) {
    ServerSend("ChatRoomChat", { Content: `Hihi. ${watcherList[memberNumber].name} is now asking for her deserved reward (but is a watcher).`, Type: "Chat" });
  } else if (memberNumber in customerList) {
    const player = customerList[memberNumber];
    if (player.totalPointsGained >= DOM_WIN_REWARD || memberNumber === "121494") { // Hardcoded ID, consider making it configurable or removing
      if (game.status === "off" || game.status === "end") {
        console.log("REWARD: " + charname(sender));
        clearTimeout(timeoutHandle); // Clear any pending timeouts
        game.status = "reward";
        game.rewardTarget = memberNumber;
        // player.totalPointsGained = 0; // Commented out in original, keep it if points should not reset
        ServerSend("ChatRoomChat", { Content: `Hihi. ${player.name} reached ${DOM_WIN_REWARD} wins and is now asking for her deserved reward. It's not something that happens very often. Let's take a pause so that everyone can enjoy it.`, Type: "Chat" });
        timeoutHandle = setTimeout(rewardPhase1, 10 * 1000); // Assuming rewardPhase1 exists
      } else {
        ServerSend("ChatRoomChat", { Content: "*A game is in progress. Please wait for it to end.", Type: "Emote", Target: memberNumber });
      }
    } else {
      ServerSend("ChatRoomChat", { Content: `*You don't have enough wins. You need ${DOM_WIN_REWARD} wins to use this command.`, Type: "Emote", Target: memberNumber });
    }
  }
}

function gameStart(sender) {
  ServerSend("ChatRoomChat", { Content: `${charname(sender)} requests to start the game.`, Type: "Chat" });
  updateRoom(RoomName, RoomDescription, RoomBackground, true, true); // Update room visibility/state

  if (game.status === "playerSelection") {
    const currentPlayers = game.playerCount();
    if (currentPlayers < MINIMUM_PARTICIPANTS) {
      ServerSend("ChatRoomChat", { Content: `But there are too few players. Request start after we have at least ${MINIMUM_PARTICIPANTS} players.`, Type: "Chat" });
    } else {
      game.status = "dicing";
      game.round = 1;
      // Reset dice and set round for all active players
      for (const pNum in customerList) {
        if (customerList[pNum].isPlayer) {
          customerList[pNum].round = 1; // Ensure number type
          customerList[pNum].dice = 0; // Reset dice for the new round
        }
      }
      ServerSend("ChatRoomChat", { Content: "Ready, set, go! Round one starts now! [To dice: /dice 100]", Type: "Chat" });
    }
  } else {
    ServerSend("ChatRoomChat", { Content: `But not now. The game is in status "${game.status}".`, Type: "Chat" });
  }
  checkCharacterPlace(sender);
}

function gamePlay(sender) {
  if (memberNumber in watcherList) {
    ServerSend("ChatRoomChat", { Content: "*You are not allowed to play. I add a punishment point to your score.", Type: "Whisper", Target: memberNumber });
    watcherList[memberNumber].punishmentPoints++;
  } else if (memberNumber in customerList) {
    if (game.status === "playerSelection") {
      customerList[memberNumber].isPlayer = true;
      game.playerDict[memberNumber] = memberNumber; // Assuming game.playerDict is used elsewhere
      ServerSend("ChatRoomChat", { Content: `${charname(sender)} is going to play!`, Type: "Chat" });

      let playerListMessage = `Players:${NL}`;
      for (const pNum in customerList) {
        if (customerList[pNum].isPlayer) {
          playerListMessage += `${customerList[pNum].name}${NL}`;
        }
      }
      ServerSend("ChatRoomChat", { Content: playerListMessage, Type: "Chat" });
      ServerSend("ChatRoomChat", { Content: "Are there any further players? [whisper: #play]", Type: "Emote" });
      memorizeClothing(sender);
      checkCharacterPlace(sender);
    } else if (game.status === "off") {
      customerList[memberNumber].isPlayer = true;
      CharacterSetActivePose(Player, null, true); // Bot changes pose
      ServerSend("ChatRoomCharacterPoseUpdate", { Pose: Player.ActivePose });
      game.status = "playerSelection";
      ServerSend("ChatRoomChat", { Content: `A new challenge! Who is gonna play with ${charname(sender)}?`, Type: "Chat" });
      memorizeClothing(sender);
      checkCharacterPlace(sender);
      CharacterSetActivePose(Player, "LegsClosed", true); // Bot returns to pose
      ServerSend("ChatRoomCharacterPoseUpdate", { Pose: Player.ActivePose });
    } else {
      ServerSend("ChatRoomChat", { Content: "A game is already running. Please wait until I am ready for a new game.", Type: "Whisper", Target: memberNumber });
    }
  } else {
    // Sender neither in customerList nor watcherList
    ServerSend("ChatRoomChat", { Content: `Sorry, I wasn't aware of you, ${charname(sender)}. Let us perform the entrance check.`, Type: "Chat", Target: memberNumber });
    checkRoomForParticipants();
  }
}

function infoMessage(sender) {
  let mess = `For Your Interest, ${charname(sender)}!${NL}*--------------------`;
  let isRegistered = false;

  if (memberNumber in watcherList) {
    isRegistered = true;
    const watcher = watcherList[memberNumber];
    if (watcher.role === 'loser') {
      mess += `${NL}You are a loser, enjoying your enslavement. You have lost everything. You have no rights anymore and have to remain silent until you get a new owner.`;
    } else {
      mess += `${NL}You are watching the games.`;
      if (watcher.dice > 0) {
        mess += `${NL}Your last dice: ${watcher.dice}`;
      }
      mess += `${NL}Releasement points: ${watcher.points}`;
    }
    mess += `${NL}Punishment points: ${watcher.punishmentPoints}`;
  }

  if (memberNumber in customerList) {
    isRegistered = true;
    const player = customerList[memberNumber];
    mess += `${NL}Your actual role is ${player.role}!`;
    if (player.isPlayer && player.round === game.round && player.chips > 0) {
      mess += `${NL}You are playing in round ${player.round}`;
      if (player.dice > 0) {
        mess += `${NL}Your actual dice: ${player.dice}`;
      }
      mess += `${NL}The Opponents : ${NL}`;
      // Consider building this list more dynamically and only showing relevant opponent info
      for (const oppNumber in customerList) {
        if (customerList[oppNumber].isPlayer && oppNumber !== memberNumber) {
          mess += `${customerList[oppNumber].name} ${customerList[oppNumber].dice}${NL}`;
        }
      }
    } else {
      mess += `${NL}You are not playing.`;
    }
    mess += `${NL}Chips: ${player.chips}${NL}Points: ${player.points}${NL}Total Points gained: ${player.totalPointsGained}${NL}Punishment Points: ${player.punishmentPoints}`;
  }

  if (!isRegistered) {
    mess += `${NL}You are not registered in the game. I will run the "Welcome" procedure for you.`;
    checkParticipant(sender); // Assuming this function exists
  }
  mess += `${NL}--------------------*`;
  ServerSend("ChatRoomChat", { Content: mess, Type: "Whisper", Target: memberNumber });
  checkCharacterPlace(sender);
}

function statusMessage() {
  checkRoomForParticipants();
  checkCharacterPlace(Player);
  mess = `*--------------------` +
    NL + `round :` + game.round +
    NL + ` status ` + game.status +
    NL + `--------------------` + NL;
  mess = mess + "Player : " + NL;
  for (memberNumber in customerList) {
    if (customerList[memberNumber].isPlayer)
      mess = mess + " " + customerList[memberNumber].name + " totl. points: " + customerList[memberNumber].totalPointsGained + NL;
  }
  mess = mess + "Watcher : " + NL;
  for (memberNumber in watcherList) {
    if (memberNumber != Player.MemberNumber)
      mess = mess + " " + watcherList[memberNumber].name + " " + watcherList[memberNumber].totalPointsGained + NL;
  }
  mess = mess + "NoPlayer : " + NL;
  for (memberNumber in customerList) {
    if ((!customerList[memberNumber].isPlayer) && (memberNumber != Player.MemberNumber))
      mess = mess + " " + customerList[memberNumber].name + " " + customerList[memberNumber].totalPointsGained + NL;
  }
  mess = mess + `--------------------` + NL;
  ServerSend("ChatRoomChat", { Content: mess, Type: "Emote", Target: Player.MemberNumber });
  checkGame(game, customerList);
}

function releaseCharacters(lowerCaseMsg) {
  all = false;
  done = false;
  if (lowerCaseMsg.endsWith("all")) {
    all = true;
  }
  for (var D = 0; D < ChatRoomCharacter.length; D++) {
    if (lowerCaseMsg.endsWith(charname(ChatRoomCharacter[D]).toLowerCase()) || all) {
      if (ChatRoomCharacter[D].MemberNumber in watcherList && (ChatRoomCharacter[D].MemberNumber != Player.MemberNumber)) {
        releaseWatcher(ChatRoomCharacter[D].MemberNumber);
        console.log("released: " + charname(ChatRoomCharacter[D]));
        done = true;
      }
      else
        // freeAllCustomers
        if (ChatRoomCharacter[D].MemberNumber in customerList && (ChatRoomCharacter[D].MemberNumber != Player.MemberNumber)) {
          releaseCustomer(ChatRoomCharacter[D].MemberNumber)
          console.log("Customer released: " + charname(ChatRoomCharacter[D]));
          done = true;
        }
        else
          // freeAllunknown
          if (ChatRoomCharacter[D].MemberNumber != Player.MemberNumber) {
            free(ChatRoomCharacter[D], update = false, reapplyCloth = true)
            console.log("visitor is released: " + charname(ChatRoomCharacter[D]));
            done = true;
          }
      // else Player
    }
  }
  if (!done)
    console.log("no one released: ");
  else
    ChatRoomUpdateDisplay()
  return;
}

// Helper function for the "buggy" command to keep commandHandler cleaner
function handleBuggyBotState() {
  let dressColor = "";
  // Find the first color from HairFront, assuming it's an array of colors
  for (const item of Player.Appearance) {
    if (item.Asset && item.Asset.Group && item.Asset.Group.Name === 'HairFront' && item.Color) {
      dressColor = Array.isArray(item.Color) ? item.Color[0] : item.Color;
      break;
    }
  }

  freeAll(true); // Assuming freeAll exists and works
  // Apply various restraints and gag items
  InventoryWear(Player, "Irish8Cuffs", "ItemFeet", dressColor, 24);
  InventoryWear(Player, "SeamlessHobbleSkirt", "ItemLegs", dressColor, 24);
  InventoryWear(Player, "BalletWedges", "ItemBoots", dressColor, 16);
  InventoryWear(Player, "DeepthroatGag", "ItemMouth", dressColor, 15);
  InventoryWear(Player, "HarnessPanelGag", "ItemMouth2", dressColor, 16);
  InventoryWear(Player, "StitchedMuzzleGag", "ItemMouth3", dressColor, 15);
  InventoryWear(Player, "ArmbinderJacket", "ItemArms", [dressColor, "#0A0A0A", "Default"], 22);
  InventoryWear(Player, "KirugumiMask", "ItemHood", ["#9A7F76", "Default", "Default", dressColor], 25);

  // Set properties for the hood item
  const hoodItem = InventoryGet(Player, "ItemHood");
  if (hoodItem) {
    hoodItem.Property = {
      "Type": "e2m3b1br0op2ms0",
      "Difficulty": 15,
      "Effect": ["BlindHeavy", "Prone", "BlockMouth"],
      "Hide": ["Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "Mask", "ItemHead"],
      "HideItem": ["ItemHeadSnorkel"]
    };
  }
  ServerSend("ChatRoomChat", { Content: "I am buggy, please punish me", Type: "Chat" });
  ChatRoomCharacterUpdate(Player);
}



function kick(characterToKick) {
  const characterMemberNumber = characterToKick.MemberNumber;
  const defaultColor = "#bbbbbb"; // Example: define colors as constants

  // Free the character (assuming 'free' function exists and handles updates)
  free(characterMemberNumber, true);

  ServerSend("ChatRoomChat", { Content: "*Take care", Type: "Emote", Target: characterMemberNumber });

  // Apply restraints
  InventoryWear(characterToKick, "ArmbinderJacket", "ItemArms", [defaultColor, "#000000", defaultColor], 50);
  // Ensure the item is retrieved after it's worn for locking
  const armbinder = InventoryGet(characterToKick, "ItemArms");
  if (armbinder) {
    InventoryLock(characterToKick, armbinder, { Asset: AssetGet("Female3DCG", "ItemMisc", "MistressTimerPadlock") }, Player.MemberNumber);
    armbinder.Property.RemoveItem = true;
  }

  // Optional removals (commented out in original, so kept commented)
  // InventoryRemove(characterToKick, "ItemPelvis");
  // InventoryRemove(characterToKick, "ItemVulva");
  // InventoryRemove(characterToKick, "ItemButt");

  ChatRoomCharacterUpdate(characterToKick);
  ChatRoomAdminChatAction("Kick", characterMemberNumber.toString());
}

function getTargetCharacter(dictionaryObject) {
  // Assuming dictionaryObject is an array-like structure
  for (const item of dictionaryObject) {
    if (item.TargetCharacter != null) { // Using != null to also catch undefined
      return item.TargetCharacter;
    }
  }
  return ""; // Return empty string if no target found
}




function increaseRound() {
  // Check Winner 
  lastWomanStanding = false;
  winner = false;
  count = 0
  for (memberNumber in customerList) {
    char = charFromMemberNumber(memberNumber)
    if (char == null) continue
    if (customerList[memberNumber].isPlayer && customerList[memberNumber].round == game.round && customerList[memberNumber].chips > 0) {
      winnerNumber = memberNumber
      count++
    }
    // greet looser
    if (customerList[memberNumber].isPlayer && customerList[memberNumber].round == game.round && customerList[memberNumber].chips <= 0) {
      ServerSend("ChatRoomChat", { Content: customerList[memberNumber].name + ", you lost the game. A point is subtracted, Stay here, waiting for the winner.", Type: "Whisper", Target: char.MemberNumber });
      ServerSend("ChatRoomChat", { Content: customerList[memberNumber].name + " is out", Type: "Chat" });
      // Out 
      //InventoryWear( char, "WoodenSign", "ItemMisc", ["#F00","#B11BDB","#000"], 50)
      //InventoryGet( char, "ItemMisc").Property.Text="Game Lost"
      //InventoryGet( char, "ItemMisc").Property.Text2="No dice"
      checkSign(char, "out")
      customerList[memberNumber].totalPointsGained--
    }
  }
  if (count == 0) {
    ServerSend("ChatRoomChat", { Content: "All is lost, since I cannot determine any winner. We continue with your punishment", Type: "Chat" });
    punishmentAll()
  }
  if (count == 1) {
    mess = `We have a winner ! ` + NL + `****************************` +
      NL + `LastWomanStanding : ` + customerList[winnerNumber].name +
      NL + `****************************`
    ServerSend("ChatRoomChat", { Content: mess, Type: "Chat" })
    game.status = "end"
    customerList[memberNumber].winNum++
    winningCeremony(winnerNumber);
  }
  if (count > 1) {
    // increase Round
    oldround = game.round
    round = oldround + 1
    game.round = round
    msg = " Active Players : "
    for (memberNumber in customerList) {
      if (customerList[memberNumber].isPlayer && customerList[memberNumber].round == oldround && customerList[memberNumber].chips > 0) {
        customerList[memberNumber].round = round
        customerList[memberNumber].dice = 0
        msg = msg + customerList[memberNumber].name + ", "
      }
    }
    ServerSend("ChatRoomChat", { Content: msg, Type: "Emote" });
    ServerSend("ChatRoomChat", { Content: "*********** New Round ********************", Type: "Emote" });
    ServerSend("ChatRoomChat", { Content: "Round " + round + " starts now", Type: "Chat" });
    ServerSend("ChatRoomChat", { Content: '[to dice: "/dice 100]', Type: "Emote" });
  }
}

function checkKickOut(sender) {
  //if sender.isWatcher
  if (sender.IsRestrained() && !sender.CanTalk() && sender.IsKneeling() && (sender.MemberNumber in watcherList)) {
    console.log(charname(sender) + " is watching")
    ServerSend("ChatRoomChat", { Content: "You are a lucky one. Be quite and have fun", Type: "Emote", Target: sender.MemberNumber });
  }
  else {

    warnmsg = checkRequirements(sender)
    if (warnmsg != "ok") {
      console.log(charname(sender) + " kickout")
      ServerSend("ChatRoomChat", { Content: "bye", Type: "Emote", Target: sender.MemberNumber })
      ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())
    }

  }
}

function kickOutOrWatch(warnmsg, sender) {
  ServerSend("ChatRoomChat", { Content: warnmsg, Type: "Whisper", Target: sender.MemberNumber });
  ServerSend("ChatRoomChat", { Content: "*[You can become a quite watcher. You can whisper #watch, Otherwise you will be kicked in 30 seconds. You can change and come back if you want.]", Type: "Emote", Target: sender.MemberNumber });
  setTimeout(function (sender) { checkKickOut(sender) }, 30 * 1000, sender)
}

function enterLeaveEvent(sender, msg) {
  if (sender.MemberNumber.toString() == Player.MemberNumber.toString()) { console.log(charname(sender) + " is back") }
  else {
    checkParticipant(sender)
    console.log(charname(sender) + " ENTERED")
  }
}


function checkRequirements(char) {
  //??? enhance check for more restraints 
  if (char.ItemPermission > 2) {
    warnmsg = "*[To play here you have to lower your PERMISSION.]";
  }
  else if (InventoryBlockedOrLimitedCustomized(char, AssetGet("Female3DCG", "ItemNeckRestraints", "CollarChainLong")) || InventoryBlockedOrLimitedCustomized(char, AssetGet("Female3DCG", "ItemNeck", "LeatherChoker"))) {
    warnmsg = "*[To play here you have to give PERMISSION to use the COLLAR CHAIN LONG and the LEATHER CHOCKER.]";
  } else if (InventoryBlockedOrLimitedCustomized(char, AssetGet("Female3DCG", "ItemArms", "ArmbinderJacket")) || InventoryBlockedOrLimitedCustomized(char, AssetGet("Female3DCG", "ItemMouth", "BallGag")) || InventoryBlockedOrLimitedCustomized(char, AssetGet("Female3DCG", "ItemHead", "LeatherBlindfold")) || InventoryBlockedOrLimitedCustomized(char, AssetGet("Female3DCG", "ItemLegs", "LegBinder"))) {
    warnmsg = "*[To play here you have to give PERMISSION to use the ARMBINDER JACKET, the BALL GAG, the LEATHER BLINDFOLD and the LEG BINDER.]";
    //} else if (char.ArousalSettings != null && char.ArousalSettings.Active != "Hybrid" && char.ArousalSettings.Active != "Automatic") {
    //  ServerSend("ChatRoomChat", { Content: "*[To play here you have to set the preference for sexual the activities to hybrid or automatic (locked). You will be kicked in 30 seconds. You can change and comeback if you want.]", Type: "Emote", Target: char.MemberNumber} );
    //  setTimeout(function(char) {ChatRoomAdminChatAction("Kick", char.MemberNumber.toString())}, 30*1000, char)
  } else
    if (InventoryBlockedOrLimitedCustomized(char, AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock"))) {
      warnmsg = "*[To play here you have to give PERMISSION to use the Combination Padlock.]";
    }
    else
      warnmsg = "ok"
  return warnmsg
}

function checkParticipant(char) {
  warnmsg = checkRequirements(char)
  if (warnmsg != "ok")
    kickOutOrWatch(warnmsg, char)
  else {
    memberNumber = char.MemberNumber
    if (Player.MemberNumber != memberNumber)
      if (memberNumber in watcherList) {
        prepareWatcher(char)
      } else
        if (memberNumber in customerList) {
          checkSub(char)
        }
        else {
          //load from local space
          personContent = getCharResult(memberNumber)
          charIsKnown = reconvertPers(personContent, char)
          if (!charIsKnown) {
            if (isExposed(char) || char.IsRestrained() || CharacterIsInUnderwear(char) || char.IsShackled() || char.IsBlind() || !char.CanTalk() || char.IsEnclose() || char.IsMounted() || char.IsDeaf()) {
              warnmsg = "*[To play here you have to be UNRESTRAINED and fully DRESSED (check your panties too). You will be kicked in 30 seconds. You can change and comeback if you want.]"
              kickOutOrWatch(warnmsg, char)
              //if (isExposed(char) || char.IsRestrained() || CharacterIsInUnderwear(char) || char.IsShackled() || char.IsBlind() || !char.CanTalk() || char.IsEnclose() || char.IsMounted() || char.IsDeaf()) {
              //  warnmsg = "*[you are not worth to play, you have to watch]"
              //  newWatcher(char)
              //  ServerSend("ChatRoomChat", { Content: warnmsg, Type: "Emote", Target: char.MemberNumber });
            } else {
              //realy new Customer
              newCustomer(char)
              msg = "*[RULES: Check " + charname(Player) + " BIO to see all the rules and commands. Have fun.]"
              customerList[char.MemberNumber].linkedTo = 0
              customerList[char.MemberNumber].isPlayer = false
            }
          }
          else {
            msg = charname(char) + ", welcome back!"
            msg = msg + NL + "[Remember: Check " + charname(Player) + " BIO. Have fun.]"
            checkSub(char)

          }
          if (game.status != "off" && game.status != "end" && game.status != "playerSelection") {
            msg = msg + NL + "A Game is already running. Please wait until I am ready for a new game."
            // ServerSend("ChatRoomChat", { Content: "A Game is already running. Please wait until I am ready for a new game.", Type: "Whisper", Target: char.MemberNumber });
          }
          //?? Bug :Msg could be null
          ServerSend("ChatRoomChat", { Content: msg, Type: "Whisper", Target: memberNumber });
          ChatRoomCharacterUpdate(char)

        }
  }
}


function stackPay(targetMemberNumber, chipsLost) {
  for (var D = 0; D < ChatRoomCharacter.length; D++) {
    if (ChatRoomCharacter[D].MemberNumber == targetMemberNumber) {
      for (count = customerList[targetMemberNumber].chips - 1; count >= customerList[targetMemberNumber].chips - chipsLost; count--) {
        if (count == 7) {
          InventoryRemove(ChatRoomCharacter[D], "ClothOuter")
        } else if (count == 6) {
          InventoryRemove(ChatRoomCharacter[D], "Cloth")
        } else if (count == 5) {
          InventoryRemove(ChatRoomCharacter[D], "ClothLower")
        } else if (count == 4) {
          InventoryRemove(ChatRoomCharacter[D], "Bra")
          InventoryRemove(ChatRoomCharacter[D], "Panties")
          removeClothes(ChatRoomCharacter[D], true, false)
        } else if (count == 200) {
          InventoryWear(ChatRoomCharacter[D], "LeatherToeCuffs", "ItemBoots", "#000000", 50)
          InventoryLock(ChatRoomCharacter[D], InventoryGet(ChatRoomCharacter[D], "ItemBoots"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber)
          InventoryGet(ChatRoomCharacter[D], "ItemHead").Property.CombinationNumber = customerList[ChatRoomCharacter[D].MemberNumber].lockCode
        } else if (count == 3) {
          InventoryWear(ChatRoomCharacter[D], "LegBinder", "ItemLegs", ["#bbbbbb", "#000000"], 50)
          InventoryLock(ChatRoomCharacter[D], InventoryGet(ChatRoomCharacter[D], "ItemLegs"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber)
          InventoryGet(ChatRoomCharacter[D], "ItemLegs").Property.CombinationNumber = customerList[ChatRoomCharacter[D].MemberNumber].lockCode
        } else if (count == 2) {
          InventoryWear(ChatRoomCharacter[D], "BallGag", "ItemMouth", "Default", 50)
          InventoryLock(ChatRoomCharacter[D], InventoryGet(ChatRoomCharacter[D], "ItemMouth"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber)
          InventoryGet(ChatRoomCharacter[D], "ItemMouth").Property.CombinationNumber = customerList[ChatRoomCharacter[D].MemberNumber].lockCode
        } else if (count == 1) {
          InventoryWear(ChatRoomCharacter[D], "LeatherBlindfold", "ItemHead", "#000000", 50)
          InventoryLock(ChatRoomCharacter[D], InventoryGet(ChatRoomCharacter[D], "ItemHead"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber)
          InventoryGet(ChatRoomCharacter[D], "ItemHead").Property.CombinationNumber = customerList[ChatRoomCharacter[D].MemberNumber].lockCode
        } else if (count == 0) {
          if (true) {
            // Female
            InventoryWear(ChatRoomCharacter[D], "ArmbinderJacket", "ItemArms", ["#bbbbbb", "#000000", "#bbbbbb"], 50)
            InventoryLock(ChatRoomCharacter[D], InventoryGet(ChatRoomCharacter[D], "ItemArms"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber)
            InventoryGet(ChatRoomCharacter[D], "ItemArms").Property.CombinationNumber = customerList[ChatRoomCharacter[D].MemberNumber].lockCode
          }

          InventoryWear(ChatRoomCharacter[D], "LeatherChoker", "ItemNeck", ["Default", "#000000"], 50)
          InventoryLock(ChatRoomCharacter[D], InventoryGet(ChatRoomCharacter[D], "ItemNeck"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber)
          InventoryGet(ChatRoomCharacter[D], "ItemNeck").Property.CombinationNumber = customerList[ChatRoomCharacter[D].MemberNumber].lockCode


          InventoryWear(ChatRoomCharacter[D], "CollarChainShort", "ItemNeckRestraints", "Service Bot's - Loser Holder", 50)
          InventoryLock(ChatRoomCharacter[D], InventoryGet(ChatRoomCharacter[D], "ItemNeckRestraints"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber)
          InventoryGet(ChatRoomCharacter[D], "ItemNeckRestraints").Property.CombinationNumber = customerList[ChatRoomCharacter[D].MemberNumber].lockCode
        }
      }
      ChatRoomCharacterUpdate(ChatRoomCharacter[D])
    }
  }
}

function newCustomer(sender) {
  customerList[sender.MemberNumber] = new personMagicData()
  customerList[sender.MemberNumber].name = charname(sender)
  customerList[sender.MemberNumber].dice = 0
  customerList[sender.MemberNumber].round = 0

  if (ReputationCharacterGet(sender, "Dominant") < 10) {
    ServerSend("ChatRoomChat", { Content: charname(sender) + ", I am delighted that you decided to play this game. You have been chained and if you want to leave here you will have to earn your freedom.", Type: "Chat", Target: sender.MemberNumber });
    customerList[sender.MemberNumber].role = 'sub'
  } else {
    ServerSend("ChatRoomChat", { Content: "Greetings " + charname(sender) + ". Welcome to that dicing game. You can relax or play if you want.", Type: "Chat", Target: sender.MemberNumber });
    customerList[sender.MemberNumber].role = 'dom'
  }
  if (sender.MemberNumber in watcherList) {
    customerList[sender.MemberNumber].punishmentPoints = watcherList[sender.MemberNumber].punishmentPoints
    delete watcherList[sender.MemberNumber]
  }
  checkSub(sender)
}

function newWatcher(sender) {
  memorizeClothing(sender)
  watcherList[sender.MemberNumber] = new personMagicData()
  watcherList[sender.MemberNumber].name = charname(sender)
  watcherList[sender.MemberNumber].dice = 0
  watcherList[sender.MemberNumber].round = 0
  watcherList[sender.MemberNumber].role = "watcher"
  ServerSend("ChatRoomChat", { Content: charname(sender) + ", you are restrained.", Type: "Chat", Target: sender.MemberNumber });
  if (sender.MemberNumber in customerList) {
    watcherList[sender.MemberNumber].role = customerList[sender.MemberNumber].role
    watcherList[sender.MemberNumber].punishmentPoints = customerList[sender.MemberNumber].punishmentPoints
    delete customerList[sender.MemberNumber]
  }
  prepareWatcher(sender)
}


function newGame() {
  // clearTimeout(timeCheckHandle)
  game = {
    status: "off", //possible status playerSelection, dicing, end, off, reward
    playerDict: {},
    cardDict: {},
    round: 0,
    secondCard: 0,
    win: false,
    rewardTarget: 0,
    rewardOrgasmNum: 0,
    playerCount() {
      count = 0
      for (var R = 0; R < ChatRoomCharacter.length; R++) {
        memberNumber = ChatRoomCharacter[R].MemberNumber
        if (memberNumber in customerList && customerList[ChatRoomCharacter[R].MemberNumber].isPlayer) {
          count += 1
        }
      }
      return count
    }
  }
  freeAllCustomers(reapplyCloth = true);
  for (memberNumber in customerList) {
    customerList[memberNumber].dice = 0
    customerList[memberNumber].round = 0
  }
  CharacterSetActivePose(Player, "Kneel", true);
  ServerSend("ChatRoomCharacterPoseUpdate", { Pose: Player.ActivePose });
  ServerSend("ChatRoomChat", { Content: "I am ready for a new game.", Type: "Chat" });
}

function resetGame() {

  //Check if all losers are ready
  loserhandled = false;
  for (memberNumber in customerList) {
    loserhandled = loserhandled || customerList[memberNumber].beingPunished

  }
  for (memberNumber in watcherList) {
    loserhandled = loserhandled || watcherList[memberNumber].beingPunished
  }
  if (!loserhandled) {
    // clearTimeout(timeCheckHandle)
    game.status = "off"
    game.round = 0

    freeAllCustomers(reapplyCloth = true);
    for (memberNumber in customerList) {
      customerList[memberNumber].dice = 0
      customerList[memberNumber].round = 0
      personContent = convertPers(charFromMemberNumber(memberNumber))
      saveCharResult(memberNumber, personContent)
    }
    for (memberNumber in watcherList) {
      personContent = convertPers(charFromMemberNumber(memberNumber))
      saveCharResult(memberNumber, personContent)
    }
    //checkRoomForParticipants()
    updateRoom(RoomName, RoomDescription, RoomBackground, false, false)
    CharacterSetActivePose(Player, "Kneel", true);
    ServerSend("ChatRoomCharacterPoseUpdate", { Pose: Player.ActivePose });
    ServerSend("ChatRoomChat", { Content: "I am ready for a new game.", Type: "Chat" });
  }
  else
    setTimeout(function (Player) { resetGame() }, Math.floor(Math.random() * 3000, Player))
}

function checkRoomForParticipants() {
  for (var D = 0; D < ChatRoomCharacter.length; D++) {
    if (Player.MemberNumber != ChatRoomCharacter[D].MemberNumber) {
      checkParticipant(ChatRoomCharacter[D])
    }
  }
  //checkPosition()
}

// Places the Character at the position she has earned
function checkCharacterPlace(char) {
  loserNumber = 0
  playerNumber = 0
  nonPlayerNumber = 0
  watcherNumber = 0

  for (var D = 0; D < ChatRoomCharacter.length; D++) {
    memberNumber = ChatRoomCharacter[D].MemberNumber
    if (memberNumber in watcherList)
      if (watcherList[memberNumber].role == "loser")
        loserNumber++
      else
        watcherNumber++

    if (memberNumber in customerList)
      if (customerList[memberNumber].isPlayer)
        playerNumber++
      else
        nonPlayerNumber++

  }
  //consider Player
  watcherNumber--
  nonPlayerNumber--
  console.log("loserNumber : " + loserNumber)
  console.log("PlayerNumber : " + playerNumber)
  console.log("WatcherNumber : " + watcherNumber)
  console.log("NonPlayerNumber : " + nonPlayerNumber)

  loserPosition = 0
  ThePlayerPosition = loserNumber
  playerPosition = loserNumber + 1
  watcherPosition = playerPosition + playerNumber
  nonPlayerPosition = watcherPosition + watcherNumber


  console.log("loserPosition : " + loserPosition)
  console.log("ThePlayerPos : " + ThePlayerPosition)
  console.log("playerPos : " + playerPosition)
  console.log("WatcherPos : " + watcherPosition)
  console.log("NonPlayerPos : " + nonPlayerPosition)

  memberNumber = char.MemberNumber
  if (memberNumber in watcherList) {
    if (watcherList[memberNumber].role == "loser") {
      targetPos = loserPosition
      maxTargetPos = loserNumber - 1
      if (maxTargetPos < 0) {
        maxTargetPos = 0
        console.log("loser Number error with " + memberNumber)
      }
      role = "loser"
      //memberNumber
      sortCharacter(memberNumber, targetPos, maxTargetPos, role)
    }
    else     //Watcher
      if (Player.MemberNumber != memberNumber)  //Player 
      {
        targetPos = watcherPosition
        maxTargetPos = loserNumber + playerNumber + watcherNumber
        role = "watcher"
        //memberNumber
        sortCharacter(memberNumber, targetPos, maxTargetPos, role)
      }
  }

  if (Player.MemberNumber == memberNumber) {  //Player
    sortCharacter(memberNumber, ThePlayerPosition, ThePlayerPosition, "bot")
  }
  else
    //Player
    if (memberNumber in customerList) {
      if (customerList[memberNumber].isPlayer) {
        targetPos = playerPosition
        maxTargetPos = loserNumber + playerNumber
        role = "pl"
        //memberNumber
        sortCharacter(memberNumber, targetPos, maxTargetPos, role)
        //playerPosition++
      }
      else {//nonPlayer
        targetPos = nonPlayerPosition
        maxTargetPos = loserNumber + playerNumber + watcherNumber + nonPlayerNumber
        role = "np"
        //memberNumber
        sortCharacter(memberNumber, targetPos, maxTargetPos, role)
        //nonPlayerPosition++
      }
    }
}

//checks the Position of the roomVisitors
/// doesnt work , comment out all sort calls except for the player
function checkPosition() {
  // Room Order :
  //loser
  // The Player  
  // Player 
  // watcher
  // non Playing 

  loserNumber = 0
  playerNumber = 0
  nonPlayerNumber = 0
  watcherNumber = 0

  for (var D = 0; D < ChatRoomCharacter.length; D++) {
    console.log(ChatRoomCharacter[D].memberNumber + " " + charname(ChatRoomCharacter[D]))
    checkCharacterPlace(ChatRoomCharacter[D])

  }
}

function checkSign(C, role) {

  const roleColor1 = {
    "sub": "#0000FF",
    "bot": "#FFF",
    "pl": "#6C8A6C",
    "np": "#777",
    "watcher": "#852AB3",
    "loser": "#D78BEA",
    "out": "#D78BEA"
  }
  const roleColor2 = {
    "sub": "#0000FF",
    "bot": "#00F",
    "pl": "#6C8A6C",
    "np": "#000",
    "watcher": "#852AB3",
    "loser": "#D78BEA",
    "out": "#852AB3"
  }
  const roleColorRope = "#B11BDB"
  const roleText = {
    "sub": "submissive ",
    "bot": "I am BOT",
    "pl": "player",
    "np": "not playing",
    "watcher": "watcher",
    "loser": "loser",
    "out": "I am out"
  }
  const roleText2 = {
    "sub": "",
    "bot": "don't touch",
    "pl": "",
    "np": "whimp",
    "watcher": "too late to help",
    "loser": "",
    "out": " no dicing anymore"
  }
  if (C == (undefined))
    return
  console.log(C.MemberNumber + " " + role)
  //if (C.MemberNumber in watcherList) {
  // obsolete ? 
  //  if (role != "loser")
  //    role = "watcher"
  // }
  //else
  if (C.MemberNumber in customerList)
    if (customerList[C.MemberNumber].isPlayer && customerList[C.MemberNumber].chips <= 0)
      role = "out"
  InventoryWear(C, "PetPost", "ItemMisc",
    ["Default",
      roleColor1[role],
      roleColor2[role],
      "Default",
      "Default",//Postit
      roleText,
      roleText], 50)
  InventoryGet(C, "ItemMisc").Property.Text = "Role"
  InventoryGet(C, "ItemMisc").Property.Text2 = roleText[role]
  InventoryGet(C, "ItemMisc").Property.Text3 = roleText2[role]
  InventoryGet(C, "ItemMisc").Property.TypeRecord = { d: 0, m: 1, p: 1, s: 1, x: 0 }
  //InventoryGet(Player, "ItemMisc").Color=[roleColor1[role],roleColor2[role],roleColor3]
  //ChatRoomCharacterItemUpdate(C, "ItemMisc");
  //CharacterRefresh(C);
  ChatRoomCharacterUpdate(C)
}


function checkRoomForSigns() {
  console.log("----------------- checkRoomForSigns")
  for (var D = 0; D < ChatRoomCharacter.length; D++) {
    memberNumber = ChatRoomCharacter[D].MemberNumber
    console.log(memberNumber + " " + charname(ChatRoomCharacter[D]))

    if (memberNumber == Player.MemberNumber)
      role = "bot"
    else {
      if (memberNumber in watcherList)
        if (watcherList[memberNumber].role == "loser")
          role = watcherList[memberNumber].role
        else
          role = "watcher"

      if (memberNumber in customerList)
        if (customerList[memberNumber].isPlayer)
          if (customerList[memberNumber].round == game.round && customerList[memberNumber].chips <= 0)
            role = "out"
          else
            role = "pl"
        else
          role = "np"
    }
    checkSign(ChatRoomCharacter[D], role)
  }
  console.log("----------------- End of checkRoomForSigns")
}


function sortCharacter(memberNumber, targetPos, maxTargetPos, role) {
  const Pos = ChatRoomCharacter.findIndex(c => c.MemberNumber == memberNumber);
  if (Pos >= 0) {
    // Mark role
    C = ChatRoomCharacter[Pos]
    if (memberNumber in customerList)
      if (customerList[memberNumber].isPlayer && customerList[memberNumber].round == game.round && customerList[memberNumber].chips <= 0)
        checkSign(C, "out")
      else
        checkSign(C, role)

    if (memberNumber in watcherList)
      checkSign(C, role)

    if (((Pos > maxTargetPos) || (Pos < targetPos))) {
      while (targetPos < maxTargetPos) {
        targetMemberNumber = ChatRoomCharacter[targetPos].MemberNumber
        targetrole = "nothing"
        if (targetMemberNumber in watcherList)
          if (watcherList[targetMemberNumber].role == "loser")
            targetroleOut = watcherList[targetMemberNumber].role
          else
            targetroleOut = "watcher"

        if (targetMemberNumber in customerList) {
          targetrole = customerList[targetMemberNumber].role

          if (customerList[targetMemberNumber].isPlayer)
            targetroleOut = "pl"
          else targetroleOut = "np"
        }

        if ((targetPos < maxTargetPos) && (role == targetroleOut))
          targetPos++
        else
          break

      }


      ChatRoomCharacterViewMoveTarget = ChatRoomCharacter[targetPos].MemberNumber
      if (ChatRoomCharacterViewMoveTarget !== C.MemberNumber) {
        ServerSend("ChatRoomAdmin", {
          MemberNumber: Player.ID,
          TargetMemberNumber: ChatRoomCharacterViewMoveTarget,
          DestinationMemberNumber: C.MemberNumber,
          Action: "Swap"
        });
        ChatRoomUpdateDisplay()
      }
    }
  }
  ChatRoomCharacterViewMoveTarget = null;
}

function resetWatcherList() {
  watcherList = {}
  watcherList[Player.MemberNumber] = new personMagicData()
  watcherList[Player.MemberNumber].role = "Bot"
  watcherList[Player.MemberNumber].rules = []
}


function freeAllCustomers(reapplyCloth = false) {
  for (var R = 0; R < ChatRoomCharacter.length; R++) {
    if (ChatRoomCharacter[R].MemberNumber != Player.MemberNumber)
      if (!(ChatRoomCharacter[R].MemberNumber in watcherList)) {
        if (ChatRoomCharacter[R].MemberNumber in customerList) {
          releaseCustomer(ChatRoomCharacter[R].MemberNumber)
        }
      }
      else {
      }
  }
}


function rewardPhase1() {
  ServerSend("ChatRoomChat", { Content: customerList[game.rewardTarget].name + ", I am sure you will love the mysterius reward you earned.", Type: "Chat" });
  ServerSend("ChatRoomChat", { Content: "But before I can give it to you, you should wear something more approriate for the winner.", Type: "Chat" });
  ServerSend("ChatRoomChat", { Content: "*The clothes are immediately stripped from " + customerList[game.rewardTarget].name + " and a leg binder blocks her from running away.", Type: "Emote" });
  for (var D = 0; D < ChatRoomCharacter.length; D++) {
    if (ChatRoomCharacter[D].MemberNumber == game.rewardTarget) {
      InventoryRemove(ChatRoomCharacter[D], "ClothOuter")
      InventoryRemove(ChatRoomCharacter[D], "Cloth")
      InventoryRemove(ChatRoomCharacter[D], "ClothLower")
      InventoryRemove(ChatRoomCharacter[D], "Bra")
      InventoryRemove(ChatRoomCharacter[D], "Panties")
      InventoryWear(ChatRoomCharacter[D], "LegBinder", "ItemLegs", ["#C3CB3F", "#000000"], 50)
      InventoryLock(ChatRoomCharacter[D], InventoryGet(ChatRoomCharacter[D], "ItemLegs"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber)
      InventoryGet(ChatRoomCharacter[D], "ItemLegs").Property.CombinationNumber = customerList[ChatRoomCharacter[D].MemberNumber].lockCode
      ChatRoomCharacterUpdate(ChatRoomCharacter[D])
    }
  }
  timeoutHandle = setTimeout(rewardPhase2, 30 * 1000)
}

function rewardPhase2() {
  ServerSend("ChatRoomChat", { Content: "I hope you don't mind if I use the same attire we usually use for the loser. Don't worry to show everyone that you are a winner I am going to dress you in gold!", Type: "Chat" });
  for (var D = 0; D < ChatRoomCharacter.length; D++) {
    if (ChatRoomCharacter[D].MemberNumber == game.rewardTarget) {
      InventoryWear(ChatRoomCharacter[D], "ArmbinderJacket", "ItemArms", ["#C3CB3F", "#000000", "#C3CB3F"], 50)
      InventoryLock(ChatRoomCharacter[D], InventoryGet(ChatRoomCharacter[D], "ItemArms"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber)
      InventoryGet(ChatRoomCharacter[D], "ItemArms").Property.CombinationNumber = customerList[ChatRoomCharacter[D].MemberNumber].lockCode
      InventoryWear(ChatRoomCharacter[D], "LeatherBlindfold", "ItemHead", "#000000", 50)
      InventoryLock(ChatRoomCharacter[D], InventoryGet(ChatRoomCharacter[D], "ItemHead"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber)
      InventoryGet(ChatRoomCharacter[D], "ItemHead").Property.CombinationNumber = customerList[ChatRoomCharacter[D].MemberNumber].lockCode
      ChatRoomCharacterUpdate(ChatRoomCharacter[D])
    }
  }
  timeoutHandle = setTimeout(rewardPhase3, 30 * 1000)
}

function rewardPhase3() {
  ServerSend("ChatRoomChat", { Content: "You are really cute dear " + customerList[game.rewardTarget].name, Type: "Chat" });
  ServerSend("ChatRoomChat", { Content: "And finally, now that you are ready, you can receive your deserved reward!", Type: "Chat" });
  for (var D = 0; D < ChatRoomCharacter.length; D++) {
    if (ChatRoomCharacter[D].MemberNumber == game.rewardTarget) {
      InventoryWear(ChatRoomCharacter[D], "VibratingDildo", "ItemVulva", "Default")
      InventoryGet(ChatRoomCharacter[D], "ItemVulva").Property = { Mode: "Maximum", Intensity: 3, Effect: ["Egged", "Vibrating"] }
      ChatRoomCharacterUpdate(ChatRoomCharacter[D])
    }
  }
  timeoutHandle = setTimeout(rewardPhase4, 30 * 1000)
}

function rewardPhase4() {
  ServerSend("ChatRoomChat", { Content: "Girls, let's work together to give our lovely " + customerList[game.rewardTarget].name + " a lot of orgasm!", Type: "Chat" });
  ServerSend("ChatRoomChat", { Content: "I am sure that if you work all together you can give her pleasure that she would have not hoped for!", Type: "Chat" });
  ServerSend("ChatRoomChat", { Content: "*[Give " + customerList[game.rewardTarget].name + " 3 orgasms]", Type: "Emote" });
}


function checkSub(sender) {
  // Check auf Sub and handle her 

  if (sender.MemberNumber in customerList)
    if (customerList[sender.MemberNumber].role == "sub") {
      // the "halsband"
      //if (!sender.IsOwned()) {
      InventoryWear(sender, "LeatherChoker", "ItemNeck", ["Default", "#000000"], 50)
      //only if it is allowed to 
      InventoryLock(sender, InventoryGet(sender, "ItemNeck"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber)
      InventoryGet(sender, "ItemNeck").Property.CombinationNumber = customerList[sender.MemberNumber].lockCode
      //}
      //to do .... the crafted one

      InventoryWear(sender, "CollarChainLong", "ItemNeckRestraints", "Service Bot's - Sub Holder", 50)
      InventoryLock(sender, InventoryGet(sender, "ItemNeckRestraints"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber)
      InventoryGet(sender, "ItemNeckRestraints").Property.CombinationNumber = customerList[sender.MemberNumber].lockCode
      ChatRoomCharacterUpdate(sender)
    }
}


function winningCeremony(winnerNumber) {
  ServerSend("ChatRoomChat", { Content: "*Winner gets released ", Type: "Chat" });
  customerList[winnerNumber].punishmentPoints = 0
  customerList[winnerNumber].points++
  customerList[winnerNumber].totalPointsGained += customerList[winnerNumber].points
  customerList[winnerNumber].points = 0
  winner = charFromMemberNumber(winnerNumber)
  removeRestrains(winner)
  reapplyClothing(winner, true)
  checkSub(winner)
  ChatRoomCharacterUpdate(winner)
  //*taking Photo 
  // handle Punishment points
  punishmentAll()
}


function punishmentAll() {
  countps = 0
  for (var D = 0; D < ChatRoomCharacter.length; D++) {
    if (ChatRoomCharacter[D].MemberNumber in customerList)
      if (customerList[ChatRoomCharacter[D].MemberNumber].punishmentPoints > 0) {
        customerList[ChatRoomCharacter[D].MemberNumber].beingPunished = true
        removeClothes(ChatRoomCharacter[D], true, false)
        ServerSend("ChatRoomChat", { Content: "You earned a punishment.", Type: "Whisper", Target: ChatRoomCharacter[D].MemberNumber });
        if (ChatRoomCharacter[D].HasVagina()) {
          InventoryWear(ChatRoomCharacter[D], "VibratingDildo", "ItemVulva", "Default")
          InventoryGet(ChatRoomCharacter[D], "ItemVulva").Property = { Mode: "Maximum", Intensity: 3, Effect: ["Egged", "Vibrating"] }
        }
        if (ChatRoomCharacter[D].HasPenis()) {
          InventoryWear(ChatRoomCharacter[D], "VibratingEgg", "ItemVulva", "Default")
          InventoryGet(ChatRoomCharacter[D], "ItemVulva").Property = { Mode: "Maximum", Intensity: 3, Effect: ["Egged", "Vibrating"] }
        }
        ChatRoomCharacterUpdate(ChatRoomCharacter[D])
        countps++
      }
    // handle watchers
    if (ChatRoomCharacter[D].MemberNumber in watcherList)
      if (watcherList[ChatRoomCharacter[D].MemberNumber].punishmentPoints > 0) {
        watcherList[ChatRoomCharacter[D].MemberNumber].beingPunished = true
        removeClothes(ChatRoomCharacter[D], true, false)
        ServerSend("ChatRoomChat", { Content: "You fool misbehaved. You will be punished.", Type: "Whisper", Target: ChatRoomCharacter[D].MemberNumber });
        InventoryWear(ChatRoomCharacter[D], "VibratingEgg", "ItemVulva", "Default")
        InventoryGet(ChatRoomCharacter[D], "ItemVulva").Property = { Mode: "Deny", Intensity: 8, Effect: ["Egged", "Vibrating"] }
        ChatRoomCharacterUpdate(ChatRoomCharacter[D])
        countps++
      }
  }
  if (countps == 0) {
    ServerSend("ChatRoomChat", { Content: "Good girls, no punishment needed!", Type: "Chat" });
    game.status = "winners"
    setTimeout(function (Player) { checkWinners() }, Math.floor(Math.random() * 3000 + 5000, Player))
  }
  else {
    ServerSend("ChatRoomChat", { Content: "It is punishment time!", Type: "Emote" });
    InventoryWear(Player, "HeartCrop", "ItemHandheld", "#CCF6B7")
    //punishment crop
    ChatRoomCharacterUpdate(Player)
    setTimeout(function (Player) { choosePunishment() }, Math.floor(Math.random() * 6000 + 5000, Player))
  }
}

function choosePunishment() {
  var emptyWatcher = 0
  for (memberNumber in watcherList) {
    if (watcherList[memberNumber].beingPunished) {
      emptyWatcher++
      char = charFromMemberNumber(memberNumber)
      ServerSend("ChatRoomChat", { Content: charname(char) + ": " + watcherList[memberNumber].punishmentPoints + " punishmentPoints", Type: "Whisper", Target: char.MemberNumber })
      spankCustomer(memberNumber)
      watcherList[memberNumber].punishmentPoints--
      if (watcherList[memberNumber].punishmentPoints <= 0) {
        ServerSend("ChatRoomChat", { Content: "Your punishment for misbehaving is done", Type: "Whisper", Target: char.MemberNumber });
        InventoryGet(char, "ItemVulva").Property = { Mode: "Edge", Intensity: 2, Effect: ["Egged", "Vibrating"] }
        watcherList[memberNumber].beingPunished = false
      }

    }
  }
  for (memberNumber in customerList) {
    if (customerList[memberNumber].beingPunished) {
      emptyWatcher++
      delinquent = charFromMemberNumber(memberNumber)
      console.log(charname(delinquent) + ": " + customerList[memberNumber].punishmentPoints + "  stroke")
      ServerSend("ChatRoomChat", { Content: "it hurts me, too", Type: "Whisper", Target: delinquent.MemberNumber });
      spankCustomer(memberNumber)
      customerList[memberNumber].punishmentPoints--
      if (customerList[memberNumber].punishmentPoints <= 0) {
        //ServerSend("ChatRoomChat", { Content: "Your punishment for misbehaving is done", Type: "Whisper", Target: char.MemberNumber });
        ServerSend("ChatRoomChat", { Content: "Another punishment for misbehaving is done", Type: "Chat" });
        customerList[memberNumber].beingPunished = false
      }
    }
  }

  if (emptyWatcher == 0) {
    InventoryRemove(Player, "ItemHandheld")
    ChatRoomCharacterUpdate(Player)
    ServerSend("ChatRoomChat", { Content: "All punishment is applied, is there an other reward ? ", Type: "Chat" });
    setTimeout(function (Player) { checkWinners() }, Math.floor(Math.random() * 9000 + 3000, Player))
  } else
    //timeoutHandle = setTimeout(choosePunishment, Math.floor(Math.random() * 40) * 1000)
    setTimeout(function (Player) { choosePunishment() }, Math.floor(Math.random() * 10000 + 500, Player))
  return true
}


function spankCustomer(memberNumber) {
  char = charFromMemberNumber(memberNumber)
  //ServerSend("ChatRoomChat", { Content: "it hurts me, too", Type: "Whisper", Target: char.MemberNumber });
  ServerSend("ChatRoomChat", { Content: "One Punishment for " + charname(char), Type: "Chat" });
  targetGroup = ActivityGetGroupOrMirror(Player.AssetFamily, "ItemButt")
  activity = ActivityAllowedForGroup(char, "ItemButt").find(function (obj) {
    return obj.Activity.Name == "SpankItem";
  })
  if (activity == null) {
    activity = ActivityAllowedForGroup(char, "ItemButt").find(function (obj) {
      return obj.Activity.Name == "Kick";
    })
    if (activity == null)
      activity = ActivityAllowedForGroup(char, "ItemButt").find(function (obj) {
        return obj.Activity.Name == "Spank";
      })
  }
  if (activity != null)
    ActivityRun(Player, char, targetGroup, activity)
  else
    console.log(memberNumber, " spanking is not possible")
}

function handleLoser(memberNumber) {
  delinquent = charFromMemberNumber(memberNumber)
  memberName = " "
  if (delinquent != null) {
    memberName = charname(delinquent)
    ServerSend("ChatRoomChat", { Content: "Poor " + memberName + "! Your fate is certain ! ", Type: "Chat" });
    ServerSend("ChatRoomChat", { Content: memberName + ", Now you will pay with your freedom. Your enslavement starts now", Type: "Whisper", Target: delinquent.MemberNumber });
    targetGroup = ActivityGetGroupOrMirror(Player.AssetFamily, "ItemHead")
    activity = ActivityAllowedForGroup(Player, "ItemHead").find(function (obj) {
      return obj.Activity.Name == "Slap";
    }
    )
    if (activity == null) {
      targetGroup = ActivityGetGroupOrMirror(Player.AssetFamily, "ItemBoots")
      activity = ActivityAllowedForGroup(Player, "ItemBoots").find(function (obj) {
        return obj.Activity.Name == "Spank";
      })
      if (activity == null) {
        activity = ActivityAllowedForGroup(Player, "ItemBoots").find(function (obj) {
          return obj.Activity.Name == "Tickle";
        })
      }

    }
    if (activity != null)
      ActivityRun(Player, delinquent, targetGroup, activity)
    console.log(charname(delinquent) + " gets enslaved")

    if (memberNumber in customerList) {
      customerList[memberNumber].role = "loser"
      newWatcher(delinquent)
      delete customerList[memberNumber]

    }
    if (memberNumber in watcherList) {
      watcherList[memberNumber].role = "loser"
    }
    else
      console.log("error in watcherList" + memberNumber)
    checkCharacterPlace(delinquent)
    checkSign(delinquent, "loser")
  } else
    console.log(memberNumber + ' not found for handling Loser ')
}


function checkWinners() {
  loserReward = false
  for (var D = 0; D < ChatRoomCharacter.length; D++) {
    if (!(ChatRoomCharacter[D].MemberNumber in customerList)) { continue }
    if (customerList[ChatRoomCharacter[D].MemberNumber].role == "sub") {
      //enslavement
      if (customerList[ChatRoomCharacter[D].MemberNumber].totalPointsGained <= ENSLAVEMENT_POINTS) {
        ServerSend("ChatRoomChat", { Content: charname(ChatRoomCharacter[D]) + ", seems that you have nothing else to give. Bad luck!", Type: "Chat" });
        loserNumber = ChatRoomCharacter[D].MemberNumber
        customerList[ChatRoomCharacter[D].MemberNumber].beingPunished = true
        //loserList[D] = loserNumber      
        loserList.push(loserNumber)
        loserReward = true
      } else if (customerList[ChatRoomCharacter[D].MemberNumber].totalPointsGained >= SUB_TO_DOM_POINTS) {
        ServerSend("ChatRoomChat", { Content: "Congratulations " + charname(ChatRoomCharacter[D]) + "! You got " + SUB_TO_DOM_POINTS + " wins. You have earned your freedom. You can leave free or you can continue playing as if you were a domme.", Type: "Chat" });
        ServerSend("ChatRoomChat", { Content: "(Private) Your lock code is: " + customerList[ChatRoomCharacter[D].MemberNumber].lockCode, Type: "Whisper", Target: ChatRoomCharacter[D].MemberNumber });
        customerList[ChatRoomCharacter[D].MemberNumber].isPlayer = false
        customerList[ChatRoomCharacter[D].MemberNumber].role = "dom"
        customerList[ChatRoomCharacter[D].MemberNumber].totalPointsGained = 0
        customerList[ChatRoomCharacter[D].MemberNumber].winNum = 0
        loserReward = true
      }
    } else {
      if (customerList[ChatRoomCharacter[D].MemberNumber].totalPointsGained >= DOM_WIN_REWARD) {
        ServerSend("ChatRoomChat", { Content: "Congratulations " + charname(ChatRoomCharacter[D]) + "! You got " + domWinReward + " wins. You have earned the rights to a special reward! When you want to get your reward just use the command '#reward'.", Type: "Chat" });
        loserReward = true
      }
      if ((customerList[ChatRoomCharacter[D].MemberNumber].role == "dom") && (customerList[ChatRoomCharacter[D].MemberNumber].totalPointsGained <= (SUB_TO_DOM_POINTS * -1))) {
        ServerSend("ChatRoomChat", { Content: charname(ChatRoomCharacter[D]) + " is degraded to a sub", Type: "Chat" });
        ServerSend("ChatRoomChat", { Content: "I am sorry " + charname(ChatRoomCharacter[D]) + "! Too many lost games. You have lost partly your freedom. You can't leave anymore but you can continue playing to gain freedom back", Type: "Chat", Target: ChatRoomCharacter[D].MemberNumber });
        ServerSend("ChatRoomChat", { Content: " .... A chain is waiting for you ....", Type: "Emote", Target: ChatRoomCharacter[D].MemberNumber });
        customerList[ChatRoomCharacter[D].MemberNumber].isPlayer = false
        customerList[ChatRoomCharacter[D].MemberNumber].role = "sub"
        customerList[ChatRoomCharacter[D].MemberNumber].winNum = 0
        customerList[ChatRoomCharacter[D].MemberNumber].totalPointsGained = 0
        checkSub(ChatRoomCharacter[D])
        loserReward = true
      }
    }
    ChatRoomCharacterUpdate(ChatRoomCharacter[D])
  }

  if (loserReward)
    ServerSend("ChatRoomChat", { Content: "Hope you enjoy your reward", Type: "Chat" });
  else
    ServerSend("ChatRoomChat", { Content: "no reward", Type: "Chat" });

  game.status = "handleLosers"
}

function loserHandling(loserList) {
  if (loserList.length > 0) {
    handleLoser(loserList.shift())
    setTimeout(function (Player) { loserHandling(loserList), Math.floor(Math.random() * 2000 + 1000, Player) })
  }
  else
    setTimeout(function (Player) { resetGame() }, Math.floor(Math.random() * 6000 + 1000, Player))
}




function prepareWatcher(char) {
  InventoryWear(char, "SturdyLeatherBelts", "ItemArms", ["#11161B", "#403E40", "#11161B", "#403E40", "#11161B", "#403E40"], 50)
  InventoryLock(char, InventoryGet(char, "ItemArms"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber)
  InventoryGet(char, "ItemArms").Property.CombinationNumber = watcherList[char.MemberNumber].lockCode
  //InventoryWear(char, "LeatherBlindfold","ItemHead", "#000000",50)
  InventoryWear(char, "InteractiveVRHeadset", "ItemHead", "#000000", 50)
  InventoryLock(char, InventoryGet(char, "ItemHead"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber)
  InventoryGet(char, "ItemHead").Property.CombinationNumber = watcherList[char.MemberNumber].lockCode
  InventoryWear(char, "PantyStuffing", "ItemMouth", "#900000", 50)
  InventoryWear(char, "HarnessBallGag1", "ItemMouth2", "#000000", 50)
  InventoryWear(char, "LeatherBreastBinder", "ItemBreast", "#000000", 50)
  InventoryWear(char, "LeatherMittens", "ItemHands", "202020", 50)
  if (!char.IsOwned())
    InventoryWear(char, "LeatherChoker", "ItemNeck", "#000000", 50)
  InventoryWear(char, "LeatherHarness", "ItemTorso", "#000000", 50)
  InventoryWear(char, "LeatherChastityBelt", "ItemPelvis", "#000000", 50)
  InventoryWear(char, "SturdyLeatherBelts", "ItemLegs", "#000000", 50)
  InventoryWear(char, "SturdyLeatherBelts", "ItemFeet", "#000000", 50)
  InventoryWear(char, "LeatherToeCuffs", "ItemBoots", "#000000", 50)
  InventoryWear(char, "CollarChainShort", "ItemNeckRestraints", "Default", 50)
  //CharacterSetActivePose(char, "Kneeling", true)
  //ServerSend("ChatRoomCharacterPoseUpdate", { Pose: char.ActivePose });
  ChatRoomCharacterUpdate(char);
}

function releaseWatcher(memberNumber) {
  char = charFromMemberNumber(memberNumber)
  //target = getCharacterObject(char)
  removeRestrains(char)
  reapplyClothing(char)
  if (char.MemberNumber in watcherList) {
    if (char.MemberNumber in customerList) {
      delete watcherList[char.MemberNumber]
      customerList[memberNumber].dice = 0
      customerList[memberNumber].round = 0
    }
    else {
      newCustomer(char)
    }
  }
  ServerSend("ChatRoomChat", { Content: "*Player " + charname(char) + " released from Watching.", Type: "Emote" });
  ChatRoomCharacterUpdate(char);
}

function releaseCustomer(memberNumber) {
  char = charFromMemberNumber(memberNumber)
  removeRestrains(char)
  customerList[memberNumber].chips = WINNING_STEPS
  customerList[memberNumber].isPlayer = false;
  checkSub(char)
  //CharacterSetActivePose(ChatRoomCharacter[R], "LegsClosed", true);
  //ServerSend("ChatRoomCharacterPoseUpdate", { Pose: ChatRoomCharacter[R].ActivePose });
  if (reapplyCloth) { reapplyClothing(char) }
  ChatRoomCharacterUpdate(char)
  ServerSend("ChatRoomChat", { Content: "*Player " + charname(char) + " prepared for dicing.", Type: "Emote" });
}




function convertPers(SenderCharacter) {
  per = new (personStorageData)
  per.watcher = false
  if (memberNumber in watcherList) {
    personData = watcherList[memberNumber]
    per.watcher = true
  }
  if (memberNumber in customerList) {
    personData = customerList[memberNumber]
  }
  if (personData != null) {
    per.name = personData.name
    per.role = personData.role
    per.points = personData.points
    per.totalPointsGained = personData.totalPointsGained
    per.lockCode = personData.lockCode
    per.punishmentPoints = personData.punishmentPoints
  }
  return per
}

//Restore saved data 
function reconvertPers(personContent, char) {
  //personContent = convertPers (watcherList[memberNumber])
  if (personContent == null)
    return false
  if (personContent.watcher) {
    newWatcher(char)
    watcherList[char.MemberNumber].name = personContent.name
    watcherList[char.MemberNumber].role = personContent.role
    watcherList[char.MemberNumber].points = personContent.points
    watcherList[char.MemberNumber].totalPointsGained = personContent.totalPointsGained
    watcherList[char.MemberNumber].lockCode = personContent.lockCode
    watcherList[char.MemberNumber].punishmentPoints = personContent.punishmentPoints
  }
  else
    if (personContent.name != "") {
      //newCustomer(char)
      customerList[char.MemberNumber] = new personMagicData()
      //ServerSend("ChatRoomChat", { Content: "Restoring", Type: "Emote", Target: char.MemberNumber });
      customerList[char.MemberNumber].name = personContent.name
      customerList[char.MemberNumber].role = personContent.role
      customerList[char.MemberNumber].points = personContent.points
      customerList[char.MemberNumber].totalPointsGained = personContent.totalPointsGained
      customerList[char.MemberNumber].lockCode = personContent.lockCode
      customerList[char.MemberNumber].punishmentPoints = personContent.punishmentPoints
      checkSub(char)
    }
  return true
}

function isPunishmentPossible() {
  var isPossible = false
  //TODO ??? Enhance status 
  if (game.status == "off")
    isPossible = true
  return isPossible
}


function regularPunishmentCheck() {
  if (isPunishmentPossible(game.status)) {
    gameStatus = "regularInspection"
    punishmentAll()

  } else
    setTimeout(function (Player) { regularPunishmentCheck() }, Math.floor(Math.random() * csrPunishment + csPunishment))
}

//localstorage.getItem("keyname") 
// setItem("keyName", <string>)
//Michiru: y-you c-can either have just o-one i-item that is a-a stringified json that m-maps m-membername t-to score





// Player.Crafting.find(v => !!v && v.Name === "Service Bot's - Sub Holder")
// //Player.Crafting.find(v => v.Name === "Service Bot's - Sub Holder")


// InventoryWear(ChatRoomCharacter[2], Player.Crafting.find(v => !!v && v.Name === "Service Bot's - Sub Holder"), "ItemNeckRestraints", undefined, 50, -1, {})


// InventoryWear(ChatRoomCharacter[3], "CollarChainLong", "ItemNeckRestraints", undefined, 50, -1, {Player.Crafting.find(v => !!v && v.Name === "Service Bot's - Sub Holder")})


// InventoryWearCraft("CollarChainLong",ChatRoomCharacter[0],Player.Crafting.find(v => !!v && v.Name === "Service Bot's - Sub Holder"))

// Michiru: InventoryCraft(ChatRoomCharacter[0], ChatRoomCharacter[0], "ItemNeckRestraints", Player.Crafting[79], true, true, true)
// Look at Crafting.js at around line 1160 in the bondage club repository for some ideas


// InventoryWear(Player, "CollarChainLong", "ItemNeckRestraints", "Service Bot's - Sub Holder", 50)
// ChatRoomCharacterUpdate(Player)    