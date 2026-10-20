import { Test, type TestingModule } from '@nestjs/testing';

import { APPOINTMENT_STATUS } from '@sm/shared';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

describe('AppController', () => {
	let appController: AppController;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [AppController],
			providers: [AppService],
		}).compile();

		appController = app.get<AppController>(AppController);
	});

	describe('root', () => {
		it('returns the appointment statuses from @sm/shared', () => {
			expect(appController.getStatuses()).toEqual({
				appointmentStatuses: [...APPOINTMENT_STATUS],
			});
		});
	});
});
