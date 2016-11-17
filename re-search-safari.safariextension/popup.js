(function(){

    function enableToolbar(){
        safari.extension.globalPage.contentWindow.enableToolbar();
        document.querySelector( '.re-search-yes-no-toggle' ).classList.add( 'enabled' );
    }

    function disableToolbar(){
        safari.extension.globalPage.contentWindow.disableToolbar();
        document.querySelector( '.re-search-yes-no-toggle' ).classList.remove( 'enabled' );
    }

    window.addEventListener( 'click', function( event ){
        if( event.target.classList.contains( 're-search-yes-no-text' ) || event.target.classList.contains( 're-search-yes-no-paddle' ) ){
            if( document.querySelector( '.re-search-yes-no-toggle' ).classList.contains( 'enabled' ) ){
                disableToolbar();
            } else {
                enableToolbar();
            }
        }
        event.preventDefault();
    } );

    if(safari.extension.globalPage.contentWindow.showBar){
        document.querySelector( '.re-search-yes-no-toggle' ).classList.add( 'enabled' );
    }

    window.addEventListener('message', function(MessageEvent) {
        switch (MessageEvent.data) {
            case 'enableToolbar':
                document.querySelector( '.re-search-yes-no-toggle' ).classList.add( 'enabled' );
                break;

            case 'disableToolbar':
                document.querySelector( '.re-search-yes-no-toggle' ).classList.remove( 'enabled' );
                break;
        }
    }, false);


})();
