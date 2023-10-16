import * as React from 'react';
import logo from '../../../assets/logo-filled.png';
import Progress from './Progress';
import { Session } from '@supabase/supabase-js';
import { supabaseClient } from '../../lib/supabase-client';
import AuthButtons from './AuthButtons';
import populoateWorksheet from '../../commands/populate-worksheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';

/* global Excel  */

export type AppProps = {
	title: string;
	isOfficeInitialized: boolean;
};

const App: React.FC<AppProps> = ({ title, isOfficeInitialized }) => {
	const [session, setSession] = React.useState<Session | null | undefined>(
		undefined,
	);

	const [email, setEmail] = React.useState<string>('');
	const [password, setPassword] = React.useState<string>('');
	React.useEffect(() => {
		supabaseClient.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});
	}, []);

	const click = async () => {
		try {
			console.log(session);
			await Excel.run(async (context) => {
				/**
				 * Insert your Excel code here
				 */
				const range = context.workbook.getSelectedRange();

				// Read the range address
				range.load('address');

				// Update the fill color
				range.format.fill.color = 'yellow';

				await context.sync();
				console.log(`The range address was ${range.address}.`);
			});
		} catch (error) {
			console.error(error);
		}
	};

	if (!isOfficeInitialized) {
		return (
			<Progress
				title={title}
				logo={logo}
				message="Please sideload your addin to see app body."
			/>
		);
	}

	return (
		<>
			{!session && (
				<>
					<div className="flex-container">
						<div className="flex items-center space-x-2">
							<Label htmlFor="email" className="w-20">
								Email
							</Label>
							<Input
								type="email"
								id="email"
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
					</div>
					<div className="flex-container">
						<div className="flex items-center space-x-2">
							<Label htmlFor="password" className="w-20">
								Password
							</Label>
							<Input
								type="password"
								id="password"
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
					</div>
				</>
			)}

			<div className="flex-container">
				<AuthButtons session={session} email={email} password={password} />
			</div>
			<Separator className="my-4" />
			<div className="flex-container">
				<Button className="w-full" onClick={populoateWorksheet}>
					Populate worksheet
				</Button>

				<Button className="w-full" onClick={click}>
					Validate worksheet
				</Button>

				<Button className="w-full" onClick={click}>
					Send worksheet
				</Button>
			</div>
		</>
	);
};

export default App;
