/* ===== Imports ===== */
import { APPOINTMENT_STATUS } from '@sm/shared';

/* ===== Component Function ===== */
const App = () => {
	/* ===== JSX Return ===== */
	return (
		<main>
			<h1>Services Marketplace</h1>

			<p>Estados de cita desde @sm/shared:</p>

			<ul>
				{APPOINTMENT_STATUS.map((status) => (
					<li key={status}>{status}</li>
				))}
			</ul>
		</main>
	);
};

/* ===== Exports ===== */
export default App;
