# Mod.js

Mod.js is a simple library for building up an object over time and executing
message calls on that object in a garanteed order. It is built in the
functional style described in chapter 5 of Crockford's "JavaScript: The Good
Parts" and has no dependencies. It assumes it will be used an a non-blocking
context, that is, the module will be extended and messages queued without
blocking other activity on the page.

If you came here expecting to find a plugin for the Apache web server, try
[mod_js](http://www.modjs.org/)

## Usage

Mod.js assumes you've declared an array-like variable 'mod' in the document
namespace before the script is loaded. Something like:

    <script type="text/javascript">
      var mod = mod || [];
    </script>

With this variable declared you can push messages onto the the queue which will
be executed in the order of the array:

    mod.push(['someMessage']);
    mod.push(['anotherMessage', with, args]);

Finally, somewhere in your document you'll want to load the module code. Your
queued messages will be executed after mod.js loads. Do so with either:

    <script type="text/javascript" src="mod.js"></script>

Or in the non-blocking style:

    (function() {
      var m = document.createElement('script');
      var s = document.getElementsByTagName('script')[0];
      m.type = 'text/javascript'; m.defer = true; m.async = true;
      m.src = 'path/to/mod.js';
      s.parentNode.insertBefore(m,s);
    })();

Once mod.js has loaded and the pending messages dequeued, you'll be able to push
messages and expect a return result. You can also just invoke the methods
directly:

    var result = mod.push(['someMessage', args])[1];
    var otherResult = mod.someMethod(moreArgs);

Be sure to do your own error checking though as using the 'push' invocation
pattern protects against passing messages defined in modules not yet loaded.

Extending mod.js with additional functionality is easy! Calling 'push' with a
function as the head parameter in your invocation array results in that function
being invoked with mod as 'this'. From here you can extend mod with whatever
functionality you'd like.

    (function($) {
      /* extend mod with the ability to load additional scripts. These
       * scripts can themselves be othe modules. Use jQuery's implementation.
       */
      var load = function() {
        this.load = $.getScript;
      };

      mod.push([load]);
    })(jQuery);

Mod.js can be used directly or built into a larger compilation/minification process. Try combining it with other extension modules core to your application. You can also change the assumed variable from 'mod' to something more appropriate to your application.

## Contributing

Please report bugs and make suggestions using the [github issue tracker](https://github.com/ndimiduk/mod.js/issues).

## License

Copyright (c) 2011 Nick Dimiduk

Dual licensed under the MIT and GPL licenses, same as jQuery.
