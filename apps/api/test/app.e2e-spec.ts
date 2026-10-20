import type { INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';

import { APPOINTMENT_STATUS } from '@sm/shared';

import { AppModule } from '../src/app.module.js';

describe('AppController (e2e)', () => {
	let app: INestApplication<App>;

	afterEach(async () => {
		await app.close();
	});

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('GET / returns the appointment statuses from @sm/shared', () => {
		return request(app.getHttpServer())
			.get('/')
			.expect(200)
			.expect({ appointmentStatuses: [...APPOINTMENT_STATUS] });
	});
});
