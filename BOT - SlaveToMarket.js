initDescription = Player.Description
gamekey = 1
//SlatoMa
RoomName = "SlaToMa"
RoomDescription = "\"Slaves and Tools Market\" best offers in town. Read the bot profile for instructions!"
RoomBackground = "Theater"


//parameters

// new line in chat - BEGIN
nl = `
    `
// new line in chat - END 


Player.Description = `
        ....... automated ServiceBot model "Slave Trader" 0.0.0.3 .......
            Slave to Market
            =============
        
            Purpose
            ----------------------
            In this happening slaves were traded. I am the SlaveTraderBot .
            DO NOT TOUCH ME!  NEVER EVER!
        
            Commands
            ----------------------
            Overview for COMMANDS: all commands starts with #
            If you are gagged, you can use OOC (#. 
            But be careful, it may be punished.
        
        #sellme - you will be presented and sold at this market
        #present <Nickname> - you can ask for presenting the slave
        #present all - you can ask for presenting all the slave
        #buy <Nickname> <price> - you can buy <Nickname> with Starbucks. 
            Be careful to write  the nickname in a proper way.
        #info - shows your gaming status.
        #leave - you will be restrained with a timer padlock (5 mins) and kicked out of the room.
            
        Have fun.

        Fork-Code available here: 
        https://github.com/SandraRumer/BC-BOT-repository
        Comment and suggestion thread on BC Discord: https://discord.com/channels/1264166408888258621/1264166916839444554
            ` + Player.Description // end of description



if (typeof guestList === 'undefined') {
    resetGuestList()
}

newGame()
ServerSend("AccountUpdate", { Description: Player.Description });
ChatRoomCharacterUpdate(Player)

//dev : !sellnmeupdateRoom(RoomName, RoomDescription, RoomBackground, false, false)

ChatRoomMessageAdditionDict["EnterLeave"] = function (SenderCharacter, msg, data) { ChatRoomMessageEnterLeave(SenderCharacter, msg, data) }
ChatRoomMessageAdditionDict["Trade"] = function (SenderCharacter, msg, data) { ChatRoomMassageTrade(SenderCharacter, msg, data) }

