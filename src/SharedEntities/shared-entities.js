'use strict'

let emitter = require("global-queue");
let moment = require('moment-timezone');
let ServiceApi = require('resource-management-framework').ServiceApi;

class SharedEntities {
	constructor() {
		this.emitter = emitter;
	}

	init() {
		this.iris = new ServiceApi();
		this.iris.initContent();
	}

	//API
	actionServices({}) {
		return this.iris.getService({
			query: {}
		});
	}

	actionOffice({
		workstation
	}) {
		return this.emitter.addTask('queue', {
				_action: 'workstation-organization-data',
				workstation
			})
			.then(({
				ws,
				org_addr,
				org_chain,
				org_merged
			}) => {
				return {
					namespace: 'office',
					entities: org_merged
				};
			})
			.catch(err => {
				console.log("SE OFFICE ERR", err.stack);
			});
	}

	actionOrganizationChain({
		workstation
	}) {
		return this.emitter.addTask('queue', {
				_action: 'workstation-organization-data',
				workstation
			})
			.then(({
				ws,
				org_addr,
				org_chain,
				org_merged
			}) => {
				return {
					namespace: 'hierarchy',
					entities: org_chain
				};
			})
			.catch(err => {
				console.log("SE ORGCHAIN ERR", err.stack);
			});
	}

	actionTimezone({
		workstation
	}) {
		return this.emitter.addTask('queue', {
				_action: 'workstation-organization-data',
				workstation
			})
			.then(({
				ws,
				org_addr,
				org_chain,
				org_merged
			}) => {
				let tm = moment.utc();
				return {
					namespace: 'timezone',
					entities: {
						timezone: org_merged.org_timezone,
						current_time: tm.format("X")
					}
				};
			})
			.catch(err => {
				console.log("SE ORG TZ ERR", err.stack);
			});
	}

}

module.exports = SharedEntities;