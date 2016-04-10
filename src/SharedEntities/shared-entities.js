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


	actionServices({}) {
		console.log("SE SERVICE");
		return this.iris.getServiceIds()
			.then((res) => {
				return this.iris.getService({
					keys: res
				})
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
		console.log("SE CHAIN");
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

}

module.exports = SharedEntities;
