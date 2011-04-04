/***
 * Mod.js -- modular, non-blocking javascript
 * 
 * http://github.com/ndimiduk/mod.js
 * 
 * Copyright (c) 2011 Nick Dimiduk
 * Dual licensed under the MIT and GPL licenses (a la jQuery)
 * 
 */

mod = (function() {

var _mod = window.mod || [];
var c, core = function() {

    var pendingMessages = [];
    var pendingModules  = [];

    var apply = function(params) {
	if (typeof params[0] === 'function') {
	    pendingModules.push(params);
	} else {
	    pendingMessages.push(params);
	}
	flush(pendingModules);
	return flush(pendingMessages);
    };

    var _apply = function(params) {
	var fn = params.shift();
	if (typeof fn === 'string') {
	    return c[fn](params);
	} else {
	    return fn.apply(c, params);
	}
    };

    var flush = function(queue) {
	var retVal = undefined;
	while (queue.length > 0) {
	    var next = queue[0], fn = next[0];
	    if (typeof fn === 'function' || (typeof fn === 'string' && c[fn] !== undefined)) {
		next = queue.shift();
		retVal = _apply(next);
	    } else {
		return [false, undefined];
	    }
	}
	return [true, retVal];
    };

    return {
	apply : apply,
	push : apply
    };
};

c = core();
for (var i = 0; i < _mod.length; i++) {
    c.apply(_mod[i]);
}

return c;

})();
