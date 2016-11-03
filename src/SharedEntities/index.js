'use strict'

let events = {
	shared_entities: {}
};

let tasks = [];


module.exports = {
	module: require('./shared-entities.js'),
	name: 'shared-entities',
	permissions: [],
	exposed: true,
	tasks: tasks,
	events: {
		group: 'shared-entities',
		shorthands: events.shared_entities
	}
};