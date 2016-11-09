(function() {
	var runState;
	var runInit = true;
	var elements;
	var runSetUI = true;
	var inputSelector;
	var titleTerm = false;
	var englishTerms;
	var windowName = false;

	//Safari bug fix
	//window.onunload = function(){};

	function sendText(text) {
			if (runState === 'enabled' && typeof text !== 'undefined') {
					console.log('Sending', text);
					console.log(window);
					safari.self.tab.dispatchMessage("searchForTerm", {
						action: "searchForTerm",
						term: text,
						windowWidth: window.outerWidth,
						windowHeight: window.outerHeight
					});
			}
	}

	function resizeWindowLeft(width, height){
		console.log('in resizeWindow LEFT');
		window.resizeTo(width/2, height);
	}

	function resizeWindowRight(width, height){
		console.log('in resizeWindow RIGHT');
		window.resizeTo(width/2, height);
	}


	function getTitle() {
		// http://perfectionkills.com/the-poor-misunderstood-innerText/
		var currentTitle = document.getElementsByTagName('title')[0].textContent;
		var event;

		if (currentTitle !== titleTerm) {
			console.log('got new term from title');
			event = new Event('term');
			window.dispatchEvent(event);
			titleTerm = currentTitle;
		}
	}

	function addListeners() {
		setInterval(getTitle, 64);

		window.addEventListener('term', function() {
			console.log('in eventlistener set ui');
			setEngineUI();
			getSearchTerm();
		});

		//Gets value from drop-down list
		if (document.getElementById('termList') !== null) {
			console.log('in get element from drop down');
			document.getElementById('termList').addEventListener('change', function(event) {
				var term = document.getElementById('termList').value;

				window.postMessage({
					action: "updateTabURL",
					term: term
				});
			});
		}
	}

	//Gets search terms when different events occur.
	function getSearchTerm() {
		console.log('SelectorInput: ', inputSelector);
		elements = document.querySelectorAll(inputSelector);
		if (elements.length === 0) {
			setTimeout(getSearchTerm, 100);
			console.log(inputSelector, '`s length was 0');
			return false;
		}

		var element = elements[0];
		if (element.value.length > 0) {
			console.log('if value is > 0');
			sendText(element.value);
		}
	}

	function getSelectList(termsData) {
		//Create and append select list
		console.log(termsData);
		var terms = Object.keys(termsData);

		var selectList = document.createElement("SELECT");
		selectList.setAttribute("style", "height: 25px; width: 164px; margin-top: 5px");
		selectList.id = "termList";

		var defaultOption = document.createElement("option");
		defaultOption.value = 'Other Re-search terms';
		defaultOption.text = 'Other Re-search terms';
		selectList.add(defaultOption);

		terms.sort(function(a, b) {
			return a.localeCompare(b);
		});

		//Create and append the options
		for (var i = 0; i < terms.length; i++) {
			var option = document.createElement("option");
			option.value = terms[i];
			option.text = terms[i];
			selectList.add(option);
		}

		return selectList;
	}

	function checkElementMarginTop(element) {
		if (window.getComputedStyle(element, null).getPropertyValue("margin-top") !== '31px') {
			setEngineUI();
		}
	}

	function setEngineUI() {
		if (inputSelector === '.gsfi') {
			console.log('in Googles UI');
			var element = document.querySelectorAll('.sfbgg');
			if (element.length > 0) {
				element[0].setAttribute("style", "height: 90px; background-color: #f1f1f1; border-bottom: 1px solid #666; border-color: #e5e5e5; min-width: 980px;");
			}
			var elmnt = document.getElementById('top_nav');
			elmnt.setAttribute("style", "margin-top: 31px; min-width: 980px; webkit-user-select: none;");
			setTimeout(checkElementMarginTop.bind(this, elmnt), 450);
		} else if (inputSelector === '.b_searchbox') {
			console.log('setting Bings UI');
			var elmnt2 = document.getElementById('rfPane');
			elmnt2.setAttribute("style", "margin-top: 31px; background: #fff; z-index: 3; width: 100%; left: 0; min-width: 990px; padding-top: 5px;");
			setTimeout(checkElementMarginTop.bind(this, elmnt2), 450);
		}
	}

	function setUI() {
		setEngineUI();
		var selectList = getSelectList(englishTerms);
		var elmnt = document.querySelectorAll('.tsf-p');
		//Adapt Google UI
		if (inputSelector === '.gsfi') {
			if (elmnt.length > 0) {
				elmnt[0].appendChild(selectList);
			}
		}

		//Add select list to Bings UI
		else if (inputSelector === '.b_searchbox') {
			//Create and append select list
			var div = document.createElement("DIV");
			div.setAttribute("style", "margin-top: 5px; margin-left: 100px;");
			div.appendChild(selectList);
			var element = document.querySelectorAll('.b_scopebar');
			if (element.length > 0) {
				document.getElementById('b_header').insertBefore(div, element[0]);
			}
		}
	}


	safari.self.addEventListener('message', function(response) {

		console.log(response);

		if (response.message.hasOwnProperty("selectorSearchField")) {
			console.log("Selectorsearchfield is here: ");
			if (response.message.selectorSearchField !== false) {
				console.log("inside selectorsearchfield if case");
				console.log(response.message.selectorSearchField);
				inputSelector = response.message.selectorSearchField;

				if (runSetUI !== false) {
					console.log("runSetUI method donepre");
					englishTerms = response.message.englishTerms;
					setUI();
					runSetUI = false;
					console.log("runSetUI method donepost");
				}

				titleTerm = document.getElementsByTagName('title')[0].innerText;
				addListeners();
				getSearchTerm();
				console.log("get searchterm done");
			} else {
				console.log('Selector not found');
			}
		}

		else if(response.message.hasOwnProperty("runState")) {
				console.log(response);
				runState = response.message.runState;
				console.log("runstate is: ", runState);
			  console.log("runinit",runInit);
				if (runState === 'enabled' && runInit === true) {
						init();
						runInit = false;
						console.log("runInit is set to false")
				}

				else if (runState === 'disabled') {
						console.log('runState DISABLED');
				}
		}

		else if(response.message.hasOwnProperty('resizeWindowLeft')) {
			console.log('received resize window left');
			console.log('response from background: ', response.message.resizeWindowLeft);
			windowName = response.message.windowName;
			resizeWindowLeft(response.message.width, response.message.height);
		}

		else if(response.message.hasOwnProperty('resizeWindowRight')){
			console.log('received resize window right');
			console.log('response from background: ', response.message.resizeWindowRight);
			resizeWindowRight(response.message.width, response.message.height);
		}

		else if(response.message.hasOwnProperty('resize')){
			console.log('Should resize window');
			resizeWindowRight(response.message.width, response.message.height);
		}

		else if(response.message.hasOwnProperty('updateWindowURL')){
			window.location.href = response.message.url;
		}

	}, false);




	function init() {
		console.log('In init');

		safari.self.tab.dispatchMessage("getEngineInformation", {
			action: 'getEngineInformation',
			url: window.location.href
		});

		safari.self.tab.dispatchMessage("resize", {
			action: 'resize'
		});

	}



	function runWhenReady() {
		if (document.readyState !== 'complete') {
			setTimeout(runWhenReady, 100);
			return false;
		}


		console.log("document is complete");


		safari.self.tab.dispatchMessage("getRunState", {
			action: 'getRunState'
		});
	}


	//first time content script runs
	runWhenReady();

	//Run state sent from background when user turns extension on/off
	window.addEventListener('message', function(request, sender, sendResponse) {
		console.log("this is request");
		console.log(request.action);
		//ToDo ändra till switch
		if (request.action === 'changeRunState') {
			if (request.runState === 'disabled') {
				runState = request.runState;

				sendResponse({
					message: 'received disabled'
				});
			} else if (request.runState === 'enabled') {
				runState = request.runState;
				if (document.readyState === 'complete') {
					console.log('document is complete');
					if (runInit === true) {
						init();
						runInit = false;
					}
				}
				sendResponse({
					message: 'received enabled'
				});
			}
		} else {
			console.log('Message from event page was not handled');
		}

		return true;
	}, true);



})();
