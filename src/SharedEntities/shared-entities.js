'use strict'

const emitter = require('global-queue');
const patchwerk = require('patchwerk')(emitter);

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

	makeResponse(namespace, entities) {
		return {
			namespace,
			entities
		}
	}

	actionServices({
		workstation
	}) {
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
			.then(entities => this.makeResponse('services', entities));
	}

	actionOffice({
		workstation
	}) {
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
			}) => this.makeResponse('office', org_merged));
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
			}) => this.makeResponse('hierarchy', org_chain));
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
					timezone: org_merged.org_timezone,
					current_time: tm.format("x")
				};
			}).then(entities => this.makeResponse('timezone', entities));
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
			.then(entities => this.makeResponse('priorities', entities));
	}

	actionWorkstations({
		workstation
	}) {

	}

	actionOperators({
		workstation
	}) {
		console.log('SE operators');
		return this.emitter.addTask('workstation', {
				_action: 'workstation-organization-data',
				workstation
			})
			.then(res => {
				return patchwerk.get('operator', {
					counter: '*',
					department: res[workstation].ws.attached_to
				});
			})
			.then(entities => this.makeResponse('operators', entities))
	}
}

module.exports = SharedEntities;
