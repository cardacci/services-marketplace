/* ===== Imports ===== */
import { useState } from 'react';

import { APPOINTMENT_STATUS } from '@sm/shared';

import { Button } from '@/components/ui/button';

/* ===== Component Function ===== */
const App = () => {
	/* ===== State ===== */
	const [isListVisible, setIsListVisible] = useState(true);

	/* ===== JSX Return ===== */
	return (
		<main className="mx-auto flex min-h-svh max-w-md flex-col gap-6 p-6">
			<h1 className="font-heading text-2xl font-semibold">Services Marketplace</h1>

			<p className="text-muted-foreground">Estados de cita desde @sm/shared:</p>

			{isListVisible && (
				<ul className="flex flex-col gap-2">
					{APPOINTMENT_STATUS.map((status) => (
						<li className="rounded-lg border px-3 py-2" key={status}>
							{status}
						</li>
					))}
				</ul>
			)}

			<Button
				onClick={() => {
					setIsListVisible((previous) => !previous);
				}}
			>
				{isListVisible ? 'Ocultar estados' : 'Mostrar estados'}
			</Button>
		</main>
	);
};

/* ===== Exports ===== */
export default App;
