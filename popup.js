document.addEventListener('DOMContentLoaded', function () {
	

	var querying = browser.tabs.query({currentWindow: true, active: true});
	querying.then(currentTabStart, onError)

	function currentTabStart(tabs) {
		var url = undefined
		for (let tab of tabs) {
		  // tab.url requires the `tabs` permission
		  url = tab.url
		}

		var bgPage = browser.extension.getBackgroundPage();
		if (bgPage != undefined && url != undefined) {
			console.log("Starting AirPlaying...")
			bgPage.startPlaying(tab.url)
		}
	}

	function onError(error) {
		console.log(`Tab Error: ${error}`)
	}
		
});
