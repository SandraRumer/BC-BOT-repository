
if (typeof timeoutHandle === 'undefined') {
  var timeoutHandle
}


// -----------------------------------------------------------------------------------------------

inspectionList = [
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

  inspectionList = [
    
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
actionList= [
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
      prepareInspection()
      setTimeout(function (Player) { performInspection() }, timeoutFactor * 500, Player)

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


function prepareInspection() {
  count = 0
  InventoryWear(Player, "LargeDildo", "ItemHandheld", "#B378E5")
  //if (ChatRoomCharacter[D].HasVagina()) {   *** not definded ! 
  //      InventoryRemove(ChatRoomCharacter[D],"ItemVulva")
  // }
  ChatRoomCharacterUpdate(Player)

  for (var D = 0; D < ChatRoomCharacter.length; D++) {
    if (ChatRoomCharacter[D].MemberNumber != Player.MemberNumber && !ChatRoomCharacter[D].IsOwned() && (ReputationCharacterGet(ChatRoomCharacter[D], "Dominant") < 89)) {
      memorizeClothing(ChatRoomCharacter[D])
      delinquent = ChatRoomCharacter[D]
      removeClothes(ChatRoomCharacter[D], false, false)
      ServerSend("ChatRoomChat", { Content: "Preparing  " + delinquent.Name + " for inspection ", Type: "Chat" });
      ChatRoomCharacterUpdate(delinquent)
      count++
      ServerSend("ChatRoomChat", { Content: delinquent.Name + " you must be naked for inspection.", Type: "Chat", Target: delinquent.MemberNumber });
    }
    else
      console.log(ChatRoomCharacter[D].MemberNumber + " " + ChatRoomCharacter[D].Name + " couldn't inspected")
  }
}

function performInspection() {
  playerList = []
  for (var D = 0; D < ChatRoomCharacter.length; D++) {
    if (ChatRoomCharacter[D].MemberNumber != Player.MemberNumber && (ReputationCharacterGet(ChatRoomCharacter[D], "Dominant") < 89)) {
      delinquent = ChatRoomCharacter[D]
      count++
      playerList.push(ChatRoomCharacter[D])
      ServerSend("ChatRoomChat", { Content: "Inspection candidate: " + ChatRoomCharacter[D].Name, Type: "Chat" });
      //setTimeout(actionStep (delinquent, 0),800*1000)
       //nextStep( delinquent ,0)
      //  for (var inspectionStep = 0; inspectionStep  < inspectionList.length; inspectionStep ++)
      //  {
      //    timeoutHandle = setTimeout(actionStep (delinquent, inspectionStep),inspectionStep*100*1000)

      //  }
    }
    else
      console.log(ChatRoomCharacter[D].MemberNumber + " " + ChatRoomCharacter[D].Name + " Inspection not possible")
  }
  setTimeout(function (Player) { performSingleInspection(playerList) }, timeoutFactor * 1000, Player)
}

//function performSingleInspection()//
//{
//  conole.log("performSingleInspection function")
//  performSingleInspection(playerList) 
//} 

function performSingleInspection(playerList) {
console.log("performSingleInspection" + playerList.length)
  if (playerList.length > 0) {
    actdelinquent = playerList.shift()
    removeClothes(actdelinquent, true, false)
    ChatRoomCharacterUpdate(actdelinquent)
    ServerSend("ChatRoomChat", { Content: "Inspection is performed on:" + actdelinquent.Name, Type: "Chat" });
     setTimeout(function (Player) { actionStep(actdelinquent, 0, playerList) }, timeoutFactor * 1000, Player)
  }
  else
  {
    setTimeout(function (Player) { finishInspection() }, timeoutFactor * 6000, Player)
    }
}


function actionStep(char, step, playerList) {
  console.log(step)
  console.log("actionStep " + playerList.length)
  if (char.HasPenis()) {
    if (inspectionList[step] == "ItemVulva") {
      step++
      nextStep(char, step, playerList)
      return
    }
  }
  if (char.HasVagina()) {
    if (inspectionList[step] == "ItemPenis") {
      step++
      nextStep(char, step, playerList)
      return
    }
  }
  targetGroup = ActivityGetGroupOrMirror(char.AssetFamily, inspectionList[step])
  activity = ActivityAllowedForGroup(char, inspectionList[step]).find(function (obj) {
    return obj.Activity.Name == actionList[step];
  })
  console.log(targetGroup)
  console.log(activity)
  if (activity == null)
    console.log("null")
  else
    ActivityRun(Player, char, targetGroup, activity)
  step++
  nextStep(char, step,playerList)
}

function nextStep(delinquent, step, playerList) {
  clearTimeout(timeoutHandle)
  if (step >= inspectionList.length)
    //timeoutHandle = setTimeout(finishInspection(delinquent), 8000*1000)
    setTimeout(function (Player) { finishSingleInspection(delinquent, playerList) }, timeoutFactor * 1500, Player)
  else {
    //timeoutHandle = setTimeout(actionStep (delinquent, step),100*1000)
    setTimeout(function (Player) { actionStep(delinquent, step, playerList) }, timeoutFactor * 1000, Player)
  }
}
function finishSingleInspection(char,playerList) {
  console.log("finish")
  ServerSend("ChatRoomChat", { Content: "Inspection of   " + char.Name + " is over ", Type: "Chat" });
  ServerSend("ChatRoomChat", { Content: `No hidden weapon, drugs or explosive found!`, Type: "Chat" });
  ServerSend("ChatRoomChat", { Content: `Well done`, Type: "Chat", Target: char.MemberNumber });
  reapplyClothing(char)
  performSingleInspection(playerList)
  }
function finishInspection() {
  InventoryRemove(Player, "ItemHandheld")
  ServerSend("ChatRoomChat", { Content: "Inspection of all slaves is over ", Type: "Chat" });
}