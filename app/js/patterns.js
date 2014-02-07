if (typeof Object.create !== 'function') {

	Object.create = function (o) {
		var F = function () {};
		F.prototype = o;
		return new F();
	};	
}

Object.prototype.method = function (name, func) {
	this.prototype[name] = func;
	return this;
};

/* Publisher */

var publisher = {
	
	subscribers : {
		any : []
	},
	
	on : function (type, fn, context) {
		type = type || 'any';
		fn = typeof fn === "function" ? fn : context[fn];
		
		if (typeof this.subscribers[type] === "undefined") {
			this.subscribers[type] = [];
		}
		
		this.subscribers[type].push({fn : fn, context : context || this});
	},
	
	remove : function (type, fn, context) {
		this.visitSubscribers('unsubscribe', type, fn, context);
	},
	
	fire : function (type, publication) {
		this.visitSubscribers('publish', type, publication);
	},
	
	visitSubscribers : function (action, type, arg, context) {
		var pubtype = type || 'any';
		var subscribers = this.subscribers[pubtype];
		var max = subscribers ? subscribers.length : 0;
		
		for (var i = 0; i < max; i++) {
			if (action === 'publish') {
				subscribers[i].fn.call(subscribers[i].context, arg);
			} else {
				if (subscribers[i].fn === arg && subscribers[i].context === context) {
					subscribers.splice(i, 1);
				}
			}
		}
		
	}
};

function makePublisher(o) {
	var i;
	for (i in publisher) {
		if (publisher.hasOwnProperty(i) && typeof publisher[i] === "function") {
			o[i] = publisher[i];
		}
	}
	o.subscribers = {any : []};
}