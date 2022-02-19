function clie(){
var entry = {objectType: "KalturaMediaEntry"};

KalturaMediaService.add(entry)
  .execute(client, function(success, results) {
    if (!success || (results && results.code && results.message)) {
      console.log('Kaltura Error', success, results);
    } else {
      console.log('Kaltura Result', results);
    }
  })}
