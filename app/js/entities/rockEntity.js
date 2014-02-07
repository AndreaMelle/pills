/* Rock Entity */
var RockEntity = function (type) {



	spec = {
		eid : UUID.get(),
		ename : 'rock',
		ecomponents : []
	};

	// add all components

	score = Object.create(C_Score({score : type.score}));

	C_Position
	
	velocity = Object.create(C_Velocity({
		vx : random,
		vy : random,
		vrot : random,
		maxSpeed given_by_level : 
	});

	C_Sprite
	C_Collidable
	C_Life
	C_HitFlag

	var that = Object.create(Entity(spec));
	return that;
};

var RockTypes = {

	LARGE : {
		scale : 1,
		score : 50
	},

	MEDIUM : {
		scale : 2,
		score : 75
	},

	SMALL : {
		scale : 4,
		score : 100
	}
};