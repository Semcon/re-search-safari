# Re-Search Safari Plugin

This is the Safari plugin for the [Re-search project](http://semcon.com/re-search).

When you search on some image search engines we've found that some occupations will
show a very inaccurate result regarding the divions of male and female people present in the images.

With this plugin you will be presented with an alternate search that together with
the original search better represents the real world demographic.

We've decided to publish this early because we believe this project can benefit from being
available in the public realm.

## Known bugs
 * If you close the right side window and the try to search "again" in the main window nothing will happen. This is due to the search-engine not actually updating anything if you search again for the same thing.
 * If you have more than one tab open in the original window when you close the alternate window the window wont be resized. This is due to `window.resizeTo` not working when multiple tabs are open.

## Disclaimer

This project is currently in early stages of development so things such as tests and code quality are not on par with the type of client work we usually do.
