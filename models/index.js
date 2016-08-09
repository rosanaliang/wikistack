var Sequelize = require('sequelize');

var db = new Sequelize('postgres://localhost:5432/wikistack', {
	logging: false
});


var Page = db.define('page', {
	pid: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	title: {
		type: Sequelize.STRING,
		allowNull: false
	},
	urlTitle: {
		type: Sequelize.STRING,
		allowNull: false,
		isUrl: true
	},
	content: {
		type: Sequelize.TEXT,
		allowNull: false
	},
	status: {
		type: Sequelize.ENUM('open', 'closed')
	},
	tags: {
		type: Sequelize.ARRAY(Sequelize.TEXT),
		allowNull: true
	}
  }, {
  	getterMethods: {
		route: function(){return '/wiki/' + this.urlTitle}
	   }
 });

function urlTitlize(title) {
	if(title) {
		return title.replace(/\s+/g, '_').replace(/\W/g, '');
	} else {
		return Math.random().toString(36).substring(2,7);
	}
}

Page.hook('beforeValidate', function(page, options){
	page.urlTitle = urlTitlize(page.title);
});

var User = db.define('user', {
	uid: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	name:{
		type: Sequelize.STRING,
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		isEmail: true
	}
});

Page.belongsTo(User, { as: 'author' });
//User.belongsTo(Page, { as: 'author' });

module.exports = {
	Page: Page,
	User: User
};
