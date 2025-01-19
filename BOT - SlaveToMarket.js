initDescription = Player.Description

RoomName = "SlaToMa"
RoomDescription = "\"Slaves and Tools Market\" best offers in town. Read the bot profile for instructions!"
RoomBackground = "Theater"


//parameters



Player.Description = `
....... automated ServiceBot model "Slave Trader" 0.0.0.1 .......
      Slave Market
      =============
      Overview for COMMANDS: all commands starts with #
      If you are gagged, you can use OOC (#. 
      But be careful, it may be punished.
      
#leave - you will be restrained with a timer padlock (5 mins) and kicked out of the room.
#play - signal your will to play
#start -  request the start if there are enough player .
#info - shows your gaming status.
#watch - *Danger* to watch the game without interaction. *Danger*

      Purpose
      ----------------------
      In this happening slaves were traded. I am the SlaveTraderBot .
      DO NOT TOUCH ME!  NEVER EVER!
      

Have fun.

Fork-Code available here: 
https://github.com/SandraRumer/BC-BOT-repository
Comment and suggestion thread on BC Discord: https://discord.com/channels/1264166408888258621/1264166916839444554
      ` // end of description

if (typeof guestList === 'undefined') {
    resetGuestList()
}

newGame()
ServerSend("AccountUpdate", { Description: Player.Description });
ChatRoomCharacterUpdate(Player)

updateRoom(RoomName, RoomDescription, RoomBackground, false, false)


ChatRoomMessageAdditionDict["EnterLeave"] = function (SenderCharacter, msg, data) { ChatRoomMessageEnterLeave(SenderCharacter, msg, data) }
ChatRoomMessageAdditionDict["Trade"] = function (SenderCharacter, msg, data) { ChatRoomMassageTrade(SenderCharacter, msg, data) }


// initialising 
function resetGuestList() {
    guestList = {}
    guestList[Player.MemberNumber] = new personMagicData()
    guestList[Player.MemberNumber].role = "Trader"
    guestList[Player.MemberNumber].rules = []
}

function newGame() {
    // clearTimeout(timeCheckHandle)
    game = {
        status: "pause", //possible status pause, trading, sell, 
        playerDict: {},
        rewardTarget: 0,
        rewardOrgasmNum: 0,
        slaveCount() {
            count = 0
            for (var R = 0; R < ChatRoomCharacter.length; R++) {
                memberNumber = ChatRoomCharacter[R].MemberNumber
                if (isSlave(memberNumber)) {
                    count += 1
                }
            }
            return count
        },
      customerCount() {
            count = 0
            for (var R = 0; R < ChatRoomCharacter.length; R++) {
                memberNumber = ChatRoomCharacter[R].MemberNumber
                if (isCustomer(memberNumber)) {
                    count += 1
                }
            }
            return count
        }
    }
    CharacterSetActivePose(Player, "LegsClosed", true);
    ServerSend("ChatRoomCharacterPoseUpdate", { Pose: Player.ActivePose });
    ServerSend("ChatRoomChat", { Content: "I am starting.", Type: "Chat" });
}

// Checker
function isSlave(memberNumber) {
    if (memberNumber in guestList && guestList[memberNumber].role == "Slave")
        return true
    else
        return false
}
function isCustomer(memberNumber) {
    if (memberNumber in guestList && guestList[memberNumber].role == "Customer")
        return true
    else
        return false
}

// Message Handling 
function ChatRoomMessageEnterLeave(SenderCharacter, msg, data) {

    if ((data.Type == "Action") && (msg.startsWith("ServerEnter"))) {
        setTimeout(enterLeaveEvent, 1 * 1000, SenderCharacter, msg)
    } else if ((msg.startsWith("ServerLeave")) || (msg.startsWith("ServerDisconnect")) || (msg.startsWith("ServerBan")) || (msg.startsWith("ServerKick"))) {
        memberNumber = SenderCharacter.MemberNumber

    }
}

function enterLeaveEvent(sender, msg) {
    if (sender.MemberNumber.toString() == Player.MemberNumber.toString()) { console.log(charname(sender) + " is back") }
    else {
        welcomeGreetings(sender)
        checkGuest(sender)
        console.log(charname(sender) + " ENTERED")
    }
}


function welcomeGuest(char) {
    console.log(charname(sender) + " Welcome guest")

}
function checkGuest(char) {
    console.log(charname(sender) + " Checking guest")
}

function addVisitorToList(memberNumber)
{



}


function ChatRoomMassageTrade(sender, msg, data) {
    if (data.Type != null)
        if (data.Type == "Chat") {
            if (msg.startsWith("!")) {
                commandHandler(sender, msg)
                // not for Player
                // ServerSend("ChatRoomChat", { Content: `*Please use whispers to send commands.`, Type: "Emote", Target: sender.MemberNumber });
            }
        } else if ((data.Type == "Emote") || (data.Type == "Action")) {
            if (msg.startsWith("!")) {
                commandHandler(sender, msg)
            }
        } else if (data.Type == "Whisper") {
            if (msg.startsWith("!")) {
                commandHandler(sender, msg)
            }
        } else if (data.Type == "Hidden") {
            //console.log("Hidden message: " + msg)
        }

}

function commandHandler(sender, msg) {
    
    if (msg.toLowerCase().includes("sellMe")) {
//Check Requirement 
        warnmsg = checkRequirements(char)
          if (warnmsg != "ok")
            console.log(charname(sender) + " Selling requirements failed")
          ServerSend("ChatRoomChat", { Content: warnmsg, Type: "Whisper", Target: sender.MemberNumber });
          ChatRoomAdminChatAction("Kick", sender.MemberNumber.toString())
          if (sender.MemberNumber in guestList)
            guestList[sender.MemberNumber].punishmentPoints ++
          else 
             addVisitorToList(sender.MemberNumber)

                }
  //inspect 
//add to laverow 
       
      }

    
      if (msg.toLowerCase().includes("status")) {
        //depending on role 
                
              }
    
    
    
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



function pause ()
{
    game.status  = "pause"
    CharacterSetActivePose(Player, "Knee", true);
    ServerSend("ChatRoomCharacterPoseUpdate", { Pose: Player.ActivePose });
    ServerSend("ChatRoomChat", { Content: "I am starting.", Type: "Chat" });

}

//warnmsg = checkRequirements(char)
//  if (warnmsg != "ok")

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
  