import { z } from 'zod';

export const APPOINTMENT_STATUS = [
	'pending',
	'accepted',
	'rejected',
	'cancelled',
	'completed',
] as const;
export const appointmentStatusSchema = z.enum(APPOINTMENT_STATUS);
export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>;
