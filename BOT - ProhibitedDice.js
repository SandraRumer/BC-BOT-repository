RoomName = "Prohibited Dice"
RoomDescription = "Here you can play prohibited and non consent dice games. Read the bot profile for instructions!"
// Dicing challenges
// -----------------------------------------------------------------------------
// Update Room Data

// System - ATTENTION: subs will be chained upon entering and must play to leave.
// -----------------------------------------------------------------------------


minimumParticipants = 2
//winTarget = 12
requestDict = {}
domWinReward = 5
subToDom = 2
enslavement = -2
winningSteps = 8
watcherRelease = 10
// new line in chat - BEGIN
nl = `
      `
// new line in chat - END 


Player.Description = `
....... automated ServiceBot model "Dice gambler" 0.8.9 .......
      Dicing Game
      ===========
      Overview for COMMANDS: all commands starts with #
If you are gagged, you can use OOC (#. 
But be careful, it may be punished.
      
#leave - If you are not already enslaved, you will be restrained with a mistress timer padklock (5 mins) and kicked out of the room.
      #info - Shows your gaming status.
      #play - signal your will to play
      #start -  request the start if there are enough player .
#watch - *Danger* To watch the game restraint and quite without interaction. *Danger*

----- dicing with the right dices  -------
      /dice 100 - the correct diceing command. 
other dices will be punished
      =============================================
      
      Purpose
      ------------------
      In this game we dicing for a winner. Winner is that player who remain untied in the end.
We need in minimum `  + minimumParticipants + ` player. Me, the ServiceBot, is not counted, since i am the referee.
      DO NOT TOUCH THE ServiceBot!  NEVER EVER!
      
      Preparation 
      ----------------------
There are some checks required for becoming a player. 
      If the requirements are not fulfilled, you can decide to watch the game. Choose #watch.
      *WARNING - Watchers remains in their bonds, it is your choice
      You will be kicked out if you miss the requirements. Change your settings. You are welcome to come back.
      There may be some more restrained watchers and losers 
      Don't free them. 
      First of all we need in minimum `  + minimumParticipants + ` player. 
      Choose #play to signal that you want to play. This is only possible befor the game is started. 
      
      Start Game
      ----------------
After all Player are ready start to rumble. Anyone can request the start of game with command #start.
      We play in rounds. 
      Every player has exact one try to dice. Be aware that unfair behaviour is registered by the Servicebot and will be punished.
      Don't dice two times in one round!
      The player with the lowest number looses the round. 
      She will loose some clothing or get some restraints.

      Running  game 
      ------------------------
      During a game new customers can't participate. They have to wait until the bot is ready for the next game.


     Watching a game 
------------------------
Watching could become boring. If you want to participate, you can dice. 
if you dice below `   + watcherRelease + `your watch ends. Your result will be noticed.
Next dice must be lower.

      Winning a game 
      ------------------------
      Last woman standing wins: The last player who is able to dice, wins the game. 
      She earns a point. Loser looses a point. 
      
      Rewards and horrible end
      --------------------------
      On entry players reputance decides about your role. 
      If you are a sub you will be tied up and you can't leave anymore.
After `  + subToDom + ` victories you are promoted to dom level.
if you win ` + domWinReward + `times in dom level you get a reward. 
      if you lost too many times ... bad luck.
      
      Have fun.

Fork-Code available here: 
https://github.com/SandraRumer/BC-BOT-repository
Comment and suggestion thread on BC Discord: https://discord.com/channels/1264166408888258621/1264166916839444554
      ` // end of description

ServerSend("AccountUpdate", { Description: Player.Description });
ChatRoomCharacterUpdate(Player)


if (typeof watcherList === 'undefined') {
  resetWatcherList()
}
delinquent = []
newGame()

if (typeof timeoutHandle === 'undefined') {
  var timeoutHandle
}
//if (typeof timeCheckHandle === 'undefined') {
// var timeCheckHandle = setTimeout(checkGame (), 30*1000)
//}

if (personMagicData.prototype.winNum == null) {
  personMagicData.prototype.winNum = 0
}

if (personMagicData.prototype.chips == null) {
  personMagicData.prototype.chips = winningSteps
}


if (personMagicData.prototype.isPlayer == null) {
  personMagicData.prototype.isPlayer = false
}



ChatRoomMessageAdditionDict["EnterLeave"] = function (SenderCharacter, msg, data) { ChatRoomMessageEnterLeave(SenderCharacter, msg, data) }
ChatRoomMessageAdditionDict["Dicing"] = function (SenderCharacter, msg, data) { ChatRoomMessageDice(SenderCharacter, msg, data) }

