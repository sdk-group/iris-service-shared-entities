'use strict'

let SharedEntities = require("./SharedEntities/shared-entities");
let config = require("./config/db_config.json");

describe("SharedEntities service", () => {
	let service = null;
	let bucket = null;
	before(() => {
		service = new SharedEntities();
		service.init();
	});
	describe("SharedEntities service", () => {
		it("should mark ticket called", (done) => {
			return service.actionTicketCalled()
				.then((res) => {
					console.log(res);
					done();
				})
				.catch((err) => {
					done(err);
				});
		})
	})

});