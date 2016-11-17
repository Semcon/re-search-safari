(function(){
    console.log('HELLO');
    window.addEventListener( 'focus' , function(){
        console.log('inside listener');
        safari.extension.globalPage.contentWindow.enableToolbar();
    });
})();
