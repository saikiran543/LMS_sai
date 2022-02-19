function recorder(){
    var previlages = encodeURIComponent("editadmintags:*,appid:kmc");
		var userId = encodeURIComponent("pankaj.pawar@engro.io");
		var KSUrl = "https://cdnapisec.kaltura.com/api_v3/service/session/action/start/format/1/secret/9da735c7ffa7475abfcdd3c90a48db15/partnerId/3303993/type/0/expiry/86400/userId/"+userId+"/privileges/"+previlages;
		function loadRecorder(KSToken){
			const component = Kaltura.ExpressRecorder.create('recorder', {                 
				"ks": KSToken,
				"serviceUrl": "https://cdnapisec.kaltura.com",
				"app": "kmc",
				"playerUrl": "https://cdnapisec.kaltura.com",
				"partnerId": "3303993",
				"uiConfId":  "47480953",
				"showUploadUI": true,
				"allowVideo": true,
				"allowAudio": true
			});	
			component.instance.addEventListener("mediaUploadStarted", function(e) {
				console.log(e.detail);
			});
			component.instance.addEventListener("mediaUploadEnded", function(e) {
				console.log(e.detail);
			});
			component.instance.addEventListener("mediaUploadCanceled", function(e) {
				console.log(e.detail);
			});
		}
		$.get(KSUrl, function( data ){loadRecorder(data)})
  }