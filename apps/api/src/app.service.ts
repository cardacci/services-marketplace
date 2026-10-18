import { Injectable } from '@nestjs/common';

import { APPOINTMENT_STATUS, type AppointmentStatus } from '@sm/shared';

@Injectable()
export class AppService {
	getAppointmentStatuses(): AppointmentStatus[] {
		return [...APPOINTMENT_STATUS];
	}
}
