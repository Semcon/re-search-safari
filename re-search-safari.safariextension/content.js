// Author: Sara Amani, Basim Ali
// Copyright (c) 2016, Semcon Sweden AB
// All rights reserved.

// Redistribution and use in source and binary forms, with or without modification, are permitted
// provided that the following conditions are met:
// 1. Redistributions of source code must retain the above copyright notice,
//    this list of conditions and the following disclaimer.
// 2. Redistributions in binary form must reproduce the above copyright notice,  this list of conditions and
//    the following disclaimer in the documentation and/or other materials provided with the distribution.
// 3. Neither the name of the Semcon Sweden AB nor the names of its contributors may be used to endorse or
//    promote products derived from this software without specific prior written permission.

// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
// FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
// DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
// CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
// OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

(function() {

	var elements;
	var inputSelector;
	var titleTerm = false;
	var listenersAdded = false;
	var lastSentTerm = false;
	var shareUrl = 'http://semcon.com/re-search/';
	var shareTitle = 'Re-Search';
	var transformString = 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,60,0,1);';

	//Toolbar functions

	function getSelectList( terms ){
		//Create and append select list
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
		shareLinkedin.setAttribute( 'href', 'https://www.linkedin.com/shareArticle?url=' + shareUrl + '&title=' + shareTitle );
		shareLinkedin.className = 're-search-share-linkedin re-search-hidden';
		shareLinkedin.setAttribute( 'target', '_BLANK' );

		var shareLinkedinImage = document.createElement( 'img' );
		shareLinkedinImage.setAttribute( 'src', safari.extension.baseURI + 'icons/icon-linkedin-square.png' );
		shareLinkedinImage.className = 're-search-share-icon';

		shareLinkedin.appendChild( shareLinkedinImage );

		shareWrapper.appendChild( shareLinkedin );

		var shareFacebook = document.createElement( 'a' );
		shareFacebook.setAttribute( 'href', 'https://www.facebook.com/sharer.php?u=' + shareUrl );
		shareFacebook.className = 're-search-share-facebook re-search-hidden';
		shareFacebook.setAttribute( 'target', '_BLANK' );

		var shareFacebookImage = document.createElement( 'img' );
		shareFacebookImage.setAttribute( 'src', safari.extension.baseURI + 'icons/icon-facebook-square.png' );
		shareFacebookImage.className = 're-search-share-icon';

		shareFacebook.appendChild( shareFacebookImage );

		shareWrapper.appendChild( shareFacebook );

		var shareTwitter = document.createElement( 'a' );
		shareTwitter.setAttribute( 'href', 'https://twitter.com/intent/tweet?url=' + shareUrl + '&text=' + shareTitle );
		shareTwitter.className = 're-search-share-twitter re-search-hidden';
		shareTwitter.setAttribute( 'target', '_BLANK' );


		var shareTwitterImage = document.createElement( 'img' );
		shareTwitterImage.setAttribute( 'src', safari.extension.baseURI + 'icons/icon-twitter-square.png' );
		shareTwitterImage.className = 're-search-share-icon';

		shareTwitter.appendChild( shareTwitterImage );

		shareWrapper.appendChild( shareTwitter );

		return shareWrapper;
	}

	function getToolbar(dropdownTerms){
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

		var selectList = getSelectList( dropdownTerms );
		toolbar.insertBefore( selectList, tipButton );

		var selectArrow = document.createElement( 'div' );
		selectArrow.className = 're-search-arrow-down';

		toolbar.appendChild( selectArrow );

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
		var hideImage = document.createElement( 'img' );
		hideImage.setAttribute( 'src', safari.extension.baseURI + 'icons/icon-close.png' );
		hideImage.className = 're-search-hide-icon';
		hideButton.appendChild( hideImage );
		toolbar.appendChild( hideButton );

		var readMoreButton = document.createElement( 'a' );
		readMoreButton.className = 're-search-read-more-button';
		readMoreButton.innerText = 'Read more';
		readMoreButton.href = shareUrl;

		toolbar.appendChild( readMoreButton );

		toolbar.appendChild( getShare() );

		return toolbar;
	}

	function injectToolbar(dropdownTerms){
		if( document.getElementById( 're-search-toolbar' ) ){
			return false;
		}
		var toolbar = getToolbar(dropdownTerms);
		var body = document.querySelectorAll( 'body' )[ 0 ];
		var currentStyle;
		var newStyle;
		for( var i = 0; i < body.children.length; i = i + 1 ){
			currentStyle = body.children[ i ].getAttribute( 'style' );
			if( !currentStyle ){
				newStyle = transformString;
			} else {
				newStyle = currentStyle + '; ' + transformString;
			}
			body.children[ i ].setAttribute( 'style', newStyle );
		}
		addListenersToolbar();
		body.insertBefore( toolbar, body.children[ 0 ] );
	}

	function removeToolbar(){
		var body = document.querySelectorAll( 'body' )[ 0 ];
		var toolbar = document.getElementById( 're-search-toolbar' );
		var currentStyle;
		var newStyle;

		for( var i = 0; i < body.children.length; i = i + 1 ){
			currentStyle = body.children[ i ].getAttribute( 'style' );

			if( currentStyle ){
				newStyle = currentStyle.replace( transformString, '' );
				body.children[ i ].setAttribute( 'style', newStyle );
			}
		}

		if( toolbar ){
			toolbar.remove();
		}
	}

	function approveTip(){
		document.querySelector( '.re-search-tip-text' ).classList.add( 're-search-hidden' );
        document.querySelector( '.re-search-approve-tip-button' ).classList.add( 're-search-hidden' );
        document.querySelector( '.re-search-deny-tip-button' ).classList.add( 're-search-hidden' );

        document.querySelector( '.re-search-approved-tip-text' ).classList.remove( 're-search-hidden' );
        document.querySelector( '.re-search-select' ).classList.remove( 're-search-hidden' );
        document.querySelector( '.re-search-share-wrapper' ).classList.remove( 're-search-hidden' );
        document.querySelector( '.re-search-read-more-button' ).classList.remove( 're-search-hidden' );
        document.querySelector( '.re-search-hide-button' ).classList.remove( 're-search-hidden' );
		document.querySelector( '.re-search-arrow-down' ).classList.remove( 're-search-hidden' );

		var term = getSearchTerm();

		if(term){
			safari.self.tab.dispatchMessage('message', {
				action: 'sendTip',
				tipTerm: term
			});
		}
	}

	function showShareButtons(){
		document.querySelector( '.re-search-share-button' ).classList.add( 're-search-hidden' );

		document.querySelector( '.re-search-share-twitter' ).classList.remove( 're-search-hidden' );
		document.querySelector( '.re-search-share-facebook' ).classList.remove( 're-search-hidden' );
		document.querySelector( '.re-search-share-linkedin' ).classList.remove( 're-search-hidden' );
	}

	function hideTip(){
		document.querySelector( '.re-search-tip-button' ).classList.remove( 're-search-hidden' );
        document.querySelector( '.re-search-select' ).classList.remove( 're-search-hidden' );
        document.querySelector( '.re-search-share-wrapper' ).classList.remove( 're-search-hidden' );
        document.querySelector( '.re-search-read-more-button' ).classList.remove( 're-search-hidden' );
        document.querySelector( '.re-search-hide-button' ).classList.remove( 're-search-hidden' );
        document.querySelector( '.re-search-arrow-down' ).classList.remove( 're-search-hidden' );

        document.querySelector( '.re-search-tip-text' ).classList.add( 're-search-hidden' );
        document.querySelector( '.re-search-approve-tip-button' ).classList.add( 're-search-hidden' );
        document.querySelector( '.re-search-deny-tip-button' ).classList.add( 're-search-hidden' );
	}


	function showTip(tipTerm){
		document.querySelector( '.re-search-tip-button' ).classList.add( 're-search-hidden' );
		document.querySelector( '.re-search-select' ).classList.add( 're-search-hidden' );
		document.querySelector( '.re-search-share-wrapper' ).classList.add( 're-search-hidden' );
		document.querySelector( '.re-search-read-more-button' ).classList.add( 're-search-hidden' );
		document.querySelector( '.re-search-hide-button' ).classList.add( 're-search-hidden' );
		document.querySelector( '.re-search-arrow-down' ).classList.add( 're-search-hidden' );

		document.querySelector( '.re-search-tip-text' ).classList.remove( 're-search-hidden' );
		document.querySelector( '.re-search-approve-tip-button' ).classList.remove( 're-search-hidden' );
		document.querySelector( '.re-search-deny-tip-button' ).classList.remove( 're-search-hidden' );

		document.querySelector( '.re-search-tip-term' ).innerText = tipTerm;
	}

	function addListenersToolbar(){
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
				if(typeof elements === 'undefined'){
					return false;
				}

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
			action: 'getToolbarStatus'
		});
	}

	function sendTerm(term) {
		if(typeof term === 'undefined'){
			return false;
		}

		if(lastSentTerm === term){
			return false;
		}

		if(!term){
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

	// eslint-disable-next-line max-params
	function resizeWindow( width, height, left, top ){
		window.resizeTo(width, height);
		window.moveTo(left, top);
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
			sendTerm(getSearchTerm());
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
			return element.value;
		}

		return false;
	}


	safari.self.addEventListener('message', function(response) {
		// eslint-disable-next-line no-prototype-builtins
		if (response.message.hasOwnProperty('selectorSearchField')) {

			if (response.message.selectorSearchField !== false) {
				inputSelector = response.message.selectorSearchField;
				init();
			}
		// eslint-disable-next-line no-prototype-builtins
	} else if(response.message.hasOwnProperty('resizeWindow')) {
			resizeWindow(
				response.message.width,
				response.message.height,
				response.message.left,
				response.message.top
			);
		// eslint-disable-next-line no-prototype-builtins
		} else if(response.message.hasOwnProperty('showBar')) {
			if(response.message.showBar){
				safari.self.tab.dispatchMessage('message', {
					action: 'isValidUrl',
					url: window.location.href
				});
			} else {
				removeToolbar();
			}
		// eslint-disable-next-line no-prototype-builtins
		} else if(response.message.hasOwnProperty('valid')) {
			if (response.message.valid ){
				safari.self.tab.dispatchMessage('message', {
					action: 'getDropdownTerms'
				});
			}
		// eslint-disable-next-line no-prototype-builtins
		} else if(response.message.hasOwnProperty('dropdownTerms')) {
			injectToolbar(response.message.dropdownTerms);
		}

	}, false );

	function init(){
        if(document.readyState !== 'complete'){
            setTimeout(init, 100);
            return false;
        }
        titleTerm = document.getElementsByTagName('title')[ 0 ].textContent;
		console.log('window State: ', window.windowState);
        addListeners();
        sendTerm(getSearchTerm());
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
