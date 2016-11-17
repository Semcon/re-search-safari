(function() {

	var elements;
	var inputSelector;
	var titleTerm = false;
	var listenersAdded = false;
	var lastSentTerm = false;
	var tipUrl = 'http://example.com';


	//Toolbar functions

	function getSelectList( englishTerms ){
		//Create and append select list
		var terms = Object.keys( englishTerms );
		var selectList = document.createElement( 'select');
		selectList.className = 're-search-select';
		selectList.id = "termList";
		var defaultOption = document.createElement("option");
		defaultOption.value = 'Try Re-search';
		defaultOption.text = 'Try Re-search';
		selectList.add(defaultOption);
		terms.sort(function (a, b) {
			return a.localeCompare(b);
		});

		//Create and append the options
		for (var i = 0; i < terms.length; i = i + 1 ) {
			var option = document.createElement("option");
			option.value = terms[i];
			option.text = terms[i];
			selectList.add(option);
		}
		return selectList;
	}

	function getShare(){
		var shareWrapper = document.createElement( 'div' );
		shareWrapper.className = 're-search-share-wrapper';

		var shareButton = document.createElement( 'a' );
		shareButton.className = 're-search-share-button';
		shareButton.innerText = 'Share';

		shareWrapper.appendChild( shareButton );

		var shareLinkedin = document.createElement( 'a' );
		shareLinkedin.setAttribute( 'href', 'https://www.linkedin.com/shareArticle?url=http://example.com&title=Example' );
		shareLinkedin.className = 're-search-share-linkedin re-search-hidden';
		shareLinkedin.setAttribute( 'target', '_BLANK' );

		var shareLinkedinImage = document.createElement( 'img' );
		shareLinkedinImage.setAttribute( 'src', safari.extension.baseURI + 'icons/icon-linkedin-square.png' );
		shareLinkedinImage.className = 're-search-share-icon';

		shareLinkedin.appendChild( shareLinkedinImage );

		shareWrapper.appendChild( shareLinkedin );

		var shareFacebook = document.createElement( 'a' );
		shareFacebook.setAttribute( 'href', 'https://www.facebook.com/sharer.php?u=http://example.com' );
		shareFacebook.className = 're-search-share-facebook re-search-hidden';
		shareFacebook.setAttribute( 'target', '_BLANK' );

		var shareFacebookImage = document.createElement( 'img' );
		shareFacebookImage.setAttribute( 'src', safari.extension.baseURI + 'icons/icon-facebook-square.png' );
		shareFacebookImage.className = 're-search-share-icon';

		shareFacebook.appendChild( shareFacebookImage );

		shareWrapper.appendChild( shareFacebook );

		var shareTwitter = document.createElement( 'a' );
		shareTwitter.setAttribute( 'href', ' https://twitter.com/intent/tweet?url=http://example.com&text=Example' );
		shareTwitter.className = 're-search-share-twitter re-search-hidden';
		shareTwitter.setAttribute( 'target', '_BLANK' );


		var shareTwitterImage = document.createElement( 'img' );
		shareTwitterImage.setAttribute( 'src', safari.extension.baseURI + 'icons/icon-twitter-square.png' );
		shareTwitterImage.className = 're-search-share-icon';

		shareTwitter.appendChild( shareTwitterImage );

		shareWrapper.appendChild( shareTwitter );

		return shareWrapper;
	}

	function getToolbar(englishTerms){
		var toolbar = document.createElement( 'div' );
		toolbar.className = 're-search-toolbar';
		toolbar.id = 're-search-toolbar';

		var logoWrapper = document.createElement( 'div' );
		logoWrapper.className = 're-search-logo-wrapper';

		var logo = document.createElement( 'img' );
		logo.setAttribute( 'src', safari.extension.baseURI + 'icons/icon-white.png' );

		logoWrapper.appendChild( logo );

		toolbar.appendChild( logoWrapper );

		var tipButton = document.createElement( 'button' );
		tipButton.className = 're-search-button re-search-tip-button';
		tipButton.innerText = 'Add to Re-Search';

		toolbar.appendChild( tipButton );

		var selectList = getSelectList( englishTerms );
		toolbar.insertBefore( selectList, tipButton );

		var approvedTipText = document.createElement( 'div' );
		approvedTipText.className = 're-search-approved-tip-text re-search-hidden';
		approvedTipText.innerText = 'Thumbs up! We\'ll look into that.';

		toolbar.appendChild( approvedTipText );

		var tipText = document.createElement( 'div' );
		tipText.className = 're-search-tip-text re-search-hidden';
		tipText.innerText = 'Do you want to add ';

		var tipTerm = document.createElement( 'span' );
		tipTerm.className = 're-search-tip-term';

		tipText.appendChild( tipTerm );

		toolbar.appendChild( tipText );

		var approveTipButton = document.createElement( 'button' );
		approveTipButton.className = 're-search-button re-search-approve-tip-button re-search-hidden';
		approveTipButton.innerText = 'Yes';

		toolbar.appendChild( approveTipButton );

		var denyTipButton = document.createElement( 'button' );
		denyTipButton.className = 're-search-button re-search-deny-tip-button re-search-hidden';
		denyTipButton.innerText = 'No';

		toolbar.appendChild( denyTipButton );

		var hideButton = document.createElement( 'a' );
		hideButton.className = 're-search-hide-button';
		hideButton.innerText = 'X';

		toolbar.appendChild( hideButton );

		var onOffToggle = document.createElement( 'div' );
		onOffToggle.className = 're-search-on-off-toggle';

		var onOffPaddle = document.createElement( 'div' );
		onOffPaddle.className = 're-search-on-off-paddle';

		var onText = document.createElement( 'a' );
        onText.className = 're-search-on-off-text';
        onText.innerText = 'On';

        var offText = document.createElement( 'a' );
        offText.className = 're-search-on-off-text';
        offText.innerText = 'Off';

		onOffToggle.appendChild( onOffPaddle );
		onOffToggle.appendChild( onText );
		onOffToggle.appendChild( offText );

		toolbar.appendChild( onOffToggle );

		var readMoreButton = document.createElement( 'a' );
		readMoreButton.className = 're-search-read-more-button';
		readMoreButton.innerText = 'Read more';
		readMoreButton.href = 'http://semcon.com';

		toolbar.appendChild( readMoreButton );

		toolbar.appendChild( getShare() );

		return toolbar;
	}

	function injectToolbar(englishTerms){
		if( document.getElementById( 're-search-toolbar' ) ){
			return false;
		}
		var toolbar = getToolbar(englishTerms);
		var body = document.querySelectorAll( 'body' )[ 0 ];
		var currentStyle;
		var newStyle;
		for( var i = 0; i < body.children.length; i = i + 1 ){
			currentStyle = body.children[ i ].getAttribute( 'style' );
			if( !currentStyle ){
				newStyle = 'transform: translateY( 60px );';
			} else {
				newStyle = currentStyle + '; transform: translateY( 60px );';
			}
			body.children[ i ].setAttribute( 'style', newStyle );
		}
		addListenersToolbar();
		body.insertBefore( toolbar, body.children[ 0 ] );
	}

	function removeToolbar(){
		var body = document.querySelectorAll( 'body' )[ 0 ];
		var toolbar = document.getElementById( 're-search-toolbar' );

		for( var i = 0; i < body.children.length; i = i + 1 ){
			currentStyle = body.children[ i ].getAttribute( 'style' );

			if( !currentStyle ){
				newStyle = 'transform: translateY( 0px );';
			} else {
				newStyle = currentStyle + '; transform: translateY( 0px );';
			}

			body.children[ i ].setAttribute( 'style', newStyle );
		}

		if( toolbar ){
			toolbar.remove();
		}
	}

	function setDisabledState(){
		document.querySelector( '.re-search-on-off-toggle' ).classList.remove( 'active' );
		document.querySelector( '.re-search-select' ).setAttribute( 'disabled', 'disabled' );
		document.querySelector( '.re-search-tip-button' ).setAttribute( 'disabled', 'disabled' );
	}

	function setEnabledState(){
		document.querySelector( '.re-search-on-off-toggle' ).classList.add( 'active' );
		document.querySelector( '.re-search-select' ).removeAttribute( 'disabled' );
		document.querySelector( '.re-search-tip-button' ).removeAttribute( 'disabled' );
	}

	function approveTip(){
		document.querySelector( '.re-search-tip-text' ).classList.add( 're-search-hidden' );
        document.querySelector( '.re-search-approve-tip-button' ).classList.add( 're-search-hidden' );
        document.querySelector( '.re-search-deny-tip-button' ).classList.add( 're-search-hidden' );

        document.querySelector( '.re-search-approved-tip-text' ).classList.remove( 're-search-hidden' );


		if (elements[0].value.length > 0) {
			safari.self.tab.dispatchMessage('message', {
				action: 'sendTip',
				tipTerm: elements[0].value
			});
		}
	}

	function hideTip(){
		document.querySelector( '.re-search-tip-button' ).classList.remove( 're-search-hidden' );

		document.querySelector( '.re-search-tip-text' ).classList.add( 're-search-hidden' );
		document.querySelector( '.re-search-approve-tip-button' ).classList.add( 're-search-hidden' );
		document.querySelector( '.re-search-deny-tip-button' ).classList.add( 're-search-hidden' );
	}


	function showTip(tipTerm){
		document.querySelector( '.re-search-tip-button' ).classList.add( 're-search-hidden' );

		document.querySelector( '.re-search-tip-text' ).classList.remove( 're-search-hidden' );
		document.querySelector( '.re-search-approve-tip-button' ).classList.remove( 're-search-hidden' );
		document.querySelector( '.re-search-deny-tip-button' ).classList.remove( 're-search-hidden' );
		document.querySelector( '.re-search-tip-term' ).innerText = tipTerm;
	}

	function showShareButtons(){
		document.querySelector( '.re-search-share-button' ).classList.add( 're-search-hidden' );

		document.querySelector( '.re-search-share-twitter' ).classList.remove( 're-search-hidden' );
		document.querySelector( '.re-search-share-facebook' ).classList.remove( 're-search-hidden' );
		document.querySelector( '.re-search-share-linkedin' ).classList.remove( 're-search-hidden' );
	}

	function addListenersToolbar(){
		window.addEventListener( 'click', function( event ){
			if( event.target.classList.contains( 're-search-on-off-text' ) || event.target.classList.contains( 're-search-on-off-paddle' ) ){
				if( document.querySelector( '.re-search-on-off-toggle' ).classList.contains( 'active' ) ){
					safari.self.tab.dispatchMessage('message', {
						action: 'disablePopups'
					});

				} else {
					safari.self.tab.dispatchMessage('message', {
						action: 'enablePopups'
					});
				}
			}
		});

		window.addEventListener( 'change', function(event){
			if( event.target.id === 'termList' ){
				var term = document.getElementById( 'termList' ).value;

				safari.self.tab.dispatchMessage('message', {
					action: 'updateTabURL',
					term: term
				});
			}
		});

		window.addEventListener( 'click', function( event ){
			if( event.target.classList.contains( 're-search-hide-button' ) || event.target.classList.contains( 're-search-hide-icon' ) ){
				safari.self.tab.dispatchMessage('message', {
					action: 'disableToolbar'
				});

				safari.self.tab.dispatchMessage('message', {
					action: 'getToolbarStatus'
				});
			}
		});

		window.addEventListener( 'click', function( event ){
			if( event.target.classList.contains( 're-search-tip-button' ) ){
				if (elements[0].value.length > 0) {
					showTip(elements[0].value);
				}
			}
		});

		window.addEventListener( 'click', function( event ){
			if( event.target.classList.contains( 're-search-deny-tip-button' ) ){
				hideTip();
			}
		});

		window.addEventListener( 'click', function( event ){
			if( event.target.classList.contains( 're-search-approve-tip-button' ) ){
				approveTip();
			}
		});

		window.addEventListener( 'click', function( event ){
			if( event.target.classList.contains( 're-search-share-button' ) ){
				event.preventDefault();
				showShareButtons();
			}
		});

		safari.self.tab.dispatchMessage('message', {
			action: 'getRunState'
		});
	}



	function sendTerm(term) {
		if(typeof term === 'undefined'){
			return false;
		}

		if(lastSentTerm === term){
			return false;
		}

		lastSentTerm = term;

		safari.self.tab.dispatchMessage("searchForTerm", {
			action: "searchForTerm",
			term: term,
			windowWidth: window.outerWidth,
			windowHeight: window.outerHeight,
			windowScreenLeft: window.screenLeft,
			windowScreenTop: window.screenTop
		});
	}

	function resizeWindow(width, height, left, top){
		console.log('WIDTH: ', width);
		window.resizeTo(width, height);
		window.moveTo(left, top);
		console.log('has resized');
	}

	function getTitle() {
		// Why textContent?
		// http://perfectionkills.com/the-poor-misunderstood-innerText/
		var currentTitle = document.getElementsByTagName('title')[0].textContent;
		var event;

		if (currentTitle !== titleTerm) {
			event = new Event('term');
			window.dispatchEvent(event);
			titleTerm = currentTitle;
		}
	}

	function addListeners() {
		if(listenersAdded){
			return false;
		}

		listenersAdded = true;

		setInterval(getTitle, 64);

		window.addEventListener('term', function() {
			getSearchTerm();
		});
	}

	function getSearchTerm() {
		elements = document.querySelectorAll(inputSelector);
		if (elements.length === 0) {
			setTimeout(getSearchTerm, 100);
			return false;
		}

		var element = elements[0];
		if (element.value.length > 0) {
			sendTerm(element.value);
		}
	}


	safari.self.addEventListener('message', function(response) {
		if (response.message.hasOwnProperty("selectorSearchField")) {

			if (response.message.selectorSearchField !== false) {
				inputSelector = response.message.selectorSearchField;
				init();
			}
		}

		else if(response.message.hasOwnProperty('resizeWindow')){
			resizeWindow(
				response.message.width,
				response.message.height,
				response.message.left,
				response.message.top
			);
		}

		else if(response.message.hasOwnProperty('showBar')){
			if(response.message.showBar){
				safari.self.tab.dispatchMessage('message', {
					action: 'isValidUrl',
					url: window.location.href
				});
			}
			else{
				removeToolbar();
			}
		}

		else if(response.message.hasOwnProperty('valid')){
			if(response.message.valid){
				safari.self.tab.dispatchMessage('message', {
					action: 'getEnglishTerms',
				});
			}
		}

		else if(response.message.hasOwnProperty('englishTerms')){
			injectToolbar(response.message.englishTerms);
		}

		else if(response.message.hasOwnProperty('runState')){
			if(response.message.runState){
				setEnabledState();
			}
			else {
				setDisabledState();
			}
		}

		else if(response.message.hasOwnProperty('latestTerm')){
			showTip(response.message.latestTerm);
		}
	}, false);


	function init(){
        if( document.readyState !== 'complete' ){
            setTimeout( init, 100 );
            return false;
        }
        titleTerm = document.getElementsByTagName( 'title' )[ 0 ].textContent;
        addListeners();
        getSearchTerm();
    }

	safari.self.tab.dispatchMessage("getEngineInformation", {
		action: 'getEngineInformation',
		url: window.location.href
	});

	safari.self.tab.dispatchMessage("resize", {
		action: 'resize'
	});

	safari.self.tab.dispatchMessage('getToolbarStatus', {
		action: 'getToolbarStatus'
	});

})();
