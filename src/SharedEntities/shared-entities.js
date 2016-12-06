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
		workstation,
		department
	}) {
		let getDepartment = workstation ? this.emitter.addTask('workstation', {
				_action: 'workstation-organization-data',
				workstation: workstation
			})
			.then(res => res[workstation].ws.attached_to) : Promise.resolve(department);

		return getDepartment.then(department => this.iris.getServiceIds(department))
			.then((services) => {
				let keys = services;
				return this.iris.getEntryTypeless(keys);
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
			})
			.then(entities => this.makeResponse('timezone', entities));
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
		workstation,
		department
	}) {
		let getDepartment = _.isEmpty(department) ? this.emitter.addTask('workstation', {
				_action: 'workstation-organization-data',
				workstation
			})
			.then(res => res[workstation].ws.attached_to) : Promise.resolve(department);

		return getDepartment.then(res => {
				return patchwerk.get('workstation', {
					counter: '*',
					type: ['control-panel', 'terminal', 'reception'],
					department: res
				});
			})
			.then(entities => this.makeResponse('workstations', _.keyBy(entities, '@id')))
	}

	actionOperators({
		workstation,
		department
	}) {
		console.log('SE operators');
		let getDepartment = _.isEmpty(department) ? this.emitter.addTask('workstation', {
				_action: 'workstation-organization-data',
				workstation
			})
			.then(res => res[workstation].ws.attached_to) : Promise.resolve(department);

		return getDepartment.then(res => {
				return patchwerk.get('employee', {
					counter: '*',
					department: res
				});
			})
			.then(entities => this.makeResponse('operators', _.keyBy(entities, '@id')))
	}

	actionQaQuestions() {
		return patchwerk.get('qa-questions', {})
			.then(questions => questions.get('content'))
			.then(entities => this.makeResponse('questions', entities));
	}

	actionUserInfoFields() {
		return patchwerk.get('user-info-fields', {})
			.then(res => res.get('content'))
			.then(entities => this.makeResponse('user-info-fields', entities));
	}


	actionDepartments({
		workstation,
		department
	}) {

		return patchwerk.get('department', {
				department: department
			})
			.then(result => {
				let entities = _.keyBy(_.castArray(result), '@id');
				return this.makeResponse('departments', entities);
			});
	}
}

module.exports = SharedEntities;