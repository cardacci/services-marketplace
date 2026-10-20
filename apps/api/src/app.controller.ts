import { Controller, Get } from '@nestjs/common';

import type { AppointmentStatus } from '@sm/shared';

import { AppService } from './app.service.js';

interface StatusesResponse {
	appointmentStatuses: AppointmentStatus[];
}

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getStatuses(): StatusesResponse {
		return { appointmentStatuses: this.appService.getAppointmentStatuses() };
	}
}
