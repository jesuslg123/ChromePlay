document.addEventListener('DOMContentLoaded', function () {
	
	browser.tabs.getSelected(null, function(tab) {
  		  var bgPage = browser.extension.getBackgroundPage();
		  
	      console.log("Starting AirPlaying...")
  		  bgPage.startPlaying(tab.url)
	   }
	);
		
});
