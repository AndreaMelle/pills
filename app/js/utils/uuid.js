var UUID = (function() {
	var that = {}
    var id = 1;

    UUID.get =  function () {
        return id++;
    };

    return that;
})();