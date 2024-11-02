
if (typeof timeoutHandle === 'undefined') {
  var timeoutHandle
}


// -----------------------------------------------------------------------------------------------

regionsList = [
  "ItemHead",
  "ItemHead",
  "ItemNose",
  "ItemEars",
  "ItemEars",
  "ItemMouth",
  "ItemMouth",
  "ItemMouth",
  "ItemNeck",
  "ItemNeck",
  "ItemBreast",
  "ItemNipples",
  "ItemNipples",
  "ItemArms",
  "ItemArms",
  "ItemHands",
  "ItemTorso",
  "ItemTorso2",
  "ItemPelvis",
  "ItemVulva",
  "ItemVulva",
  "ItemVulva",
  "ItemPenis",
  "ItemVulvaPiercings",
  "ItemVulvaPiercings",
  "ItemVulvaPiercings",
  "ItemButt",
  "ItemButt",
  "ItemButt",
  "ItemLegs",
  "ItemFeet",
  "ItemFeet",
  "ItemFeet",
  "ItemBoots",
  "ItemBoots",
  "ItemBoots",
  "ItemHands",
  "ItemBoots",
  "ItemMouth"
]
t =
  [
    "ItemNipplesPiercings",
    "ItemDevices"
  ]

regionsList = [

  "ItemVulva",
  "ItemVulva",
  "ItemVulva",
  "ItemPenis",
  "ItemVulvaPiercings",
  "ItemVulvaPiercings",
  "ItemVulvaPiercings",
  "ItemButt",
  "ItemButt",
  "ItemButt"
]



actionList = [
  "TakeCare",//had/ face
  "Caress", //had/ face
  "Caress",//nose 
  "Caress", //ears //
  "Whisper", //ears  "Whisper", //ears
  "Caress",//mouth 
  "Kiss",//mouthtodo "Kiss", //mouth
  "PenetrateSlow", //mouth 
  "Caress",//neck
  "MassageHands",//neck
  "Caress",//breast
  "Caress",//nippls
  "Lick",//niples
  "Caress", //arms
  "MassageHands",//arms
  "Caress", //hands
  "Caress",  //Torso
  "MassageHands",  //Torso"MassageHands",  //Torso
  "Caress", //Pelvis
  "Caress", //Vulva
  "PenetrateSlow", //Vulva 
  "MasturbateItem", //"PenetrateSlow", // Vulva
  "Caress", //Penis 
  "Caress", // "PenetrateSlow", //Clitoris
  "Slap", ////Clitoris
  "MasturbateItem", //Clitoris
  "Caress",  //butt
  "Spank", //butt
  "PenetrateSlow", //butt
  "Caress",  //Legs
  "Caress",  //feet
  "Tickle",  //feet
  "MassageHands", //feet
  "Caress",  //boots
  "MassageHands", //boots
  "Tickle",  //boots
  "TakeCare",//boots
  "TakeCare",//arms
  "frenchKiss"
]
actionList = [
  "Caress", //Vulva
  "PenetrateSlow", //Vulva 
  "MasturbateItem", //"PenetrateSlow", // Vulva
  "Caress", //Penis 
  "Caress", // "PenetrateSlow", //Clitoris
  "Slap", ////Clitoris
  "MasturbateItem", //Clitoris
  "Caress",  //butt
  "Spank", //butt
  "PenetrateSlow" //butt
]

s = [
  "Spank", "Tickle", "Caress", "Caress"]
timeoutFactor = 30
timeoutFactor = 5
ChatRoomMessageAdditionDict["Inspection"] = function (SenderCharacter, msg, data) { ChatRoomMessageInspection(SenderCharacter, msg, data) }

function ChatRoomMessageInspection(sender, msg, data) {
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
  if (sender.MemberNumber != Player.MemberNumber) {

    if (msg.toLowerCase().includes("point")) {
      if (msg.includes("point")) {
        console.log("point")
      }
    }
  } else {
    if (msg.includes("inspect")) {
      console.log("inspect")
      performInspection()
    }
    else {
      if (msg.includes("punish")) {
        console.log("punishment")
        performPunishment()
      }


    }

  }
}

function removeClothes(char, removeUnderwear = true, removeCosplay = false) {
  target = getCharacterObject(char)
  InventoryRemove(target, "Cloth")
  InventoryRemove(target, "ClothLower")
  InventoryRemove(target, "ClothAccessory")
  InventoryRemove(target, "Suit")
  InventoryRemove(target, "SuitLower")
  InventoryRemove(target, "Gloves")
  InventoryRemove(target, "Shoes")
  InventoryRemove(target, "Hat")
  InventoryRemove(target, "Necklace")
  InventoryRemove(target, "RightAnklet")
  InventoryRemove(target, "LeftAnklet")
  InventoryRemove(target, "Mask")
  if (removeUnderwear) {
    InventoryRemove(target, "Socks")
    InventoryRemove(target, "Bra")
    InventoryRemove(target, "Panties")
    InventoryRemove(target, "Corset")
  }
  if (removeCosplay) {
    // Hair accessory 1: Ears & Accessories
    // Hair accessory 2: Ears only
    // Hair accessory 3: Accessories only
    InventoryRemove(target, "HairAccessory1")
    InventoryRemove(target, "HairAccessory2")
    InventoryRemove(target, "HairAccessory3")
    InventoryRemove(target, "TailStraps")
    InventoryRemove(target, "Wings")
  }
}


