var Animation = function () {
	this.from = 0;
	this.to = 0;
	this.step = 0;
	this.over = false;
	this.value = 0;
};

Animation.prototype = new gameComponent();

Animation.method('init', function (from, to, step) {
	this.from = from;
	this.to = to;
	this.step = step;
	this.reset();
});

Animation.method('reset', function () {
	this.value = this.from;
	this.over = false;
});

Animation.method('update', function () {
	if (this.value < this.to && !this.over) {
		this.value += this.step;	
	} else {
		this.over = true;
	}
});

Animation.method('getValue', function () {
	return this.value;
});

Animation.method('isOver', function () {
	return this.over;
});

//Animation.method('draw', function (context) {});
//Animation.method('dispose', function () {});