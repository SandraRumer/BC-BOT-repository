
if (typeof timeoutHandle === 'undefined') {
  var timeoutHandle
}

//to Do : large Dildo

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
  "ItemTorso",
  "ItemTorso2",
  "ItemPelvis",
  "ItemVulva",
  "ItemVulvaPiercings",
  "ItemButt",
  "ItemLegs",
  "ItemFeet",
  "ItemFeet",
  "ItemFeet"
]
t =
  [
    "ItemNipplesPiercings",
    "ItemDevices"
  ]


actionList = [
  "TakeCare",//had/ face
  "Caress", //had/ face
  "Caress",//nose 
  "Caress", //ears //
  "Caress", //ears  "Whisper", //ears
  "Caress",//mouth 
  "Caress",//mouthtodo "Kiss", //mouth
  "Caress",// "PenetrateSlow", //mouth todo penetrate   
  "Caress",//neck
  "MassageHands",//neck
  "Caress",//breast
  "Caress",//nippls
  "Caress",//niples
  "Caress", //arms
  "MassageHands",//arms
  "Caress",  //Torso
  "MassageHands",  //Torso"MassageHands",  //Torso
  "Caress", //"MassageHands",  //Pelvis
  "MasturbateItem", //"PenetrateSlow", // Vulva
  "Caress", // "PenetrateSlow", //Clitoris
  "Spank", //butt
  "Caress",  //Legs
  "Caress",  //feet
  "Tickle",  //feet
  "MassageHands" //feet
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
    if (ChatRoomCharacter[D].MemberNumber != Player.MemberNumber && !ChatRoomCharacter[D].IsOwned() && (ReputationCharacterGet(ChatRoomCharacter[D], "Dominant") < 50)) {
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
  for (var D = 0; D < ChatRoomCharacter.length; D++) {
    if (ChatRoomCharacter[D].MemberNumber != Player.MemberNumber && !ChatRoomCharacter[D].IsOwned() && (ReputationCharacterGet(ChatRoomCharacter[D], "Dominant") < 50)) {
      delinquent = ChatRoomCharacter[D]
      removeClothes(delinquent, true, false)
      count++
      ServerSend("ChatRoomChat", { Content: "Performing Inspection for " + ChatRoomCharacter[D].Name, Type: "Chat" });
      //setTimeout(actionStep (delinquent, 0),800*1000)
      ChatRoomCharacterUpdate(delinquent)
      setTimeout(function (Player) { actionStep(delinquent, 0) }, timeoutFactor * 1000, Player)
      //nextStep( delinquent ,0)
      //  for (var inspectionStep = 0; inspectionStep  < inspectionList.length; inspectionStep ++)
      //  {
      //    timeoutHandle = setTimeout(actionStep (delinquent, inspectionStep),inspectionStep*100*1000)

      //  }

    }
    else
      console.log(ChatRoomCharacter[D].MemberNumber + " " + ChatRoomCharacter[D].Name + " Inspection not possible")
  }


}


function actionStep(char, step) {
  console.log(step)
  targetGroup = ActivityGetGroupOrMirror(Player.AssetFamily, inspectionList[step])
  activity = ActivityAllowedForGroup(Player, inspectionList[step]).find(function (obj) {
    return obj.Activity.Name == actionList[step];
  })
  console.log(targetGroup)
  console.log(activity)
  if (activity == null)
    console.log ("null") 
    else
  ActivityRun(Player, char, targetGroup, activity)
  step++
  nextStep(char, step)
}

function nextStep(delinquent, step) {
  clearTimeout(timeoutHandle)
  if (step >= inspectionList.length)
    //timeoutHandle = setTimeout(finishInspection(delinquent), 8000*1000)
    setTimeout(function (Player) { finishInspection(delinquent) }, timeoutFactor * 1500, Player)
  else {
    //timeoutHandle = setTimeout(actionStep (delinquent, step),100*1000)
    setTimeout(function (Player) { actionStep(delinquent, step) }, timeoutFactor * 1000, Player)
  }
  function finishInspection(char) {
    console.log("finish")
    ServerSend("ChatRoomChat", { Content: "Inspection of   " + char.Name + " done ", Type: "Chat" });
    ServerSend("ChatRoomChat", { Content: `No weapon, drugs or explosive found!`, Type: "Chat" });
    InventoryRemove(Player, "ItemHandheld")
    ServerSend("ChatRoomChat", { Content: `Well done`, Type: "Chat", Target: char.MemberNumber });
    reapplyClothing(char)

  }


}