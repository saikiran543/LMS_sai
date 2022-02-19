
function kaltura(){
 console.log("we are in js")
  try {
    var kalturaPlayer = KalturaPlayer.setup({
      targetId: "kaltura_player_600544719",
      provider: {
        partnerId: 3303993,
        uiConfId: 47480953
      }
    });
    kalturaPlayer.loadMedia({
      entryId: '1_8t6bkip8'
    });
  } catch (e) {
    console.error(e.message)
  }

  return kalturaPlayer;
}