// initialising 
function resetGuestList() {
    guestList = {}
    guestList[Player.MemberNumber] = new personMagicData()
    guestList[Player.MemberNumber].role = "Trader"
    guestList[Player.MemberNumber].rules = []
    guestList[Player.MemberNumber].StarMoney = Player.Money
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
        slaveValue() {
            count = 0
            for (var R = 0; R < ChatRoomCharacter.length; R++) {
                memberNumber = ChatRoomCharacter[R].MemberNumber
                if (isSlave(memberNumber)) {
                    count += guestList[memberNumber].Price
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
    setTimeout(function (Player) { checkSlave() }, 20 * 1000)
}
// Checker
function isSlave(memberNumber) {
    if (memberNumber in guestList && guestList[memberNumber].role == "merchandise")
        return true
    else
        return false
}
function isCustomer(memberNumber) {
    if (memberNumber in guestList && guestList[memberNumber].role == "customer")
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
        personContent = convertPers(SenderCharacter)
        saveCharResult(memberNumber, personContent, gamekey)
        delete guestList[memberNumber]
    }
}
function enterLeaveEvent(sender, msg) {
    if (sender.MemberNumber.toString() == Player.MemberNumber.toString()) { console.log(charname(sender) + " is back") 
        checkGuests()
    }
    else {
        welcomeGreetings(sender)
        //load from local space
        memberNumber = sender.MemberNumber
        personContent = getCharResult(memberNumber, gamekey)
        charIsKnown = reconvertPers(personContent, sender)
        checkGuest(sender)
        checkMerchandise(sender)
        console.log(charname(sender) + " ENTERED")
    }
}
function welcomeGreetings(sender) {
    answer = nl + "Welcome " + charname(sender) + " !" + nl
    answer = answer + "This is my premium slave market where you can buy or sell merchandises"
    sendAnswer(sender, answer)
    console.log(charname(sender) + " Checking guest")
}
function checkGuest(sender) {
    console.log(charname(sender) + " Checking guest")
    addVisitorToList(sender)
    if (isSlave(sender.MemberNumber)) {
        oldPrice = guestList[sender.MemberNumber].Price
        enslave(sender)
        newPrice = guestList[sender.MemberNumber].Price
        console.log(sender.MemberNumber + ": oldPrice = " + oldPrice + "; New Price = " + newPrice)
        guestList[sender.MemberNumber].Price = newPrice
        difference = newPrice - oldPrice
        if (!difference == 0) {
            answer = "your price changed by " + difference
            sendAnswer(sender, answer)
        }
    }
    else {
        if (guestList[sender.MemberNumber].role == "")
            guestList[sender.MemberNumber].role = "customer"
    }
}
function enslave(sender) {
    // Backlog
    // guestList[sender.MemberNumber].NickName = sender.Nickname
    //sender.Nickname = "Item" + sender.MemberNumber
    //ChatRoomCharacterUpdate(sender);
    guestList[sender.MemberNumber].Description = analyzeCharacter(sender)
    guestList[sender.MemberNumber].Price = calculatePrice(sender)
    guestList[sender.MemberNumber].from = timestamp
}
function addVisitorToList(sender) {
    if (!(sender.MemberNumber in guestList)) {
        guestList[sender.MemberNumber] = new personMagicData()
        guestList[sender.MemberNumber].name = charname(sender)
        guestList[sender.MemberNumber].StarMoney = 20000
    }
}
function checkMerchandise(sender) {
    memberNumber = sender.MemberNumber
    if (memberNumber in guestList)
        if (isSlave(memberNumber)) {
            memorizeClothing(sender)
            ServerSend("ChatRoomChat", { Content: " waves to " + charname(sender), Type: "Emote", });
            setTimeout(function (Player) { prepareSlave(Player, sender, [], 1) }, 8 * 1000)
        }
}
//------------------- Command handler -------------------------------------

function ChatRoomMassageTrade(sender, msg, data) {
    if (data.Type != null && sender.MemberNumber != Player.MemberNumber) {
        if (data.Type == "Chat") {
            if ((msg.startsWith("#") || msg.startsWith("(#")) || ((data.Type == "Hidden") && (msg.startsWith("ChatRoomBot")))) {
                commandHandler(sender, msg)
                // not for Player
                ServerSend("ChatRoomChat", { Content: `*Please use whispers to send commands.`, Type: "Emote", Target: sender.MemberNumber });
            }
        } else if ((data.Type == "Emote") || (data.Type == "Action")) {
            if (msg.startsWith("#")) {
                commandHandler(sender, msg)
            }
        } else if (data.Type == "Whisper") {
            if (msg.startsWith("#")) {
                commandHandler(sender, msg)
            }
        } else if (data.Type == "Hidden") {
            //console.log("Hidden message: " + msg)
        }
    }
    if ((data.Type != null && sender.MemberNumber == Player.MemberNumber)) {
        TraderCommandHandler(sender, msg)
    }
    if (msg.includes("Orgasm") && sender.MemberNumber != Player.MemberNumber) {
        if (sender.MemberNumber in guestList) {
            guestList[sender.MemberNumber].points += 1
            if (isSlave[sender.MemberNumber]) {
                guestList[sender.MemberNumber].punishmentPoints += 1
            }
        }
    }
}
function TraderCommandHandler(sender, msg) {
    if (msg.toLowerCase().includes("release")) {
        all = false
        done = false
        console.log(msg)
        if (msg.toLowerCase().endsWith("all")) {
            all = true
        }
        for (var D = 0; D < ChatRoomCharacter.length; D++) {
            if (msg.toLowerCase().endsWith(charname(ChatRoomCharacter[D]).toLowerCase()) || all) {
                if (ChatRoomCharacter[D].MemberNumber in guestList && (ChatRoomCharacter[D].MemberNumber != Player.MemberNumber)) {
                    //release
                    releaseSlave(ChatRoomCharacter[D])
                    ServerSend("ChatRoomChat", { Content: "*" + charname(ChatRoomCharacter[D]) + " is released from her slavebonds", Type: "Chat" });
                    console.log("Guest released: " + charname(ChatRoomCharacter[D]))
                    done = true
                }
                else
                    // freeAllunknown
                    if (ChatRoomCharacter[D].MemberNumber != Player.MemberNumber) {
                        //release
                        releaseSlave(ChatRoomCharacter[D])
                        console.log("no customer is released: " + charname(ChatRoomCharacter[D]))
                        done = true
                    }
                // else Player
            }
        }
        if (!done)
            console.log("no one released: ")
    }
    if (msg.toLowerCase().includes("status")) {
        mess = `*--------------------` + nl + ` merchandises : ` + game.slaveCount()
        if (game.slaveCount() > 1)
            mess = mess + nl + ` value : ` + game.slaveValue()
        mess = mess + nl + ` customers : ` + game.customerCount()
        mess = mess + nl + `--------------------` + nl
        ServerSend("ChatRoomChat", { Content: mess, Type: "Emote", Target: Player.MemberNumber });
    }
}
function commandHandler(sender, msg) {
    if (msg.toLowerCase().includes("sellme")) {
        console.log("sellme :" + sender.MemberNumber)
        playerList = []
        playerList.push(sender.MemberNumber)
        prepareSlaves4selling(sender, playerList, 0)
    }
    if (msg.toLowerCase().includes("sell ")) {
        console.log("sell command from " + sender.MemberNumber)
        checkGuest(sender)
        playerList = extractNumberfromMessage(sender, msg)
        prepareSlaves4selling(sender, playerList, 0)
    }
    if (msg.includes("present")) {
        console.log("present")
        playerList = extractNumberfromMessage(sender, msg)
        presentSlaves(sender, playerList)
    }

    if (msg.toLowerCase().includes("buy")) {
        console.log("buy command from " + sender.MemberNumber) + " " + msg
        //playerList = extractNumberfromMessage(msg)
        // sell 
        msgArray = msg.split(" ")
        sellername = msgArray[1]
        offerprice = Number(msgArray[2])
        sellernumber = findNumberfromCharname(sellername)
        if ((sellernumber in guestList) && isSlave(sellernumber)) {
            // trade 
            if (offerprice >= (0.9 * guestList[sellernumber].Price)) {
                answer = "You made it. The price for " + sellername + " is " + Number(guestList[sellernumber].Price) + " StarBucks"
                // Verkauft
                ServerSend("ChatRoomChat", { Content: answer, Type: "Whisper", Target: sender.MemberNumber });
                ServerSend("ChatRoomChat", { Content: sellername + " is sold", Type: "Chat" });
                setTimeout(function (Player) { soldSlave(sender, charFromMemberNumber(sellernumber)) }, 6 * 1000)
            }
            else {
                //abgelehnt 
                answer = "Sorry, too low. The price is " + Number(guestList[sellernumber].Price) + " StarBucks. I add a punishment point"
                sendAnswer(sender, answer)
                if (sender.MemberNumber in guestList) {
                    guestList[sender.MemberNumber].punishmentPoints++;
                }
                guestList[sellernumber].StarMoney += 10
                answer = "A customer offers a price which is too low. "
                sendAnswer(charFromMemberNumber(sellernumber), answer)
            }
        }
        else {
            answer = "You can't buy " + sellername
            if (sellernumber in guestList)
                answer = answer + ". The price is " + Number(guestList[sellernumber].Price) + " StarBucks" + nl
            answer = answer + "Your money is " + guestList[sender.MemberNumber].StarMoney + nl
            answer = answer + "A punishment point is added" + nl
            sendAnswer(sender, answer)
            if (sender.MemberNumber in guestList) {
                guestList[sender.MemberNumber].punishmentPoints++;
            }
        }
    }

    if (msg.toLowerCase().includes("leave")) {
        if (sender.MemberNumber in guestList) {
            if (guestList[sender.MemberNumber].role == 'merchandise') {
                if (guestList[sender.MemberNumber].punishmentPoints > 0) {
                    ServerSend("ChatRoomChat", { Content: "*You are not allowed to leave anymore. You have lost and enslaved. I add a punishment point to your score", Type: "Whisper", Target: sender.MemberNumber });
                    guestList[sender.MemberNumber].punishmentPoints++;
                } else {
                    //ServerSend("ChatRoomChat", { Content: "*You are a lucky one, You are not enslaved. But it takes some time to get you out. be patient", Type: "Whisper", Target: SenderCharacter.MemberNumber });
                    ServerSend("ChatRoomChat", { Content: "*You are a lucky one, You are allowed to leave.", Type: "Whisper", Target: sender.MemberNumber });
                    kick(sender)
                }
            }
            else {
                kick(sender)
            }
        }
    }
    //inspect todo 
    if (msg.includes("inspect")) {
        console.log("inspect")
        prepareInspection()
        setTimeout(function (Player) { performInspection() }, timeoutFactor * 500, Player)
        const chars = msg.split('');
        playerList = []
        for (memberNumber in guestList) {
            if (memberNumber != Player.MemberNumber && isSlave(guestList[memberNumber])) {
                if (msg.includes(guestList[memberNumber].Nickname))
                    console.log(true)
                else
                    console.log("not include")
                if (guestList[memberNumber].Nickname in chars)
                    console.log(true)
                console.log("not Nickname")

            }
        }
    }
    if (msg.toLowerCase().includes("info")) {
        console.log("info : " + msg + sender.MemberNumber)
        //checkMerchandise(sender)
        mess = "*--------------------" +
            nl + "For Your Intrest, " + charname(sender) + `!`;
        mess = mess + nl + "Your actual role is  " + guestList[sender.MemberNumber].role + `!`;
        if (isSlave(sender.MemberNumber))
            mess = mess + nl + "Your market price is not your business " + nl
        else
            mess = mess + nl + "Your have " + guestList[sender.MemberNumber].StarMoney + " Starbucks" + nl
        mess = mess + "Your punishment points : " + guestList[sender.MemberNumber].punishmentPoints + nl;
        mess = mess + "*--------------------"
        if (isSlave(sender.MemberNumber))
            mess = mess + nl + "There are " + game.customerCount() + " potential Buyers"
        else
            mess = mess + nl + "There are  " + game.slaveCount() + " slaves in stock"

        mess = mess + nl + "*--------------------"

        ServerSend("ChatRoomChat", { Content: mess, Type: "Emote", Target: sender.MemberNumber });
    }
    if (msg.toLowerCase().includes("help")) {
        //depending on role 
        console.log("help :" + sender.MemberNumber)
        tellHelp(sender)
    }
    if (msg.toLowerCase().includes("status")) {
        //depending on role 
        console.log("status :" + sender.MemberNumber)
        tellStatus(sender)
    }
    if (msg.toLowerCase().includes("release")) {
        console.log("release :" + sender.MemberNumber)
        tellRelease(sender)
    }
    if (msg.toLowerCase().includes("buggy")) {
        //punish bot
        dressColor = ""
        // own haicolor
        for (var ii = 0; ii < sender.Appearance.length; ii++) {
            if (sender.Appearance[ii].Asset.Group.Name == 'HairFront') {
                dressColor = sender.Appearance[ii].Color
                if (!(typeof dressColor === 'string')) {
                    dressColor = dressColor[0];
                }
                break;
            }
        }
        

        //
        //        for (var ii = 0; ii < Player.Appearance.length; ii++) {
        //          if (Player.Appearance[ii].Asset.Group.Name == 'HairFront') {
        //            dressColor = Player.Appearance[ii].Color
        //            if (!(typeof dressColor === 'string')) {
        //              dressColor = dressColor[0];
        //            }
        //            break;
        //          }
        //        }
        //freeAll(true)
        InventoryWear(Player, "Irish8Cuffs", "ItemFeet", dressColor, 24)
        InventoryWear(Player, "SeamlessHobbleSkirt", "ItemLegs", dressColor, 24)
        InventoryWear(Player, "BalletWedges", "ItemBoots", dressColor, 16)
        InventoryWear(Player, "DeepthroatGag", "ItemMouth", dressColor, 15)
        InventoryWear(Player, "HarnessPanelGag", "ItemMouth2", dressColor, 16)
        InventoryWear(Player, "StitchedMuzzleGag", "ItemMouth3", dressColor, 15)
        InventoryWear(Player, "ArmbinderJacket", "ItemArms", [dressColor, "#0A0A0A", "Default"], 22)
        InventoryWear(Player, "KirugumiMask", "ItemHood", ["#9A7F76", "Default", "Default", dressColor], 25)
        InventoryGet(Player, "ItemHood").Property = { "Type": "e2m3b1br0op2ms0", "Difficulty": 15, "Effect": ["BlindHeavy", "Prone", "BlockMouth"], "Hide": ["Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "Mask", "ItemHead"], "HideItem": ["ItemHeadSnorkel"] }
        ChatRoomCharacterUpdate(Player);
        ServerSend("ChatRoomChat", { Content: "I am buggy, please punish me", Type: "Chat" });

    }
    if (msg.toLowerCase().includes("unbuggy")) {
        removeRestrains(Player)
        //reapplyClothing(Player)
        ChatRoomCharacterUpdate(Player);
        ServerSend("ChatRoomChat", { Content: "I am back, take care", Type: "Chat" });
    }
}
function whisperHandler(sender, msg) {
}

function checkGuests() {
    //Check if all Room Particiopants in List and if all List members are in Room 
    //??? to be defined
    actualList = []
    for (var D = 0; D < ChatRoomCharacter.length; D++) {
        actualList.push(ChatRoomCharacter[D].MemberNumber)
        if (ChatRoomCharacter[D].MemberNumber != Player.MemberNumber) {
            if (!ChatRoomCharacter[D].MemberNumber  in guestList)
            {
            personContent = getCharResult(ChatRoomCharacter[D].MemberNumber, gamekey)
            charIsKnown = reconvertPers(personContent, ChatRoomCharacter[D])
            checkGuest(ChatRoomCharacter[D])
            checkMerchandise(ChatRoomCharacter[D])
        }

        }
    }
    for (memberNumber in guestList) {
        delete actualList[memberNumber]
    }

    while (actualList.length > 0)
        memberNumber = actualList.shift()
    if (!memberNumber in guestList) {
        delete guestList[memberNumber]
    }
}
function extractNumberfromMessage(sender, msg) {
    const chars = msg.split(',');
    playerList = []
    all = false

    if (msg.toLowerCase().includes(" all")) {
        all = true
    }
    for (memberNumber in guestList) {
        if ((memberNumber != Player.MemberNumber) && (memberNumber != sender.memberNumber)) {
            char = charFromMemberNumber(memberNumber)
            if (char != null && char != undefined) {
                if (msg.includes(charname(char)) || all) {
                    playerList.push(memberNumber)
                }
                else
                    console.log("Name not include")
                if (charname(char) in chars)
                    console.log(true)
                console.log("not Nickname in Message")
            }
        }
    }
    return (playerList)
}
function kick(SenderCharacter) {
    // remove all locks, dildo, chastitybelt and kick
    free(SenderCharacter, true, true)
    //removeRestrains(sender)
    //reapplyClothing(sender) 
    //ChatRoomCharacterUpdate(sender)
    free(SenderCharacter.MemberNumber, update = true, true)
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
function tellHelp(char) {

    answer = '********************************' + nl
    answer = answer + 'Sell yourself with command #sellme.' + nl
    answer = answer + 'present a slave with command #present <name of slave>.' + nl
    answer = answer + 'sell your slave with command #sell <name of slave>.' + nl
    answer = answer + 'Buy your slave with command #buy <name of slave> <your offer>.' + nl
    answer = answer + '********************************' + nl
    sendAnswer(char, answer)
}
function tellStatus(char) {
    answer = "*You are not allowed to ask for status. I add a punishment point to your score"
    if (char.MemberNumber in guestList) {
        guestList[char.MemberNumber].punishmentPoints++;
    }
    sendAnswer(char, answer)
}
function tellRelease(char) {
    if (isSlave(char.MemberNumber)) {
        answer = "*You are not allowed to ask for release. I add a punishment point to your score"
        if (char.MemberNumber in guestList) {
            guestList[char.MemberNumber].punishmentPoints++;
        }
    } else {
        answer = "*You are not allowed to ask for release. Buy the slave"
    }
    sendAnswer(char, answer)
}
function tellPoints(char) {
    answer = 'no points'
    sendAnswer(char, answer)
}
function sendAnswer(char, answer) {
    if (char != null)
        ServerSend("ChatRoomChat", { Content: answer, Type: "Whisper", Target: char.MemberNumber });
}
function sendAction(char, action) {
    ServerSend("ChatRoomChat", { Content: action, Type: "Emote", Target: char.MemberNumber });

}
function pause() {
    game.status = "pause"
    CharacterSetActivePose(Player, "Knee", true);
    ServerSend("ChatRoomCharacterPoseUpdate", { Pose: Player.ActivePose });
    ServerSend("ChatRoomChat", { Content: "I am starting.", Type: "Chat" });
    ChatRoomCharacterUpdate(Player)
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
function analyzeCharacter(sender) {
    description = "Slave " + charname(sender) + nl
    //if sender.Description contains "switch"

    if (ReputationCharacterGet(sender, "Dominant") < 10) {
        description = description + 'A submissive merchandise exemplar. ' + nl
    }
    if (ReputationCharacterGet(sender, "Dominant") > 50) {
        description = description + "A fallen dominant Person." + nl
    }
    if (ReputationCharacterGet(sender, "Kidnap") > 75) {
        description = description + "Once a noble Masterkidnaper, now a peace of shame." + nl
    }

    if (ReputationCharacterGet(sender, "Maid") > 75) {
        description = description + "She is a trained maid, ready to serve."
    }
    return description
}
function calculatePrice(sender) {
    price = 200 + Math.floor(Math.random() * 100)

    price = price * sender.GetDifficulty()
    if (ReputationCharacterGet(sender, "Dominant") > 50) {
        price = price + 150
    }
    if (ReputationCharacterGet(sender, "Kidnap") > 75) {
        price = price + 75
    }

    if (ReputationCharacterGet(sender, "Maid") > 75) {
        price = price + 50
    }

    if (ReputationCharacterGet(sender, "Dominant") > 50) {
        price = price + 150
    }
    if (sender.IsFullyOwned())

        price = Math.floor(price / 6)
    else
        price = price * 2
    return price
}
//----------Preparation 4 Selling
function canSell(sender, char) {

    return true
}
function prepareSlaves4selling(sender, playerList, newSlaves) {
    if (playerList.length > 0) {
        delinquent = playerList.shift()
        char = charFromMemberNumber(delinquent)
        if (char == null) {
            setTimeout(function (Player) { prepareSlaves4selling(sender, playerList, newSlaves) }, Math.floor(Math.random() * 2000 + 150, Player))
            return

        }
        else {
            warnmsg = checkRequirements(char)
            if (warnmsg != "ok") {
                console.log(charname(sender) + "Selling requirements failed")
                ServerSend("ChatRoomChat", { Content: warnmsg, Type: "Whisper", Target: sender.MemberNumber });
                ServerSend("ChatRoomChat", { Content: warnmsg, Type: "Whisper", Target: char.MemberNumber });
                setTimeout(function (Player) { ChatRoomAdminChatAction("Kick", char.MemberNumber.toString()) }, 6 * 1000)
                setTimeout(function (Player) { prepareSlaves4selling(sender, playerList, newSlaves) }, Math.floor(Math.random() * 2000 + 150, Player))
            }
            else {
                addVisitorToList(char)
                if (guestList[sender.MemberNumber].role == "")
                    sup = "unknown"
                else
                    sup = guestList[char.MemberNumber].role

                if (delinquent == sender.MemberNumber)
                    answer = "So you wants to be sold. Up to now you was a " + sup + nl
                else
                    answer = "Someone wants you to be sold. Up to now you was a " + sup + nl
                if (canSell(sender, char)) {
                    guestList[char.MemberNumber].role = "merchandise"
                    enslave(char)
                    ChatRoomCharacterUpdate(char);
                    memorizeClothing(char)
                    ServerSend("ChatRoomChat", { Content: " waves to " + charname(char), Type: "Emote", });
                    newSlaves += 1
                    setTimeout(function (Player) { prepareSlave(sender, char, playerList, newSlaves) }, 8 * 1000)
                } else {
                    guestList[sender.MemberNumber].punishmentPoints += 1
                    senderAnswer = "You failed to sell " + charname(char) + " to me. "
                    senderAnswer = senderAnswer + "You earned a punishment."
                    sendAnswer(sender, senderAnswer)
                }
                sendAnswer(char, answer)
            }
        }
    }
    else {
        if (newSlaves == 0) {
            addVisitorToList(sender)
            guestList[sender.MemberNumber].punishmentPoints += 1
            answer = "I can't find candidates. Do you trick me ?" + nl
            answer = answer + "You earned a punishment."
            sendAnswer(sender, answer)
        } else {
            answer = newSlaves + ' candidate(s) are prepared for selling'
            sendAnswer(sender, answer)
        }
    }
}

function prepareSlave(sender, char, playerList, newSlaves) {
    removeClothes(char, false, false)
    InventoryWear(char, "HarnessBallGag1", "ItemMouth2", "#000000", 50)
    //InventoryWear(char, "LeatherBreastBinder", "ItemBreast", "#000000", 50)
    if (!char.IsOwned())
        InventoryWear(char, "LeatherChoker", "ItemNeck", "#000000", 50)
    //InventoryWear(char, "LeatherBlindfold","ItemHead", "#000000",50)
    //InventoryWear(char, "InteractiveVRHeadset", "ItemHead", "#000000", 50)
    //InventoryLock(char, InventoryGet(char, "ItemHead"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber)
    //InventoryGet(char, "ItemHead").Property.CombinationNumber = watcherList[char.MemberNumber].lockCode
    //InventoryWear(char, "PantyStuffing", "ItemMouth", "#900000", 50)
    ServerSend("ChatRoomChat", { Content: " smiles, while gagging " + charname(char), Type: "Emote", });
    ChatRoomCharacterUpdate(char);
    setTimeout(function (Player) { prepareSlave2(sender, char, playerList, newSlaves) }, 8 * 1000)
}
function prepareSlave2(sender, char, playerList, newSlaves) {
    removeClothes(char, true, false)
    InventoryWear(char, "VibratingEgg", "ItemVulva", "Default")
    InventoryWear(char, "SturdyLeatherBelts", "ItemFeet", "#000000", 50)

    //InventoryWear(char, "LeatherHarness", "ItemTorso", "#000000", 50)
    //InventoryWear(char, "LeatherChastityBelt", "ItemPelvis", "#000000", 50)
    //InventoryWear(char, "SturdyLeatherBelts", "ItemLegs", "#000000", 50)
    ServerSend("ChatRoomChat", { Content: " grabs for further restraints", Type: "Emote", });
    ChatRoomCharacterUpdate(char);
    setTimeout(function (Player) { prepareSlave3(sender, char, playerList, newSlaves) }, 8 * 1000)
}
function prepareSlave3(sender, char, playerList, newSlaves) {
    if ((char != null) && (char.MemberNumber in guestList)) {
        InventoryWear(char, "SturdyLeatherBelts", "ItemArms", ["#11161B", "#403E40", "#11161B", "#403E40", "#11161B", "#403E40"], 50)
        InventoryLock(char, InventoryGet(char, "ItemArms"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber)
        InventoryGet(char, "ItemArms").Property.CombinationNumber = guestList[char.MemberNumber].lockCode
        InventoryWear(char, "LeatherMittens", "ItemHands", "202020", 50)
        //InventoryWear(char, "LeatherToeCuffs", "ItemBoots", "#000000", 50)
        //CharacterSetActivePose(char, "Kneeling", true)
        //ServerSend("ChatRoomCharacterPoseUpdate", { Pose: char.ActivePose });
        ServerSend("ChatRoomChat", { Content: " grabs for a chain", Type: "Emote", });
        ChatRoomCharacterUpdate(char);
        setTimeout(function (Player) { prepareSlave4(sender, char, playerList, newSlaves) }, 8 * 1000)
    }
}
function prepareSlave4(sender, char, playerList, newSlaves) {
    InventoryWear(char, "LeatherMittens", "ItemHands", "202020", 50)
    //InventoryWear(char, "LeatherToeCuffs", "ItemBoots", "#000000", 50)
    InventoryWear(char, "CollarChainShort", "ItemNeckRestraints", "Default", 50)
    ServerSend("ChatRoomChat", { Content: " laughs about " + charname(char), Type: "Emote", });
    //move
    for (var D = 0; D < ChatRoomCharacter.length; D++) {
        targetPos = 0
        slaveRow = true
        if (slaveRow && isSlave(ChatRoomCharacter[D].MemberNumber))
            targetPos++
        //pet her
        else {
            slaveRow = false
        }
        if ((ChatRoomCharacter[D].MemberNumber) == char.MemberNumber)
            sourcePos = D
    }

    if (sourcePos > targetPos) {
        for (let i = 0; i < sourcePos - targetPos; i++) {
            ServerSend("ChatRoomAdmin", {
                MemberNumber: char.MemberNumber,
                Action: "MoveLeft",
                Publish: i === 0
            });
        }
    }
    ChatRoomCharacterViewMoveTarget = char.MemberNumber
    if (ChatRoomCharacterViewMoveTarget !== Player.MemberNumber) {
        ServerSend("ChatRoomAdmin", {
            MemberNumber: Player.ID,
            TargetMemberNumber: ChatRoomCharacterViewMoveTarget,
            DestinationMemberNumber: Player.MemberNumber,
            Action: "Move"
        });
        ChatRoomUpdateDisplay()
    }
    ChatRoomCharacterViewMoveTarget = null;
    ChatRoomCharacterUpdate(char);
    memberNumber = char.MemberNumber
    personContent = convertPers(char)
    saveCharResult(memberNumber, personContent, gamekey)
    setTimeout(function (Player) { prepareSlaves4selling(sender, playerList, newSlaves) }, 1000)
}
function releaseSlave(slaveObj) {
    memberNumber = slaveObj.MemberNumber
    if (memberNumber in guestList) {
        guestList[memberNumber].role = 'customer'
        guestList[memberNumber].StarMoney += 100
        guestList[memberNumber].Description = 'free and not a slave anymore'
        personContent = convertPers(slaveObj)
        saveCharResult(memberNumber, personContent, gamekey)
    }
    removeRestrains(slaveObj)
    reapplyClothing(slaveObj)
    ChatRoomCharacterUpdate(slaveObj)
}
// ------------------- Presenting ------------------
function presentSlaves(sender, playerList) {
    if (playerList.length > 0) {
        delinquent = playerList.shift()
        char = charFromMemberNumber(delinquent)
        if (isSlave(delinquent))
            presentSlave(sender, char, playerList)
        else {
            answer = charname(char) + " is not enslaved!"
            sendAnswer(sender, answer)
            setTimeout(function (Player) { presentSlaves(sender, playerList) }, 6 * 1000)
        }
        //setTimeout(function (Player) { presentSlave(playerList) }, Math.floor(Math.random() * 2000 + 150, Player))
    }
    else {
        answer = 'That\'s all from stock'
        sendAnswer(sender, answer)
    }

}
function presentSlave(sender, char, playerList) {
    answer = 'Look here - ' + charname(char) + nl
    answer = answer + guestList[char.MemberNumber].Description + nl
    answer = answer + "Difficulty level : " + char.GetDifficulty() + nl
    answer = answer + "Lovers " + char.GetLoversNumbers().length + nl
    if (char.IsFullyOwned()) answer = answer + "... already owned slave" + nl
    if (char.IsOwner()) answer = answer + "... owns slaves! " + nl
    ServerSend("ChatRoomChat", { Content: answer, Type: "Chat" });
    setTimeout(function (Player) { presentSlave2(sender, char, playerList) }, 6 * 1000)
}
function presentSlave2(sender, char, playerList) {
    answer = 'Your very special price with maximum discount:   ' + guestList[char.MemberNumber].Price + nl
    sendAnswer(sender, answer)
    setTimeout(function (Player) { presentSlaves(sender, playerList) }, 6 * 1000)
}
//function test {} 
//------------------ Selling ----------------------
function soldSlave(buyer, slaveObj) {

    dressColor = ""
    // own haicolor
    for (var ii = 0; ii < buyer.Appearance.length; ii++) {
        if (buyer.Appearance[ii].Asset.Group.Name == 'HairFront') {
            dressColor = buyer.Appearance[ii].Color
            if (!(typeof dressColor === 'string')) {
                dressColor = dressColor[0];
            }
            break;
        }
    }
    // leash her 
    removeRestrains(slaveObj)
    reapplyClothing(slaveObj)
    //InventoryWear(slaveObj, "LeatherChoker", "ItemNeck",dressColor,20)
    InventoryWear(slaveObj, "AutoShockCollar", "ItemNeck", dressColor, 20)
    InventoryWear(slaveObj, "TransportJacket", "ItemArms", [dressColor, "#801612", dressColor, "#eee", "#801612", dressColor], 40)
    InventoryWear(slaveObj, "Ribbons", "ItemTorso", dressColor, 40)
    InventoryWear(slaveObj, "CollarShockUnit", "ItemNeckAccessories", dressColor, 40)

    ChatRoomCharacterUpdate(slaveObj)
    //communicate lockcode
    //move her 
    // Communmicate all 
    // change role 
    setTimeout(function (Player) { soldSlave2(buyer, slaveObj, dressColor) }, Math.floor(Math.random() * 10000 + 1000, Player))
}

function soldSlave2(buyer, item, dressColor) {
    // leash her 
    InventoryWear(item, "EscortAnkleCuffs", "ItemFeet", dressColor, 40)
    InventoryWear(item, "ChainLeash", "ItemNeckRestraints", dressColor, 50)
    //InventoryWear(item, "ItemDevices", "Trolley", dressColor, 50)
    ChatRoomCharacterUpdate(item)
    //communicate lockcode
    lockCode = guestList[item.MemberNumber].lockCode
    ServerSend("ChatRoomChat", { Content: charname(item) + " lock Code : " + lockCode, Type: "Whisper", Target: buyer.MemberNumber });

    // money 
    CharacterChangeMoney(Player, guestList[item.MemberNumber].Price);
    //move her 
    for (var D = 0; D < ChatRoomCharacter.length; D++) {
        targetPos = 0
        sourcePos = 0
        if ((ChatRoomCharacter[D].MemberNumber) == buyer.MemberNumber)
            targetPos = D - 1
        if ((ChatRoomCharacter[D].MemberNumber) == item.MemberNumber)
            sourcePos = D
        if (targetPos < 0) targetPos = 0
    }
    if (targetPos > sourcePos)
        for (let i = 0; i < targetPos - sourcePos; i++) {
            ServerSend("ChatRoomAdmin", {
                MemberNumber: item.MemberNumber,
                Action: "MoveRight",
                Publish: i === 0
            });
        }
    if (sourcePos > targetPos) {
        for (let i = 0; i < sourcePos - targetPos; i++) {
            ServerSend("ChatRoomAdmin", {
                MemberNumber: item.MemberNumber,
                Action: "MoveLeft",
                Publish: i === 0
            });
        }
    }
    ChatRoomCharacterViewMoveTarget = item.MemberNumber
    if (ChatRoomCharacterViewMoveTarget !== buyer.MemberNumber) {
        ServerSend("ChatRoomAdmin", {
            MemberNumber: Player.ID,
            TargetMemberNumber: ChatRoomCharacterViewMoveTarget,
            DestinationMemberNumber: buyer.MemberNumber,
            Action: "Move"
        });
        ChatRoomUpdateDisplay()
    }
    ChatRoomCharacterViewMoveTarget = null;
    // Communmicate all 
    ServerSend("ChatRoomChat", { Content: charname(buyer) + " have fun ! ", Type: "Chat" });
    // change role 
    guestList[item.MemberNumber].role = "sold"
    guestList[buyer.MemberNumber].totalPointsGained += 1
    //setTimeout(function (Player) { soldslave3() }, Math.floor(Math.random() * 10000 + 1000, Player))
}

//-------------------Storage ------------------------
function convertPers(SenderCharacter) {
    per = new (personStorageData)
    per.watcher = false
    if (SenderCharacter.MemberNumber in guestList) {
        personData = guestList[SenderCharacter.MemberNumber]
    }
    if (personData != null) {
        per.name = personData.name
        per.role = personData.role
        per.points = personData.points
        per.totalPointsGained = personData.totalPointsGained
        per.lockCode = personData.lockCode
        per.punishmentPoints = personData.punishmentPoints
        per.Price = personData.Price
        per.StarMoney = personData.StarMoney
    }
    return per
}
//Restore saved data 
function reconvertPers(personContent, char) {
    if (personContent == null)
        return false
    if (personContent.name != "") {
        guestList[char.MemberNumber] = new personMagicData()
        guestList[char.MemberNumber].name = personContent.name
        guestList[char.MemberNumber].role = personContent.role
        guestList[char.MemberNumber].points = personContent.points
        guestList[char.MemberNumber].totalPointsGained = personContent.totalPointsGained
        guestList[char.MemberNumber].lockCode = personContent.lockCode
        guestList[char.MemberNumber].punishmentPoints = personContent.punishmentPoints
        guestList[char.MemberNumber].Price = personContent.Price
        guestList[char.MemberNumber].StarMoney = personContent.StarMoney
    }
    return true
}
function checkSlave() {
    console.log("Checkslave, time : " + timestamp(new Date()))
    checkGuests()
    game.status = 'punishment"'
    countps = 0
    for (var D = 0; D < ChatRoomCharacter.length; D++) {
        addVisitorToList(ChatRoomCharacter[D])
        if (ChatRoomCharacter[D].MemberNumber in guestList)
            if (guestList[ChatRoomCharacter[D].MemberNumber].punishmentPoints > 0) {
                guestList[ChatRoomCharacter[D].MemberNumber].beingPunished = true
                if (isCustomer(ChatRoomCharacter[D].MemberNumber)) {
                    memorizeClothing(ChatRoomCharacter[D])
                    removeClothes(ChatRoomCharacter[D], true, false)
                }
                if (isSlave(ChatRoomCharacter[D].MemberNumber)) {
                    InventoryWear(ChatRoomCharacter[D], "HarnessBallGag1", "ItemMouth2", "#000000", 50)
                }
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
            else {
                //Good girl treatment
                if (isSlave(ChatRoomCharacter[D].MemberNumber)) {
                    //guestList[ChatRoomCharacter[D].MemberNumber].beingPunished = true
                    guestList[ChatRoomCharacter[D].MemberNumber].punishmentPoints = -1
                    //prepare punishment
                    //rearrange  binding
                    InventoryRemove(ChatRoomCharacter[D], "ItemMouth2")
                    InventoryRemove(ChatRoomCharacter[D], "ItemArms")
                    InventoryWear(ChatRoomCharacter[D], "Ceiling Shackles", "ItemArms", ["#11161B", "#403E40", "#11161B", "#403E40", "#11161B", "#403E40"], 50)
                    InventoryRemove(ChatRoomCharacter[D], "ItemHands")
                    //InventoryWear(char, "LeatherToeCuffs", "ItemBoots", "#000000", 50)
                    InventoryRemove(ChatRoomCharacter[D], "ItemNeckRestraints")
                    InventoryWear(ChatRoomCharacter[D], "CollarChainLong", "ItemNeckRestraints", "Default", 50)
                    ChatRoomCharacterUpdate(ChatRoomCharacter[D])
                    countps++
                }
            }
    }
    if (countps == 0) {
        ServerSend("ChatRoomChat", { Content: "Good girls, no punishment needed!", Type: "Chat" });
        game.status = "offering"
        setTimeout(function (Player) { CheckCustomer() }, Math.floor(Math.random() * 750000 + 50000, Player))
    }
    else {
        ServerSend("ChatRoomChat", { Content: "It is reward time!", Type: "Chat" });
        InventoryWear(Player, "HeartCrop", "ItemHandheld", "#CCF6B7")
        //punishment crop
        ChatRoomCharacterUpdate(Player)
        setTimeout(function (Player) { CheckSlavePunishment() }, Math.floor(Math.random() * 16000 + 10000, Player))
    }
}
function CheckSlavePunishment() {
    var emptyGuest = 0
    for (memberNumber in guestList) {
        if (guestList[memberNumber].beingPunished) {
            emptyGuest++
            char = charFromMemberNumber(memberNumber)
            ServerSend("ChatRoomChat", { Content: charname(char) + ": " + guestList[memberNumber].punishmentPoints + " punishmentPoints", Type: "Whisper", Target: char.MemberNumber })
            spankCustomer(memberNumber)
            guestList[memberNumber].punishmentPoints--
            if (guestList[memberNumber].punishmentPoints <= 0) {
                ServerSend("ChatRoomChat", { Content: "Your punishment for misbehaving is done", Type: "Whisper", Target: char.MemberNumber });
                //InventoryGet(char, "ItemVulva").Property = { Mode: "Edge", Intensity: 2, Effect: ["Egged", "Vibrating"] }
                guestList[memberNumber].beingPunished = false
                if (isCustomer(char.MemberNumber)) {
                    reapplyClothing(char, true)
                }
            }
            break
        }
        else {
            if (isSlave(memberNumber) && (guestList[memberNumber].punishmentPoints == -1)) {
                emptyGuest++
                char = charFromMemberNumber(memberNumber)
                motivateCustomer(memberNumber)
                //remove dildo
                //restore binding
                InventoryRemove(char, "ItemArms")
                InventoryWear(char, "SturdyLeatherBelts", "ItemArms", ["#11161B", "#403E40", "#11161B", "#403E40", "#11161B", "#403E40"], 50)
                InventoryLock(char, InventoryGet(char, "ItemArms"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber)
                InventoryGet(char, "ItemArms").Property.CombinationNumber = guestList[memberNumber].lockCode
                //InventoryWear(char, "LeatherMittens", "ItemHands", "202020", 50)
                //InventoryWear(char, "LeatherToeCuffs", "ItemBoots", "#000000", 50)
                InventoryRemove(char, "ItemNeckRestraints")
                InventoryWear(char, "CollarChainShort", "ItemNeckRestraints", "Default", 50)
                InventoryWear(char, "VibratingDildo", "ItemVulva", "Default")

                //InventoryGet(ChatRoomCharacter[D], "ItemVulva").Property = { Mode: "Maximum", Intensity: 3, Effect: ["Egged", "Vibrating"] }
                InventoryGet(char, "ItemVulva").Property = { Mode: "Low", Intensity: 1, Effect: ["Random", "Vibrating"] }

                guestList[memberNumber].punishmentPoints = 0
                ChatRoomCharacterUpdate(char)
                break
            }
        }
    }
    if (emptyGuest == 0) {
        InventoryRemove(Player, "ItemHandheld")
        ChatRoomCharacterUpdate(Player)
        ServerSend("ChatRoomChat", { Content: "All reward is applied! ", Type: "Chat" });
        setTimeout(function (Player) { CheckCustomer() }, Math.floor(Math.random() * 9000 + 6000, Player))
    } else
        //timeoutHandle = setTimeout(choosePunishment, Math.floor(Math.random() * 40) * 1000)
        setTimeout(function (Player) { CheckSlavePunishment() }, Math.floor(Math.random() * 10000 + 1000, Player))
    return true
}
function CheckCustomer() {
    console.log("CheckCustomer, time : " + timestamp(new Date()))
    for (memberNumber in guestList) {
        if (guestList[memberNumber].beingPunished) {
            char = charFromMemberNumber(memberNumber)
            if (guestList[memberNumber].punishmentPoints <= 0) {
                guestList[memberNumber].beingPunished = false
                if (isCustomer(char.MemberNumber)) {
                    reapplyClothing(char, true)
                }
            }
        }
    }
    setTimeout(function (Player) { checkSlave() }, Math.floor(Math.random() * 150000 + 72000))
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
function motivateCustomer(memberNumber) {
    char = charFromMemberNumber(memberNumber)
    ServerSend("ChatRoomChat", { Content: "well behaved " + charname(char), Type: "Chat" });
    targetGroup = ActivityGetGroupOrMirror(Player.AssetFamily, "ItemHead")
    activity = ActivityAllowedForGroup(char, "ItemHead").find(function (obj) {
        return obj.Activity.Name == "Pet";
    })
    if (activity == null) {
        activity = ActivityAllowedForGroup(char, "ItemHead").find(function (obj) {
            return obj.Activity.Name == "Kiss";
        })
        if (activity == null)
            activity = ActivityAllowedForGroup(char, "ItemHead").find(function (obj) {
                return obj.Activity.Name == "Caress";
            })
    }
    if (activity != null)
        ActivityRun(Player, char, targetGroup, activity)
    else
        console.log(memberNumber, " petting is not possible")
}
function findNumberfromCharname(sellername) {
    sellernumber = 0
    if ((sellername != null) && (sellername != ""))
        for (let C = 0; C < ChatRoomCharacter.length; C++) {
            if (charname(ChatRoomCharacter[C]).toLowerCase() == sellername.toLowerCase()) {
                sellernumber = ChatRoomCharacter[C].MemberNumber;
                break;
            }
        }
    console.log(sellernumber)
    return sellernumber
}

//ItemDevices,Kennel,Heavy Kennel