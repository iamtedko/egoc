'use strict';

var _ = require('underscore');

module.exports = {};
module.exports.teams = [
	{
		id: "0",
		name: "Centric",
		members: ["aguo@ideo.com", "awalzer@ideo.com", "jhurford@ideo.com", "kericson@ideo.com"]
	},

	{
		id: "1",
		name: "Strand",
		members: ["dmayo@ideo.com", "jeverson@ideo.com", "nwood@ideo.com", "rhatch@ideo.com", "sstanojevic@ideo.com"]
	},

	{
		id: "2",
		name: "IWE",
		members: ["jwang@ideo.com", "rkorah@ideo.com", "vskenderi@ideo.com", "wchesson@ideo.com"]
	},

	{
		id: "3",
		name: "f(x)",
		members: ["ckapelonis@ideo.com", "echan@ideo.com", "sgong@ideo.com", "spowers@ideo.com"]
	},

	{
		id: "4",
		name: "Block Jocks",
		members: ["bchacko@ideo.com", "bolmedo@ideo.com", "jkwartler@ideo.com", "kwu@ideo.com"]
	},

	{
		id: "5",
		name: "EGOC",
		members: ["ecuevas@ideo.com", "kche@ideo.com", "tko@ideo.com", "tsamstag@ideo.com"]
	}
];

module.exports.getTeamFromEmail = function(targetEmail) {
	return _.find(module.exports.teams, function(team) {
		return _.find(team.members, function(email) {
			return targetEmail === email;
		});

	});
};