function performInspection() {
  count = 0
  playerList = []
  InventoryWear(Player, "LargeDildo", "ItemHandheld", "#B378E5")
  ChatRoomCharacterUpdate(Player)
  for (var D = 0; D < ChatRoomCharacter.length; D++) {
    if (ChatRoomCharacter[D].MemberNumber != Player.MemberNumber && !ChatRoomCharacter[D].IsOwned() && (ReputationCharacterGet(ChatRoomCharacter[D], "Dominant") < 89)) {
      memorizeClothing(ChatRoomCharacter[D])
      delinquent = ChatRoomCharacter[D]
      count++
      playerList.push(ChatRoomCharacter[D])
      removeClothes(ChatRoomCharacter[D], false, false)
      ServerSend("ChatRoomChat", { Content: "Preparing  " + delinquent.Name + " for inspection ", Type: "Chat" });
      ChatRoomCharacterUpdate(delinquent)
      count++
      ServerSend("ChatRoomChat", { Content: delinquent.Name + " you must be naked for inspection.", Type: "Chat", Target: delinquent.MemberNumber });
    }
    else
      console.log(ChatRoomCharacter[D].MemberNumber + " " + ChatRoomCharacter[D].Name + " couldn't inspected")
  }
  action = 1
  setTimeout(function (Player) { performSinglePlayer(playerList), action }, timeoutFactor * 1000, Player)
}


function performSinglePlayer(playerList, action) {
  console.log("performSingleInspection" + playerList.length)
  if (playerList.length > 0) {
    actdelinquent = playerList.shift()
    removeClothes(actdelinquent, true, false)
    ChatRoomCharacterUpdate(actdelinquent)
    ServerSend("ChatRoomChat", { Content: Player.Name + " turns towards :" + actdelinquent.Name, Type: "Chat" });
    setTimeout(function (Player) { actionStep(actdelinquent, 0, playerList, action) }, timeoutFactor * 1000, Player)
  }
  else {
    setTimeout(function (Player) { finishAction(action) }, timeoutFactor * 6000, Player)
  }
}


function actionStep(char, step, playerList, action) {
  console.log(step)
  console.log("actionStep - PlayerList : " + playerList.length)
  if (char.HasPenis()) {
    if (regionsList[step] == "ItemVulva") {
      step++
      nextStep(char, step, playerList, action)
      return
    }
  }
  if (char.HasVagina()) {
    if (regionsList[step] == "ItemPenis") {
      step++
      nextStep(char, step, playerList,action)
      return
    }
  }
  targetGroup = ActivityGetGroupOrMirror(char.AssetFamily, regionsList[step])
  activity = ActivityAllowedForGroup(char, regionsList[step]).find(function (obj) {
    return obj.Activity.Name == actionList[step];
  })
  console.log(targetGroup)
  console.log(activity)
  if (activity == null)
    console.log("null")
  else
    ActivityRun(Player, char, targetGroup, activity)
  step++
  nextStep(char, step, playerList, action)
}

function nextStep(delinquent, step, playerList, action) {
  clearTimeout(timeoutHandle)
  if (step >= regionsList.length)
    setTimeout(function (Player) { finishSingleAction(delinquent, playerList, action) }, timeoutFactor * 1500, Player)
  else {
    setTimeout(function (Player) { actionStep(delinquent, step, playerList, action) }, timeoutFactor * 1000, Player)
  }
}
function finishSingleAction(char, playerList, action) {
  console.log("finish - Action : "+ action )
  if (action == 1) {
    ServerSend("ChatRoomChat", { Content: "Inspection of   " + char.Name + " is over ", Type: "Chat" });
    ServerSend("ChatRoomChat", { Content: `No hidden weapon, drugs or explosive found!`, Type: "Chat" });
    ServerSend("ChatRoomChat", { Content: `Well done`, Type: "Chat", Target: char.MemberNumber });
    reapplyClothing(char)
    performSinglePlayer(playerList, 1)
  }
  if (action == 2) {
    ServerSend("ChatRoomChat", { Content: "Punishment of " + char.Name + " is done ", Type: "Chat" });
    //reapplyClothing(char)
    performSinglePlayer(playerList, 2)
  }
}


function finishAction(action) {
  InventoryRemove(Player, "ItemHandheld")
  ServerSend("ChatRoomChat", { Content: "Done.", Type: "Chat" });
}


function performPunishment() {
  count = 0
  playerList = []
  InventoryWear(Player, "LargeDildo", "ItemHandheld", "#B378E5")
  ChatRoomCharacterUpdate(Player)
  for (var D = 0; D < ChatRoomCharacter.length; D++) {
    if (ChatRoomCharacter[D].MemberNumber != Player.MemberNumber && !ChatRoomCharacter[D].IsOwned() && (ReputationCharacterGet(ChatRoomCharacter[D], "Dominant") < 89)) {
      memorizeClothing(ChatRoomCharacter[D])
      delinquent = ChatRoomCharacter[D]
      count++
      playerList.push(ChatRoomCharacter[D])
      removeClothes(ChatRoomCharacter[D], false, false)
      ServerSend("ChatRoomChat", { Content: "Preparing  " + delinquent.Name + " for punishment ", Type: "Chat" });
      ChatRoomCharacterUpdate(delinquent)
      count++
      ServerSend("ChatRoomChat", { Content: delinquent.Name + " you must be bound and naked for punishment.", Type: "Chat", Target: delinquent.MemberNumber });
    }
    else
      console.log(ChatRoomCharacter[D].MemberNumber + " " + ChatRoomCharacter[D].Name + " couldn't punished")
  }
  action = 2
  setTimeout(function (Player) { performSinglePlayer(playerList, action) }, timeoutFactor * 1000, Player)
}
