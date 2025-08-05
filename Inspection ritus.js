  iVersion = "1.2"
  initDescription = Player.Description

  RoomName = "Inspection Institute"
  RoomDescription = "to inspect, punish or humiliate"
  RoomBackground = "PrisonHall"

  nl = `
  `

  if (typeof timeoutHandle === 'undefined') {
    var timeoutHandle
  }
  Player.Description = nl + `Waiting Mode ` + iVersion + ` 
  I am waiting for a new task. 
  -----------------------------------------------------------------------------------------------
  ` + nl + initDescription


  ServerSend("AccountUpdate", { Description: Player.Description });
  ChatRoomCharacterUpdate(Player)

  // -----------------------------------------------------------------------------------------------
  dressColor = "default"
  dressSandraColor = "#DD8888"

  modeList = []
  inspection = 1
  punishment = 2
  modeList[inspection] = "inspection"
  modeList[punishment] = "punishment"
  debug = false
  regionsListprep = []
  actionListprep = []
  regionsListprep[1] = [
    "ItemHead",
    "ItemHead",
    "ItemNose",
    "ItemEars",
    "ItemEars",//4
    "ItemMouth",
    "ItemMouth",
    "ItemMouth",
    "ItemNeck",//8"
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
    //  "ItemPenis",
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

  regionsListprep[2] = [
    "ItemHead",
    "ItemHead",
    "ItemNose",
    "ItemEars",
    "ItemEars",
    "ItemMouth",
    "ItemMouth",
    //"ItemMouth",
    "ItemNeck",
    "ItemNeck",
    "ItemBreast",
    "ItemNipples",//10
    "ItemNipples",
    "ItemArms",
    "ItemArms",
    "ItemHands",
    "ItemTorso",
    "ItemTorso",
    "ItemPelvis",
    "ItemVulva",
    "ItemVulva",
    //"ItemPenis",//20
    "ItemVulvaPiercings",
    "ItemVulvaPiercings",
    "ItemButt",
    "ItemButt",
    "ItemLegs",
    "ItemFeet",//27
    "ItemFeet",
    "ItemBoots",
    "ItemBoots",
    "ItemNeck",
    "ItemMouth"

  ]


  t =
    [
      "ItemNipplesPiercings",
      "ItemDevices",

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

  regionsList = [
    "ItemVulvaPenis",
    "ItemMouth"
  ]





  actionListprep[1] = [
    "TakeCare",//had/ face
    "Caress", //had/ face
    "Caress",//nose 
    "Caress", //ears //
    "Whisper", //ears  "Whisper", //4
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
    //"Caress", //Penis 
    "Caress",  //Clitoris
    "Slap", //Clitoris
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

  actionListprep[2] = [
    "Slap",//had/ face
    "LSCG_Bap", //had/ face
    "Choke",//nose 
    "Bite", //ears //
    "Whisper", //ears  "Whisper", //ears
    "Bite",//mouth 
    "Kiss",//mouthtodo "Kiss", //mouth
    //"PenetrateSlow", //mouth 
    "Choke",//neck
    "Bite",//neck
    "SpankItem",//breast
    "Bite",//nippls    10
    "Suck",//niples
    "SpankItem", //arms
    "MassageHands",//arms
    "Spank", //hands
    "Spank",  //Torso
    "SpankItem",  //Torso
    "SpankItem", //Pelvis
    "MasturbateFoot",  // Vulva 
    "SpankItem", //Vulva 
    //"Spank", //Penis 20
    "MasturbateFoot", //Clitoris
    "Kick", //Clitoris
    "Spank",  //butt
    "SpankItem", //butt
    "SpankItem",  //Legs
    "Kick",  //feet /28
    "SpankItem",  //feet
    "Kick",  //boots
    "SpankItem", //boots
    "LSCG_ReleaseNeck", // NECK Release
    "GagKiss"
  ]

  //RightHand,Fingernails,Fingernails
  //LeftHand,Fingernails,Fingernails

  actionList = [
    "Slap", //ear
    "Kiss"
  ]


  //s = [
  // "Spank", "Tickle", "Caress", "Caress",
  //   "PenetrateSlow", //Vulva 
  //   "MasturbateItem", //"PenetrateSlow", // Vulva
  //   "Caress", //Penis 
  //   "Caress", // "PenetrateSlow", //Clitoris
  //   "Slap", ////Clitoris
  //   "MasturbateItem", //Clitoris
  //   "Caress",  //butt
  //   "Spank", //butt
  //   "PenetrateSlow" //butt
  // ]
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
      all = false
      if (msg.toLowerCase().endsWith("all")) {
        all = true
      }
      if (msg.includes("inspect")) {

        all = true
        for (var D = 0; D < ChatRoomCharacter.length; D++) {
          if (msg.toLowerCase().endsWith(charname(ChatRoomCharacter[D]).toLowerCase())) {
            performSingleInspection(ChatRoomCharacter[D])
            all = false
          }

        }
        if (all) {
          console.log("inspect")
          performInspection()
        }
      }
      else {
        if (msg.includes("punish")) {
          for (var D = 0; D < ChatRoomCharacter.length; D++) {
            if (msg.toLowerCase().endsWith(charname(ChatRoomCharacter[D]).toLowerCase())) {
              performSinglePunishment(ChatRoomCharacter[D])
              all = false
            }

          }
          if (all) {
            console.log("punishment")
            performPunishment()
          }
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
    // if (!debug) {
    //   actionList.splice(0, actionList.length);
    //   regionsList.splice(0, regionsList.length);
    //   for (i = 0; i < actionListprep[inspection].length; i++) {
    //     actionList[i] = actionListprep[inspection][i];
    //   }

    //   for (i = 0; i < regionsListprep[inspection].length; i++) {
    //     regionsList[i] = regionsListprep[inspection][i];
    //   }
    //   console.log("real Inspection id: " + inspection)
    // }
    // else console.log("Inspection  in debug mode")

    prepareGlobalLists(inspection)
    playerList = []

    Player.Description = `Inspection Mode ` + iVersion + ` 
  I am inspecting. 
  -----------------------------------------------------------------------------------------------
  ` + initDescription

    ServerSend("AccountUpdate", { Description: Player.Description });
    InventoryWear(Player, "LargeDildo", "ItemHandheld", "#B378E5")
    ChatRoomCharacterUpdate(Player)
    for (var D = 0; D < ChatRoomCharacter.length; D++) {
      if (ChatRoomCharacter[D].MemberNumber != Player.MemberNumber && !ChatRoomCharacter[D].IsOwned() && (ReputationCharacterGet(ChatRoomCharacter[D], "Dominant") < 95)) {
        memorizeClothing(ChatRoomCharacter[D])
        delinquent = ChatRoomCharacter[D]
        count++
        playerList.push(ChatRoomCharacter[D])
        InventoryRemove(ChatRoomCharacter[D], "ItemHandheld")
        removeRestrains(ChatRoomCharacter[D])

        // the "halsband"
        //if (!sender.IsOwned()) {
        InventoryWear(ChatRoomCharacter[D], "LeatherChoker", "ItemNeck", ["Default", "#000000"], 50)
        //only if it is allowed to 
        //InventoryLock(sender, InventoryGet(sender, "ItemNeck"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber)
        //InventoryGet(sender, "ItemNeck").Property.CombinationNumber = customerList[sender.MemberNumber].lockCode
        //}
        InventoryWear(ChatRoomCharacter[D], "CollarChainLong", "ItemNeckRestraints", "Service Bot's - Sub Holder", 50)
        //InventoryLock(sender, InventoryGet(sender, "ItemNeckRestraints"), { Asset: AssetGet("Female3DCG", "ItemMisc", "CombinationPadlock") }, Player.MemberNumber)
        //InventoryGet(sender, "ItemNeckRestraints").Property.CombinationNumber = customerList[sender.MemberNumber].lockCode
        removeClothes(ChatRoomCharacter[D], false, false)
        CharacterSetActivePose(ChatRoomCharacter[D], "LegsClosed", true)
      ServerSend("ChatRoomCharacterPoseUpdate", { Pose: ChatRoomCharacter[D].ActivePose });
        ServerSend("ChatRoomChat", { Content: "Preparing  " + charname(delinquent) + " for inspection ", Type: "Chat" });
        ChatRoomCharacterUpdate(delinquent)
        count++
        ServerSend("ChatRoomChat", { Content: charname(delinquent) + " you must be naked for inspection.", Type: "Chat", Target: delinquent.MemberNumber });
      }
      else
        console.log(ChatRoomCharacter[D].MemberNumber + " " + charname(ChatRoomCharacter[D]) + " couldn't inspected")
      console.log(ChatRoomCharacter[D].MemberNumber + " " + charname(ChatRoomCharacter[D]) + " checked")
    }
    action = inspection

    updateRoom(RoomName, RoomDescription, RoomBackground, true, true)
    setTimeout(function (Player) { performSinglePlayer(playerList, action) }, timeoutFactor * 1000, Player)
  }

  function performSingleInspection(member) {
    count = 0
    prepareGlobalLists(inspection)
    playerList = []

    Player.Description = `Inspection Mode ` + iVersion + ` 
  I am inspecting. 
  -----------------------------------------------------------------------------------------------
  ` + initDescription

    ServerSend("AccountUpdate", { Description: Player.Description });
    InventoryWear(Player, "LargeDildo", "ItemHandheld", "#B378E5")
    ChatRoomCharacterUpdate(Player)

    memorizeClothing(member)
    count++
    playerList.push(member)
    InventoryRemove(member, "ItemHandheld")
    removeRestrains(member)
    InventoryWear(member, "LeatherChoker", "ItemNeck", ["Default", "#000000"], 50)
    InventoryWear(member, "CollarChainLong", "ItemNeckRestraints", "Service Bot's - Sub Holder", 50)
    removeClothes(member, false, false)
    ServerSend("ChatRoomChat", { Content: "Preparing  " + charname(member) + " for inspection ", Type: "Chat" });
    ChatRoomCharacterUpdate(member)
    count++
    ServerSend("ChatRoomChat", { Content: charname(member) + " you must be naked for inspection.", Type: "Chat", Target: member.MemberNumber });
    action = inspection

    updateRoom(RoomName, RoomDescription, RoomBackground, true, true)
    setTimeout(function (Player) { performSinglePlayer(playerList, action) }, timeoutFactor * 1000, Player)
  }


  function performPunishment() {
    count = 0
    prepareGlobalLists(punishment)
    playerList = []

    Player.Description = `Punish Mode ` + iVersion + ` 
  I am punishing . 
  -----------------------------------------------------------------------------------------------
  ` + initDescription

    ServerSend("AccountUpdate", { Description: Player.Description });
    InventoryWear(Player, "Whip", "ItemHandheld", "#B378E5")
    ChatRoomCharacterUpdate(Player)
    for (var D = 0; D < ChatRoomCharacter.length; D++) {
      //if (ChatRoomCharacter[D].MemberNumber != Player.MemberNumber && !ChatRoomCharacter[D].IsOwned() && (ReputationCharacterGet(ChatRoomCharacter[D], "Dominant") < 89)) {
      if (ChatRoomCharacter[D].MemberNumber != Player.MemberNumber) {
        memorizeClothing(ChatRoomCharacter[D])
        delinquent = ChatRoomCharacter[D]
        count++
        playerList.push(ChatRoomCharacter[D])
        removeClothes(ChatRoomCharacter[D], false, false)
        restrainForPunishment(ChatRoomCharacter[D])
        ServerSend("ChatRoomChat", { Content: "Preparing  " + charname(delinquent) + " for punishment ", Type: "Chat" });
        ChatRoomCharacterUpdate(delinquent)
        count++
        ServerSend("ChatRoomChat", { Content: charname(delinquent) + " you must be bound and naked for punishment.", Type: "Chat", Target: delinquent.MemberNumber });
      }
      else
        console.log(ChatRoomCharacter[D].MemberNumber + " " + ChatRoomCharacter[D].Nickname + " couldn't punished")
      console.log(ChatRoomCharacter[D].MemberNumber + " " + ChatRoomCharacter[D].Nickname + " checked")
    }
    action = punishment
    updateRoom("Punishing Institute", RoomDescription, RoomBackground, true, true)
    setTimeout(function (Player) { performSinglePlayer(playerList, action) }, timeoutFactor * 1000, Player)
  }

  function performSinglePunishment(member) {
    count = 0
    prepareGlobalLists(punishment)
    playerList = []

    Player.Description = `Punish Mode ` + iVersion + ` 
  I am punishing . 
  -----------------------------------------------------------------------------------------------
  ` + initDescription

    ServerSend("AccountUpdate", { Description: Player.Description });
    InventoryWear(Player, "Whip", "ItemHandheld", "#B378E5")
    ChatRoomCharacterUpdate(Player)


    memorizeClothing(member)
    count++
    playerList.push(member)
    removeClothes(member, false, false)
    restrainForPunishment(member)
    ServerSend("ChatRoomChat", { Content: "Preparing  " + charname(member) + " for punishment ", Type: "Chat" });
    ChatRoomCharacterUpdate(member)
    count++
    ServerSend("ChatRoomChat", { Content: charname(member) + " you must be bound and naked for punishment.", Type: "Chat", Target: member.MemberNumber });

    action = punishment
    updateRoom("Punishing Institute", RoomDescription, RoomBackground, true, true)
    setTimeout(function (Player) { performSinglePlayer(playerList, action) }, timeoutFactor * 1000, Player)


  }


  function performSinglePlayer(playerList, action) {
    console.log("performSinglePlayer  - Player List :" + playerList.length)
    if (playerList.length > 0) {
      actdelinquent = playerList.shift()
      removeClothes(actdelinquent, true, false)
      //InventoryWear(target, "StuddedBlindfold", "ItemHead", dressSandraColor, 15)
      InventoryWear(actdelinquent, "PaddedBlindfold", "ItemHead", dressSandraColor, 15)
      ChatRoomCharacterUpdate(actdelinquent)
      ServerSend("ChatRoomChat", { Content: charname(Player) + " turns towards: " + charname(actdelinquent), Type: "Chat" });
      setTimeout(function (Player) { actionStep(actdelinquent, 0, playerList, action) }, timeoutFactor * 1000, Player)
    }
    else {
      setTimeout(function (Player) { finish(action) }, timeoutFactor * 6000, Player)
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
        nextStep(char, step, playerList, action)
        return
      }
    }
    if (!characterIsHere(char)) {
      ServerSend("ChatRoomChat", { Content: charname(char) + " has fled, what a whimp", Type: "Chat" });
      setTimeout(function (Player) { performSinglePlayer(playerList, action) }, timeoutFactor * 1500, Player)
    }
    else {
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
    console.log("finish - Action : " + action)
    actionDescription = ""
    currentTime = new Date()
    if (action == 1) {

      ServerSend("ChatRoomChat", { Content: "Inspection of   " + charname(char) + " is over ", Type: "Chat" });
      ServerSend("ChatRoomChat", { Content: `No hidden weapon, drugs or explosive found!`, Type: "Chat" });
      ServerSend("ChatRoomChat", { Content: `Well done`, Type: "Chat", Target: char.MemberNumber });
      actionDescription = nl + timestamp(currentTime) + ' ' + char.MemberNumber + ' ' + charname(char) + ' inspected'
      reapplyClothing(char)
    }
    if (action == 2) {
      ServerSend("ChatRoomChat", { Content: "Punishment of " + charname(char) + " is done ", Type: "Chat" });
      actionDescription = nl + timestamp(currentTime) + ' ' + char.MemberNumber + ' ' + charname(char) + ' punished'
      //reapplyClothing(char)
    }
    InventoryRemove(char, "ItemHead")
    ChatRoomCharacterUpdate(char)
    setTimeout(function (Player) { performSinglePlayer(playerList, action) }, timeoutFactor * 1000 + 500, Player)
    Player.Description = Player.Description + actionDescription
    initDescription = initDescription + actionDescription
    ServerSend("AccountUpdate", { Description: Player.Description });
  }


  function finish(action) {

    InventoryRemove(Player, "ItemHandheld")
    ServerSend("ChatRoomChat", { Content: "Done.", Type: "Chat" });
    ChatRoomCharacterUpdate(Player)
    console.log("action  : " + action)
    if (action == 2) {
      updateRoom("punishment victims", "punished girls waiting for their fate", "PrisonHall", false, false)
    }
    else
      updateRoom(RoomName, RoomDescription, RoomBackground, true, false)

    Player.Description = `Waiting Mode ` + iVersion + ` 
      ---------------------------------------------------------------
      `  + initDescription

    ServerSend("AccountUpdate", { Description: Player.Description });
  }


  function restrainForPunishment(target) {
    InventoryWear(target, "DeepthroatGag", "ItemMouth", dressSandraColor, 15)
    //InventoryWear(target, "HarnessPanelGag", "ItemMouth2", dressColor, 16)
    //InventoryWear(target, "StitchedMuzzleGag", "ItemMouth3", dressColor, 15)
    InventoryWear(target, "Yoke", "ItemArms", dressSandraColor, 100)
    InventoryWear(target, "SpreaderMetal", "ItemFeet", dressSandraColor)
    //InventoryWear(target, "FullBlindfold", "ItemHead", dressSandraColor, 15)

  }

  function prepareGlobalLists(mode) {
    console.log("preparing Global Lists with: " + mode)

    if (!debug) {
      actionList = []
      regionsList = []

      for (i = 0; i < actionListprep[mode].length; i++) {
        actionList[i] = actionListprep[mode][i];
      }
      for (i = 0; i < regionsListprep[mode].length; i++) {
        regionsList[i] = regionsListprep[mode][i];
      }
      console.log(modeList[mode] + " mode :" + mode)
    }
    else console.log(modeList[mode] + " in debug mode")
  }


  function freeAll() {
    for (var D = 0; D < ChatRoomCharacter.length; D++) {
      if (ChatRoomCharacter[D].MemberNumber != Player.MemberNumber) {
        removeRestrains(ChatRoomCharacter[D])
        reapplyClothing(ChatRoomCharacter[D])
      }
    }
  }

  function characterIsHere(char) {
    isInList = false
    for (var D = 0; D < ChatRoomCharacter.length; D++) {
      if (ChatRoomCharacter[D].MemberNumber == char.MemberNumber)
        isInList = true

    }
    return isInList
  }
