'use strict'


let ServiceApi = require('resource-management-framework')
	.ServiceApi;

class SharedEntities {
	constructor() {
		this.emitter = message_bus;
	}

	init() {
		this.iris = new ServiceApi();
		this.iris.initContent();
	}

	//API
	actionFieldsDescription({
		workstation
	}) {
		return {};
	}


	actionServices({
		workstation
	}) {
		console.log("SE SERVICE");
		return Promise.props({
				ws: this.emitter.addTask('workstation', {
					_action: 'workstation',
					workstation
				}),
				services: this.iris.getServiceIds()
			})
			.then(({
				ws,
				services
			}) => {
				let keys = ws.provides || services;
				return this.iris.getService({
					keys
				});
			})
			.then((res) => {
				return {
					namespace: 'services',
					entities: res
				};
			});
	}

	actionOffice({
		workstation
	}) {
		console.log("SE OFFICE");
		return this.emitter.addTask('workstation', {
				_action: 'workstation-organization-data',
				workstation
			})
			.then(res => res[workstation])
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
			});
	}

	actionOrganizationChain({
		workstation
	}) {
		console.log("SE CHAIN", workstation);
		return this.emitter.addTask('workstation', {
				_action: 'workstation-organization-data',
				workstation
			})
			.then(res => res[workstation])
			.then(({
				ws,
				org_addr,
				org_chain,
				org_merged
			}) => {
				// console.log("CHAIN END", org_chain)
				return {
					namespace: 'hierarchy',
					entities: org_chain
				};
			});
	}

	actionTimezone({
		workstation
	}) {
		console.log("SE TIMEZONE");

		return this.emitter.addTask('workstation', {
				_action: 'workstation-organization-data',
				workstation
			})
			.then(res => res[workstation])
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
						current_time: tm.format("x")
					}
				};
			});
	}


	actionPriorities({
		workstation
	}) {
		console.log("SE PRIORITIES");

		return this.emitter.addTask('workstation', {
				_action: 'workstation-organization-data',
				workstation
			})
			.then(res => res[workstation])
			.then(({
				ws,
				org_addr,
				org_chain,
				org_merged
			}) => {
				return this.iris.getGlobal('priority_description');
			})
			.then((entities) => {
				return {
					namespace: 'priorities',
					entities
				};
			});
	}
}

module.exports = SharedEntities;