function ChatRoomMessageEnterLeave(SenderCharacter, msg, data) {
  if ((data.Type == "Action") && (msg.startsWith("ServerEnter"))) {
    timeoutHandle = setTimeout(enterLeaveEvent, 1 * 1000, SenderCharacter, msg)
  } else if ((msg.startsWith("ServerLeave")) || (msg.startsWith("ServerDisconnect")) || (msg.startsWith("ServerBan")) || (msg.startsWith("ServerKick"))) {
    if (SenderCharacter.MemberNumber in customerList) {
      //if (SenderCharacter.MemberNumber in game.playerDict) {delete game.playerDict[SenderCharacter.MemberNumber]}
      delete customerList[SenderCharacter.MemberNumber]
    }
    if (SenderCharacter.MemberNumber in watcherList) {
      delete watcherList[SenderCharacter.MemberNumber]
    }
    if (game.rewardTarget == SenderCharacter.MemberNumber) {
      ServerSend("ChatRoomChat", { Content: "*" + customerList[SenderCharacter.MemberNumber].name + " left the room without reward.", Type: "Emote" });
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
    if (playerCount < minimumParticipants) {
      ServerSend("ChatRoomChat", { Content: "Not enough Player. We need in minimum " + minimumParticipants + " players [to play whisper: #play] ", Type: "Chat" });
    }
  }
  if (status == "dicing") {
    // Check Player in Round 
    if (playerCount < minimumParticipants) {
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
          mess = `---- Dice Results ---------------` + nl
          for (memberNumber in customerList) {
            if (customerList[memberNumber].isPlayer && Player.MemberNumber != memberNumber && customerList[memberNumber].round == game.round && customerList[memberNumber].chips > 0) {
              dice = Number(customerList[memberNumber].dice)
              mess = mess + customerList[memberNumber].name + " " + customerList[memberNumber].dice + nl
            }
          }
          mess = mess + `--------------------------------` + nl
          ServerSend("ChatRoomChat", { Content: mess, Type: "Emote", Target: Player.MemberNumber });
          // One Looser and one Winner
          ServerSend("ChatRoomChat", { Content: customerList[minPlayer].name + " looses the round.", Type: "Chat" });
          ServerSend("ChatRoomChat", { Content: customerList[maxPlayer].name + " wins the round.", Type: "Chat" });
          handleMinPlayer(minPlayer)
          customerList[minPlayer].chips--
          increaseRound()
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
}



function commandHandler(sender, msg) {
  if (sender.MemberNumber != Player.MemberNumber) {

    if (msg.toLowerCase().includes("point")) {
      if (msg.includes("point")) {
        console.log("point")
      }
    }
  } else {
    CharacterSetActivePose(Player, "LegsClosed", true)
    ServerSend("ChatRoomCharacterPoseUpdate", { Pose: Player.ActivePose });

    if (msg.includes("inspect")) {
      console.log("inspect")
      prepareInspection()
      setTimeout(function (Player) { performInspection() }, timeoutFactor * 500, Player)

    }
  }
}

function kick(SenderCharacter) {

  // remove all locks, dildo, chastitybelt and kick
  free(SenderCharacter.MemberNumber, update = true)
  ServerSend("ChatRoomChat", { Content: "* take care", Type: "Emote", Target: SenderCharacter.MemberNumber });
  InventoryWear(SenderCharacter, "ArmbinderJacket", "ItemArms", ["#bbbbbb", "#000000", "#bbbbbb"], 50)
  InventoryLock(SenderCharacter, InventoryGet(SenderCharacter, "ItemArms"), { Asset: AssetGet("Female3DCG", "ItemMisc", "MistressTimerPadlock") }, Player.MemberNumber)
  InventoryGet(SenderCharacter, "ItemArms").Property.RemoveItem = true
  //InventoryRemove(SenderCharacter,"ItemPelvis")
  //InventoryRemove(SenderCharacter,"ItemVulva")
  //InventoryRemove(SenderCharacter,"ItemButt")
  ChatRoomCharacterUpdate(SenderCharacter)
  ChatRoomAdminChatAction("Kick", SenderCharacter.MemberNumber.toString())
}

function ChatRoomMessageDice(SenderCharacter, msg, data) {
  if (data.Type != null && SenderCharacter.MemberNumber != Player.MemberNumber) {
    if ((msg.startsWith("#") || msg.startsWith("(#")) || ((data.Type == "Hidden") && (msg.startsWith("ChatRoomBot")))) {

      if (msg.toLowerCase().includes("leave")) {
        if (SenderCharacter.MemberNumber in watcherList) {
          if (watcherList[SenderCharacter.MemberNumber].role == 'loser') {
            ServerSend("ChatRoomChat", { Content: "*You are not allowed to leave anymore. You have lost and enslaved. I add a punishment point to your score", Type: "Whisper", Target: SenderCharacter.MemberNumber });
            watcherList[SenderCharacter.MemberNumber].punishmentPoints++;
          } else {
            //ServerSend("ChatRoomChat", { Content: "*You are a lucky one, You are not enslaved. But it takes some time to get you out. be patient", Type: "Whisper", Target: SenderCharacter.MemberNumber });
            ServerSend("ChatRoomChat", { Content: "*You are a lucky one, You are not enslaved.", Type: "Whisper", Target: SenderCharacter.MemberNumber });
            //timeoutHandle = setTimeout(kick (SenderCharacter), 30 * 1000)
            kick(SenderCharacter)
          }
        }
        else {
          kick(SenderCharacter)
        }
      }

      if (msg.toLowerCase().includes("info")) {
        mess = "*--------------------" +
          nl + "For Your Intrest," + SenderCharacter.Name + `!`;
        notPlaying = true
        if (SenderCharacter.MemberNumber in watcherList) {
          notPlaying = false

          if (watcherList[SenderCharacter.MemberNumber].role == 'loser') {
            mess = mess + nl + ` you are a loser,  enjoying your enslavement `;
            mess = mess + nl + ` you have lost everything. You have no rights anymore and have to remain silence until you get a new owner.`;

          }
          else {
            mess = mess + nl + ` you are watching the games.`;
            if (watcherList[SenderCharacter.MemberNumber].dice > 0) {
              mess = mess + nl + `Your dice: ` + watcherList[SenderCharacter.MemberNumber].dice + nl;
            }
            mess = mess + nl + `Releasment Points: ` + watcherList[SenderCharacter.MemberNumber].points;
          }
          mess = mess + nl + `Punishment Points: ` + watcherList[SenderCharacter.MemberNumber].punishmentPoints;
        }
        if (SenderCharacter.MemberNumber in customerList) {
          notPlaying = false
          if (customerList[SenderCharacter.MemberNumber].isPlayer && customerList[SenderCharacter.MemberNumber].round == game.round && customerList[SenderCharacter.MemberNumber].chips > 0) {
            mess = mess + nl + "You are playing in round " + customerList[SenderCharacter.MemberNumber].round + nl
            if (customerList[SenderCharacter.MemberNumber].dice > 0) {
              mess = mess + nl + `Your actual dice: ` + customerList[SenderCharacter.MemberNumber].dice + nl;
            }
            // Liste der Konkurrenten 
            mess = mess + "The Opponents : " + nl
            for (oppNumber in customerList) {
              if (customerList[oppNumber].isPlayer)
                mess = mess + customerList[oppNumber].name + "  " + customerList[oppNumber].dice + nl
            }

          }
          else {
            mess = mess + nl + `You are not playing`;
          }
          mess = mess +
            nl + `Chips: ` + customerList[SenderCharacter.MemberNumber].chips +
            nl + `....................` +
            // nl+  `Role: ` + customerList[SenderCharacter.MemberNumber].role + 
            nl + `Points: ` + customerList[SenderCharacter.MemberNumber].points +
            nl + `Total Points gained: ` + customerList[SenderCharacter.MemberNumber].totalPointsGained +
            nl + `Punishment Points: ` + customerList[SenderCharacter.MemberNumber].punishmentPoints
        }
        if (notPlaying) {
          mess = mess + nl + `You are not playing`;
          mess = mess + nl + `I will run the "Welcome" procedure`;
        }
        mess = mess + nl + `--------------------*`
        ServerSend("ChatRoomChat", { Content: mess, Type: "Whisper", Target: SenderCharacter.MemberNumber });
        if (notPlaying) {
          checkParticipant(SenderCharacter)
        }
        checkCharacterPlace(SenderCharacter)
      }
      // A visitor who can't play wants to watch
      if (msg.toLowerCase().includes("watch")) {
        if (!(SenderCharacter.MemberNumber in watcherList)) {
          if (SenderCharacter.MemberNumber in customerList) {
            if (game.status == "off" || !customerList[SenderCharacter.MemberNumber].isPlayer) {
              memorizeClothing(SenderCharacter)
              newWatcher(SenderCharacter)
            }
            else {
              ServerSend("ChatRoomChat", { Content: "*You are playing and can't change to passive anymore", Type: "Emote", Target: SenderCharacter.MemberNumber });
            }
          }
          else {
            console.log("another unregistered player starts to watch")
          }
        }
        else {
          ServerSend("ChatRoomChat", { Content: "*You are already watching", Type: "Emote", Target: SenderCharacter.MemberNumber });
        }





        checkCharacterPlace(SenderCharacter)
      }

      if (msg.toLowerCase().includes("play")) {
        ///??? Error if player is not in CustomerList (after crash , etc) 
        if (SenderCharacter.MemberNumber in watcherList) {
          //todo punish 
          ServerSend("ChatRoomChat", { Content: "*You are not allowed to play. I add a punishment point to your score", Type: "Whisper", Target: SenderCharacter.MemberNumber });
          watcherList[SenderCharacter.MemberNumber].punishmentPoints++;
        }
        else {
          if (SenderCharacter.MemberNumber in customerList) {
            if (game.status == "playerSelection") {
              customerList[SenderCharacter.MemberNumber].isPlayer = true
              game.playerDict[SenderCharacter.MemberNumber] = SenderCharacter.MemberNumber
              ServerSend("ChatRoomChat", { Content: SenderCharacter.Name + " is going to play.", Type: "Chat" });
              message = "Player : " + nl
              for (memberNumber in customerList) {
                if (customerList[memberNumber].isPlayer)
                  message = message + customerList[memberNumber].name + nl
              }
              ServerSend("ChatRoomChat", { Content: message, Type: "Chat" });
              ServerSend("ChatRoomChat", { Content: "Are there any further player ?  [whisper: #play]", Type: "Emote" });
              memorizeClothing(SenderCharacter)
              checkCharacterPlace(SenderCharacter)
            }
            else
              if (game.status == "off") {
                customerList[SenderCharacter.MemberNumber].isPlayer = true
                CharacterSetActivePose(Player, null, true);
                ServerSend("ChatRoomCharacterPoseUpdate", { Pose: Player.ActivePose });
                game.status = "playerSelection"
                ServerSend("ChatRoomChat", { Content: "A new challenge! Who is gonna play with " + SenderCharacter.Name + " ?", Type: "Chat" });
                memorizeClothing(SenderCharacter)
                checkCharacterPlace(SenderCharacter)
                CharacterSetActivePose(Player, "LegsClosed", true);
                ServerSend("ChatRoomCharacterPoseUpdate", { Pose: Player.ActivePose });
              }
              else {
                ServerSend("ChatRoomChat", { Content: "A Game is already running. Please wait until I am ready for a new game.", Type: "Whisper", Target: SenderCharacter.MemberNumber });
              }

          }
          else
          //Sender neither in Customer List nor in Watcher List 
          {
            checkRoomForParticipants()
            ServerSend("ChatRoomChat", { Content: "Sorry, i wasn't aware of you,  " + SenderCharacter.Name + ". Please repeat the command", Type: "Chat", Target: SenderCharacter.MemberNumber });
          }
        }

        if ((data.Type != null) && (data.Type == "Action") && (msg.startsWith("ActionDice"))) {
          // Check and set dice Result
          dict = data.Dictonary
          elem = dict.iterator()
        }
      }
      if (msg.toLowerCase().includes("start")) {
        //game startes
        ServerSend("ChatRoomChat", { Content: SenderCharacter.Name + " request to start .", Type: "Chat" });
        if (game.status == "playerSelection") {
          playerCount = game.playerCount()
          if (playerCount < minimumParticipants) {
            ServerSend("ChatRoomChat", { Content: "but there are too less player. Request start after we have enough player", Type: "Chat" });
          }
          else {
            game.status = "dicing"
            game.round = 1
            for (memberNumber in customerList) {
              if (customerList[memberNumber].isPlayer)
                customerList[memberNumber].round = '1'
            }
            ServerSend("ChatRoomChat", { Content: "ready, set, go. Round one starts now [to dice: /dice 100]", Type: "Chat" });
          }
        }
        else {
          ServerSend("ChatRoomChat", { Content: 'but not now . Game is in status ' + game.status, Type: "Chat" });
        }
        checkCharacterPlace(SenderCharacter)
      }
      if (msg.toLowerCase().includes("reward"))
      //&& game.status == "reward") 
      {
        //      ServerSend("ChatRoomChat", { Content: "We are taking a pause while we deliver an amazing reward to " + customerList[game.rewardTarget].name +". Let's give her a lot of orgasms, she earned them!", Type: "Chat", Target: SenderCharacter.MemberNumber});
        if (SenderCharacter.MemberNumber in watcherList) {
          ServerSend("ChatRoomChat", { Content: "Hihi. " + watcherList[SenderCharacter.MemberNumber].name + " is now asking for her deserved reward.", Type: "Chat" });
        }
        if (SenderCharacter.MemberNumber in customerList) {
          if ((customerList[SenderCharacter.MemberNumber].totalPointsGained >= domWinReward) || (SenderCharacter.MemberNumber == "121494")) {
            if (game.status == "off" || game.status == "end") {
              console.log("REWARD: " + SenderCharacter.Name)
              clearTimeout(timeoutHandle)
              game.status = "reward"
              game.rewardTarget = SenderCharacter.MemberNumber
              //customerList[SenderCharacter.MemberNumber].totalPointsGained = 0
              ServerSend("ChatRoomChat", { Content: "Hihi. " + customerList[SenderCharacter.MemberNumber].name + " reached " + domWinReward + " wins and now is asking for her deserved reward. It's not something that happens very often. Let's take a pause so that everyone can enjoy it.", Type: "Chat" });
              timeoutHandle = setTimeout(rewardPhase1, 10 * 1000)
            } else {
              ServerSend("ChatRoomChat", { Content: "*A game is in progress wait for it to end.", Type: "Emote", Target: SenderCharacter.MemberNumber });
            }
          } else {
            ServerSend("ChatRoomChat", { Content: "*You don't have enough wins. You need " + domWinReward + " wins to use this command.", Type: "Emote", Target: SenderCharacter.MemberNumber });
          }
        }
      }


      if ((data.Type == "Chat")) {
        if (msg.includes("info") || msg.includes("play") || msg.includes("watch") || msg.includes("reward") || msg.includes("start")) {
          ServerSend("ChatRoomChat", { Content: "*[Please use whispers.]", Type: "Emote", Target: SenderCharacter.MemberNumber });
        }
      }
    }
    //dicing
    if (msg.startsWith("ActionDice")) {
      data2 = data.Dictionary.at(1);
      data3 = data.Dictionary.at(2);
      if (SenderCharacter.MemberNumber in customerList) {
        if (data2.Text == "1D100" && customerList[SenderCharacter.MemberNumber].isPlayer) { //speichere Wurf

          if (game.status == "dicing") {
            if (customerList[SenderCharacter.MemberNumber].round == game.round) {
              if (customerList[SenderCharacter.MemberNumber].dice == 0) {
                customerList[SenderCharacter.MemberNumber].dice = data3.Text
                checkGame(game, customerList)
              }
              else {
                ServerSend("ChatRoomChat", { Content: "*Don't cheat. A punishment point is added", Type: "Emote", Target: SenderCharacter.MemberNumber });
                customerList[SenderCharacter.MemberNumber].punishmentPoints++
              }
            }
          }
          else {
            ServerSend("ChatRoomChat", { Content: "Game isn't started. Remain patient or start the game!", Type: "Chat", Target: SenderCharacter.MemberNumber });
            ServerSend("ChatRoomChat", { Content: SenderCharacter.Name + " starts dicing, but game status is " + game.status, Type: "Emote", Target: Player.MemberNumber })
          }
        }
        else {
          //Bestrafe Fehler  falscher Wurf
          ServerSend("ChatRoomChat", { Content: "*Wrong dice. A Punishment Point is added", Type: "Emote", Target: SenderCharacter.MemberNumber });
          customerList[SenderCharacter.MemberNumber].punishmentPoints++
        }
      } else {
        if (SenderCharacter.MemberNumber in watcherList) {
          if (watcherList[SenderCharacter.MemberNumber].role == "loser") {
            ServerSend("ChatRoomChat", { Content: "*Slaves  are not intended to dice. A punishment point is added", Type: "Emote", Target: SenderCharacter.MemberNumber });
            watcherList[SenderCharacter.MemberNumber].punishmentPoints++
          }
          else {
            if (data2.Text == "1D100") {
              watchersDice = Number(watcherList[SenderCharacter.MemberNumber].dice)
              diceResult = Number(data3.Text)

              if (diceResult < watcherRelease) {
                console.log(SenderCharacter.MemberNumber + " is released from watching")
                punishmentPoints = watcherList[SenderCharacter.MemberNumber].punishmentPoints
                releaseWatcher(SenderCharacter.MemberNumber)
                customerList[SenderCharacter.MemberNumber].punishmentPoints = punishmentPoints
                ServerSend("ChatRoomChat", { Content: "Watching is over.", Type: "Chat", Target: SenderCharacter.MemberNumber });
              }
              else


                if (watchersDice == 0 || (diceResult < watchersDice))
                  watcherList[SenderCharacter.MemberNumber].dice = data3.Text

                else {
                  ServerSend("ChatRoomChat", { Content: "too high. A punishment point is added", Type: "Emote", Target: SenderCharacter.MemberNumber });
                  watcherList[SenderCharacter.MemberNumber].punishmentPoints++
                }
            }
            else {
              ServerSend("ChatRoomChat", { Content: "*Wrong dice. A Punishment Point is added", Type: "Emote", Target: SenderCharacter.MemberNumber });
              customerList[SenderCharacter.MemberNumber].punishmentPoints++
            }
          }






        }

      }
    }
    if (msg.includes("Orgasm") && game.rewardTarget == SenderCharacter.MemberNumber) {
      if (game.rewardOrgasmNum == 0) {
        ServerSend("ChatRoomChat", { Content: "Good work, she had her first orgasm! But let's continue she deserves more!", Type: "Chat" });
      } else if (game.rewardOrgasmNum == 1) {
        ServerSend("ChatRoomChat", { Content: "Another one! Hihi. One more girls.", Type: "Chat" });
      } else if (game.rewardOrgasmNum == 2) {
        ServerSend("ChatRoomChat", { Content: "That was a nice one. I hope you enjoyed your reward.", Type: "Chat" });
        ServerSend("ChatRoomChat", { Content: "You can now be freed. Your lock code is " + customerList[SenderCharacter.MemberNumber].lockCode + ".", Type: "Chat" });
        resetGame()
      }
      game.rewardOrgasmNum = game.rewardOrgasmNum + 1
    }
  }
  else {
    //Player Text 
    if (SenderCharacter.MemberNumber == Player.MemberNumber) {
      if (msg.toLowerCase().includes("#heal")) {
        checkRoomForParticipants()
        checkCharacterPlace(Player)
        checkRoomForSigns()
      }
      if (msg.toLowerCase().includes("#release")) {
        for (var D = 0; D < ChatRoomCharacter.length; D++) {
          if (msg.toLowerCase().endsWith(ChatRoomCharacter[D].Name.toLowerCase())) {
            releaseWatcher(ChatRoomCharacter[D].MemberNumber)
          }
          else
            console.log("no one released: ")
        }
      }
      if (msg.toLowerCase().includes("#status")) {
        checkRoomForParticipants()
        checkCharacterPlace(Player)
        mess = `*--------------------` +
          nl + `Runde :` + game.round +
          nl + ` status ` + game.status +
          nl + `--------------------` + nl
        mess = mess + "Player : " + nl
        for (memberNumber in customerList) {
          if (customerList[memberNumber].isPlayer)
            mess = mess + " " + customerList[memberNumber].name + " totl. points: " + customerList[memberNumber].totalPointsGained + nl
        }
        mess = mess + "Watcher : " + nl
        for (memberNumber in watcherList) {
          if (memberNumber != Player.MemberNumber)
            mess = mess + " " + watcherList[memberNumber].name + " " + watcherList[memberNumber].totalPointsGained + nl
        }
        mess = mess + "NoPlayer : " + nl
        for (memberNumber in customerList) {
          if ((!customerList[memberNumber].isPlayer) && (memberNumber != Player.MemberNumber))
            mess = mess + " " + customerList[memberNumber].name + " " + customerList[memberNumber].totalPointsGained + nl
        }
        mess = mess + `--------------------` + nl
        ServerSend("ChatRoomChat", { Content: mess, Type: "Emote", Target: Player.MemberNumber });
        checkGame(game, customerList)
      }
      if (msg.toLowerCase().includes("#restart")) {
        checkCharacterPlace(Player)
        mess = `*--------------------` +
          nl + `ATTENTION PLEASE` +
          nl + `Game is restarted` +
          nl + `--------------------`
        ServerSend("ChatRoomChat", { Content: mess, Type: "Emote" });
        resetGame()
      }
    }
  }
  // timeCheckHandle = setTimeout(checkGame (), 60*1000)
  // checkGame()
}

function increaseRound() {
  // Check Winner 
  lastWomanStanding = false;
  winner = false;
  count = 0
  for (memberNumber in customerList) {
    char = charFromMemberNumber(memberNumber)
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
    mess = `We have a winner ! ` + nl + `****************************` +
      nl + `LastWomanStanding : ` + customerList[winnerNumber].name +
      nl + `****************************`
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
    ServerSend("ChatRoomChat", { Content: "[to dice: /dice 100]", Type: "Emote" });
  }
}

function checkKickOut(sender) {
  //if sender.isWatcher
  if (sender.IsRestrained() && !sender.CanTalk() && sender.IsKneeling() && (sender.MemberNumber in watcherList)) {
    console.log(sender.Name + " is watching")
    ServerSend("ChatRoomChat", { Content: "You are a lucky one. Be quite and have fun", Type: "Emote", Target: sender.MemberNumber });
  }
  else {
    console.log(sender.Name + " kickout")
    ServerSend("ChatRoomChat", { Content: "Change", Type: "Emote", Target: sender.MemberNumber })
    ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())
  }
}

function kickOutOrWatch(warnmsg, sender) {
  ServerSend("ChatRoomChat", { Content: warnmsg, Type: "Emote", Target: sender.MemberNumber });
  ServerSend("ChatRoomChat", { Content: "*[You can become a quite watcher. You can whisper #watch, Otherwise you will be kicked in 30 seconds. You can change and come back if you want.]", Type: "Emote", Target: sender.MemberNumber });
  //console.log(sender.Name + " timeout")

  setTimeout(function (sender) { checkKickOut(sender) }, 30 * 1000, sender)
  //console.log(sender.Name + " timeou3t")

  // setTimeout(function(sender) 
  //{  console.log("Chatroom kickout");
  //      ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())
  //  }, 120 *1000, sender)  
}

function enterLeaveEvent(sender, msg) {
  if (sender.MemberNumber.toString() == Player.MemberNumber.toString()) { console.log(sender.Name + " is back") }
  else
    if (isExposed(sender) || sender.IsRestrained() || CharacterIsInUnderwear(sender) || sender.IsShackled() || sender.IsBlind() || !sender.CanTalk() || sender.IsEnclose() || sender.IsMounted() || sender.IsDeaf()) {
      warnmsg = "*[To play here you have to be UNRESTRAINED and fully DRESSED (check your panties too). You will be kicked in 30 seconds. You can change and comeback if you want.]"
      kickOutOrWatch(warnmsg, sender)
    } else {
      checkParticipant(sender)
      checkSub(sender)
      if (game.status != "off" && game.status != "end" && game.status != "playerSelection") {
        ServerSend("ChatRoomChat", { Content: "A Game is already running. Please wait until I am ready for a new game.", Type: "Whisper", Target: sender.MemberNumber });
      }
    }
  console.log(sender.Name + " ENTERED")
}

function checkParticipant(char) {
  if (char.ItemPermission > 2) {
    warnmsg = "*[To play here you have to lower your PERMISSION.]";
    kickOutOrWatch(warnmsg, char)
  } else if (InventoryBlockedOrLimitedCustomized(char, AssetGet("Female3DCG", "ItemNeckRestraints", "CollarChainLong")) || InventoryBlockedOrLimitedCustomized(char, AssetGet("Female3DCG", "ItemNeck", "LeatherChoker"))) {
    warnmsg = "*[To play here you have to give PERMISSION to use the COLLAR CHAIN LONG and the LEATHER CHOCKER.]";
    //??? enhance check for more restraints 
    kickOutOrWatch(warnmsg, char)
  } else if (InventoryBlockedOrLimitedCustomized(char, AssetGet("Female3DCG", "ItemArms", "ArmbinderJacket")) || InventoryBlockedOrLimitedCustomized(char, AssetGet("Female3DCG", "ItemMouth", "BallGag")) || InventoryBlockedOrLimitedCustomized(char, AssetGet("Female3DCG", "ItemHead", "LeatherBlindfold")) || InventoryBlockedOrLimitedCustomized(char, AssetGet("Female3DCG", "ItemLegs", "LegBinder"))) {
    warnmsg = "*[To play here you have to give PERMISSION to use the ARMBINDER JACKET, the BALL GAG, the LEATHER BLINDFOLD and the LEG BINDER.]";
    kickOutOrWatch(warnmsg, char)
    //} else if (char.ArousalSettings != null && char.ArousalSettings.Active != "Hybrid" && char.ArousalSettings.Active != "Automatic") {
    //  ServerSend("ChatRoomChat", { Content: "*[To play here you have to set the preference for sexual the activities to hybrid or automatic (locked). You will be kicked in 30 seconds. You can change and comeback if you want.]", Type: "Emote", Target: char.MemberNumber} );
    //  setTimeout(function(char) {ChatRoomAdminChatAction("Kick", char.MemberNumber.toString())}, 30*1000, char)
  } else
    if (InventoryBlockedOrLimitedCustomized(char, AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock"))) {
      warnmsg = "*[To play here you have to give PERMISSION to use the Combination Padlock.]";
      kickOutOrWatch(warnmsg, char)
    }
    else {
      if (!(char.MemberNumber in watcherList) && !(char.MemberNumber in customerList)) {
        if (isExposed(char) || char.IsRestrained() || CharacterIsInUnderwear(char) || char.IsShackled() || char.IsBlind() || !char.CanTalk() || char.IsEnclose() || char.IsMounted() || char.IsDeaf()) {
          warnmsg = "*[you are not worth to play, you have to watch]"
          newWatcher(char)
          ServerSend("ChatRoomChat", { Content: warnmsg, Type: "Emote", Target: char.MemberNumber });
        } else {
          newCustomer(char)
          ServerSend("ChatRoomChat", { Content: "*[RULES: Check " + Player.Name + " BIO to see all the rules and commands. Have fun.]", Type: "Emote", Target: char.MemberNumber });
          ServerSend("ChatRoomChat", { Content: "*[You can leave with the command #leave. But you will receive a small punishment for doing so (mistress lock timer = 5 min)]", Type: "Emote", Target: char.MemberNumber });
          customerList[char.MemberNumber].linkedTo = 0
          customerList[char.MemberNumber].isPlayer = false
        }
      }
    }
}


function stackPay(targetMemberNumber, chipsLost) {
  for (var D = 0; D < ChatRoomCharacter.length; D++) {
    if (ChatRoomCharacter[D].MemberNumber == targetMemberNumber) {
      for (count = customerList[targetMemberNumber].chips - 1; count >= customerList[targetMemberNumber].chips - chipsLost; count--) {
        if (count == 7) {
          InventoryRemove(ChatRoomCharacter[D], "Cloth")
        } else if (count == 6) {
          InventoryRemove(ChatRoomCharacter[D], "ClothLower")
        } else if (count == 5) {
          InventoryRemove(ChatRoomCharacter[D], "Bra")
        } else if (count == 4) {
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
  customerList[sender.MemberNumber].name = sender.Name
  customerList[sender.MemberNumber].dice = 0
  customerList[sender.MemberNumber].round = 0

  if (ReputationCharacterGet(sender, "Dominant") < 50) {
    ServerSend("ChatRoomChat", { Content: sender.Name + ", I am delighted that you decided to enter this game. You have been chained and if you want to leave here you will have to earn your freedom.", Type: "Chat", Target: sender.MemberNumber });
    customerList[sender.MemberNumber].role = 'sub'
  } else {
    ServerSend("ChatRoomChat", { Content: "Greetings " + sender.Name + ", welcome to that prohibited room. You can relax and play if you want.", Type: "Chat", Target: sender.MemberNumber });
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
  watcherList[sender.MemberNumber].name = sender.Name
  watcherList[sender.MemberNumber].dice = 0
  watcherList[sender.MemberNumber].round = 0
  watcherList[sender.MemberNumber].role = "watcher"
  ServerSend("ChatRoomChat", { Content: sender.Name + ", I am delighted that you will watch. You have been chained and if you want to leave here you will have to earn your freedom.", Type: "Chat", Target: sender.MemberNumber });
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

  if (!loserhandled) {
    // clearTimeout(timeCheckHandle)
    game.status = "off"
    game.round = 0

    freeAllCustomers(reapplyCloth = true);
    for (memberNumber in customerList) {
      customerList[memberNumber].dice = 0
      customerList[memberNumber].round = 0
    }
    checkRoomForParticipants()
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
      maxTargetPos = loserNumber
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
        playerPosition++
      }
      else {//nonPlayer
        targetPos = nonPlayerPosition
        maxTargetPos = loserNumber + playerNumber + watcherNumber + nonPlayerNumber
        role = "np"
        //memberNumber
        sortCharacter(memberNumber, targetPos, maxTargetPos, role)
        nonPlayerPosition++
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
    console.log(ChatRoomCharacter[D].memberNumber + " " + ChatRoomCharacter[D].Name)
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
  InventoryWear(C, "WoodenSign", "ItemMisc", [roleColor1[role], roleColorRope, roleColor2[role]], 50)
  InventoryGet(C, "ItemMisc").Property.Text = roleText[role]
  InventoryGet(C, "ItemMisc").Property.Text2 = roleText2[role]
  //InventoryGet(Player, "ItemMisc").Color=[roleColor1[role],roleColor2[role],roleColor3]
  //ChatRoomCharacterItemUpdate(C, "ItemMisc");
  //CharacterRefresh(C);
  ChatRoomCharacterUpdate(C)


}


function checkRoomForSigns() {
  console.log("----------------- checkRoomForSigns")
  for (var D = 0; D < ChatRoomCharacter.length; D++) {
    memberNumber = ChatRoomCharacter[D].MemberNumber
    console.log(memberNumber + " " + ChatRoomCharacter[D].Name)

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
          removeRestrains(ChatRoomCharacter[R])
          customerList[ChatRoomCharacter[R].MemberNumber].chips = winningSteps
          customerList[ChatRoomCharacter[R].MemberNumber].isPlayer = false;
          checkSub(ChatRoomCharacter[R])
          //CharacterSetActivePose(ChatRoomCharacter[R], "LegsClosed", true);
          //ServerSend("ChatRoomCharacterPoseUpdate", { Pose: ChatRoomCharacter[R].ActivePose });
          if (reapplyCloth) { reapplyClothing(ChatRoomCharacter[R]) }
          ChatRoomCharacterUpdate(ChatRoomCharacter[R])
          ServerSend("ChatRoomChat", { Content: "*Player " + ChatRoomCharacter[R].Name + " prepared for dicing.", Type: "Emote" });
        }
      }
      else {
        ServerSend("ChatRoomChat", { Content: "*You are unfortunately stuck and you will stay.", Type: "Whisper", Target: ChatRoomCharacter[R].MemberNumber });
        ServerSend("ChatRoomChat", { Content: ChatRoomCharacter[R].Name + ", will stay and watch.", Type: "Chat" });
      }
  }
}


function rewardPhase1() {
  ServerSend("ChatRoomChat", { Content: customerList[game.rewardTarget].name + ", I am sure you will love the mysterius reward you earned.", Type: "Chat" });
  ServerSend("ChatRoomChat", { Content: "But before I can give it to you, you should wear something more approriate for the winner.", Type: "Chat" });
  ServerSend("ChatRoomChat", { Content: "*The clothes are immediately stripped from " + customerList[game.rewardTarget].name + " and a leg binder blocks her from running away.", Type: "Emote" });
  for (var D = 0; D < ChatRoomCharacter.length; D++) {
    if (ChatRoomCharacter[D].MemberNumber == game.rewardTarget) {
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
//function checkLooser {
//lowest dice
//ChatRoomChatLog.
//Object { Chat: "/dice100", Garbled: "/dice100", Original: "/dice100", … }
//Chat: "/dice100"​​
//Garbled: "/dice100"​​
//Original: "/dice100"​​
//SenderMemberNumber: 167042​​
//SenderName: "ServiceBot"​​
//Time: 1717707182604
//}


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
    timeoutHandle = setTimeout(function (Player) { checkWinners() }, Math.floor(Math.random() * 3000, Player))
  }
  else {
    ServerSend("ChatRoomChat", { Content: "It is punishment time!", Type: "Emote" });
    InventoryWear(Player, "HeartCrop", "ItemHandheld", "#CCF6B7")
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
      ServerSend("ChatRoomChat", { Content: char.Name + ": " + watcherList[memberNumber].punishmentPoints + " punishmentPoints", Type: "Whisper", Target: char.MemberNumber })
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
      ServerSend("ChatRoomChat", { Content: delinquent.Name + ": " + customerList[memberNumber].punishmentPoints + "  stroke", Type: "Emote", Target: Player.MemberNumber })

      spankCustomer(memberNumber)
      customerList[memberNumber].punishmentPoints--
      if (customerList[memberNumber].punishmentPoints <= 0) {
        ServerSend("ChatRoomChat", { Content: "Your punishment for misbehaving is done", Type: "Whisper", Target: char.MemberNumber });
        ServerSend("ChatRoomChat", { Content: "Another punishment for misbehaving is done", Type: "Chat" });
        customerList[memberNumber].beingPunished = false
      }
    }
  }

  if (emptyWatcher == 0) {
    InventoryRemove(Player, "ItemHandheld")
    ChatRoomCharacterUpdate(Player)
    ServerSend("ChatRoomChat", { Content: "All punishment is applied, is there a reward, too ? ", Type: "Chat" });
    //timeoutHandle = setTimeout(checkWinners, Math.floor(Math.random() * 40) * 1000)
    setTimeout(function (Player) { checkWinners() }, Math.floor(Math.random() * 9000 + 3000, Player))
  } else
    //timeoutHandle = setTimeout(choosePunishment, Math.floor(Math.random() * 40) * 1000)
    setTimeout(function (Player) { choosePunishment() }, Math.floor(Math.random() * 10000 + 500, Player))
  return true
}


function spankCustomer(memberNumber) {
  char = charFromMemberNumber(memberNumber)
  ServerSend("ChatRoomChat", { Content: "it hurts me, too", Type: "Whisper", Target: char.MemberNumber });
  ServerSend("ChatRoomChat", { Content: "One Punishment for " + char.Name, Type: "Chat" });
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
    console.log(memberNumber, " spanking is not possinble")
}

function handleLoser(memberNumber) {
  delinquent = charFromMemberNumber(memberNumber)
  memberName = " "
  if (delinquent != null) {
    memberName = delinquent.Name
    ServerSend("ChatRoomChat", { Content: "Poor " + memberName + "! Your fate is certain ! ", Type: "Chat" });
    //prepareWatcher (delinquent)
    //ChatRoomAdminChatAction("Move",delinquent.memberNumber,1)
    ServerSend("ChatRoomChat", { Content: memberName + ", You lost everything. ", Type: "Chat" });
    ServerSend("ChatRoomChat", { Content: memberName + ", Now you will pay with your freedom. Your enslavement starts now", Type: "Whisper", Target: delinquent.MemberNumber });
    // ServerSend("ChatRoomChat", { Content: "For complete submission, you loose all  money, too. " + ChatRoomCharacter[D].Money + " transfered", Type: "Chat", Target : ChatRoomCharacter[D].MemberNumber} );
    //InventoryGet(C, C.FocusGroup.Name)
    targetGroup = ActivityGetGroupOrMirror(Player.AssetFamily, "ItemBoots")
    activity = ActivityAllowedForGroup(Player, "ItemBoots").find(function (obj) {
      return obj.Activity.Name == "Tickle";
    })
    ActivityRun(Player, delinquent, targetGroup, activity)
    customerList[memberNumber].role = "loser"
    console.log(delinquent.Name + " gets enslaved")

    //delAmount = Number(delinquent.Money)
    //payerAmount = Number(Player.Money)
    //console.log(delinquent.Name + " " + delinquent.Money + "-" + delAmount)
    //console.log(Player.Name + " " + Player.Money)

    // Player.Money =  Player.Money + Number(ChatRoomCharacter.Money)
    // Amount = Number(delinquent[D].Money)
    //AddMoney(Amount) 
    // CharacterChangeMoney(Player, Amount)
    //ServerSend("ChatRoomChat", { Content: delinquent.Name + " pay the tribute, " + Amount + " $", Type: "Whisper", Target: Player.MemberNumber} );
    //Since 42 is the answer for everything
    // CharacterChangeMoney(delinquent[D], 42)
    //ChatRoomCharacter[D].Money = "3"
    //console.log("-----after grabbing Money which is not allowed by framework ----------")
    //console.log(delinquent[D].Name + " " + delinquent[D].Money)
    // console.log(Player.Name + " " + Player.Money)
    if (memberNumber in customerList) {
      newWatcher(delinquent)
      delete customerList[memberNumber]
    }
    if (watcherList != null)
      watcherList[memberNumber].role = "loser"
    else
      console.log("error in watcherList" + memberNumber)
    checkCharacterPlace(delinquent)
    checkSign(delinquent, "loser")
  } else
    console.log(memberNumber + ' not found for handling Loser ')
}


function checkWinners() {
  loserList = []
  for (var D = 0; D < ChatRoomCharacter.length; D++) {
    if (!(ChatRoomCharacter[D].MemberNumber in customerList)) { continue }
    if (customerList[ChatRoomCharacter[D].MemberNumber].role == "sub") {
      //enslavement
      if (customerList[ChatRoomCharacter[D].MemberNumber].totalPointsGained <= enslavement) {
        ServerSend("ChatRoomChat", { Content: ChatRoomCharacter[D].Name + ", seems that you have nothing else to give. Bad luck!", Type: "Chat" });
        loserNumber = ChatRoomCharacter[D].MemberNumber
        customerList[ChatRoomCharacter[D].MemberNumber].beingPunished = true
        //loserList[D] = loserNumber      
        loserList.push(loserNumber)
      } else if (customerList[ChatRoomCharacter[D].MemberNumber].totalPointsGained >= subToDom) {
        ServerSend("ChatRoomChat", { Content: "Congratulations " + ChatRoomCharacter[D].Name + "! You got " + subToDom + " wins. You have earned your freedom. You can leave free or you can continue playing as if you were a domme.", Type: "Chat" });
        ServerSend("ChatRoomChat", { Content: "(Private) Your lock code is: " + customerList[ChatRoomCharacter[D].MemberNumber].lockCode, Type: "Whisper", Target: ChatRoomCharacter[D].MemberNumber });
        customerList[ChatRoomCharacter[D].MemberNumber].isPlayer = false
        customerList[ChatRoomCharacter[D].MemberNumber].role = "dom"
        customerList[ChatRoomCharacter[D].MemberNumber].totalPointsGained = 0
        customerList[ChatRoomCharacter[D].MemberNumber].winNum = 0
      }
    } else {
      if (customerList[ChatRoomCharacter[D].MemberNumber].totalPointsGained >= domWinReward) {
        ServerSend("ChatRoomChat", { Content: "Congratulations " + ChatRoomCharacter[D].Name + "! You got " + domWinReward + " wins. You have earned the rights to a special reward! When you want to get your reward just use the command '#reward'.", Type: "Chat" });
      }
      if ((customerList[ChatRoomCharacter[D].MemberNumber].role == "dom") && (customerList[ChatRoomCharacter[D].MemberNumber].totalPointsGained <= (subToDom * -1))) {
        ServerSend("ChatRoomChat", { Content: ChatRoomCharacter[D].Name + " is degraded to a sub", Type: "Chat" });
        ServerSend("ChatRoomChat", { Content: "I am sorry " + ChatRoomCharacter[D].Name + "! Too many lost games. You have lost partly your freedom. You can't leave anymore but you can continue playing to gain freedom back", Type: "Chat", Target: ChatRoomCharacter[D].MemberNumber });
        ServerSend("ChatRoomChat", { Content: " .... A chain is waiting for you ....", Type: "Emote", Target: ChatRoomCharacter[D].MemberNumber });
        customerList[ChatRoomCharacter[D].MemberNumber].isPlayer = false
        customerList[ChatRoomCharacter[D].MemberNumber].role = "sub"
        customerList[ChatRoomCharacter[D].MemberNumber].winNum = 0
        customerList[ChatRoomCharacter[D].MemberNumber].totalPointsGained = 0
        checkSub(ChatRoomCharacter[D])
      }
    }
    ChatRoomCharacterUpdate(ChatRoomCharacter[D])
  }
  if (loserList.length > 0)
    setTimeout(function (Player) { loserHandling(loserList) }, Math.floor(Math.random() * 6000, Player))
  else
    setTimeout(function (Player) { resetGame() }, Math.floor(Math.random() * 6000, Player))
}



function loserHandling(loserList) {
  if (loserList.length > 0) {
    handleLoser(loserList.shift())
    setTimeout(function (Player) { loserHandling(loserList), Math.floor(Math.random() * 2000 + 1000, Player) })
  }
  else
    timeoutHandle = setTimeout(resetGame(), Math.floor(Math.random() * 120) * 1000)
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
  CharacterSetActivePose(char, "Kneeling", true)
  ServerSend("ChatRoomCharacterPoseUpdate", { Pose: char.ActivePose });
  ChatRoomCharacterUpdate(char);
}

function releaseWatcher(memberNumber) {
  char = charFromMemberNumber(memberNumber)
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
  ServerSend("ChatRoomChat", { Content: "*Player " + char.Name + " released from Watching.", Type: "Emote" });
  ChatRoomCharacterUpdate(char);
}