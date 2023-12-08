import { Session } from '@supabase/supabase-js';
import * as React from 'react';
import logo from '../../../assets/logo-filled.png';
import { populateWorksheet } from '../../commands/populate-worksheet';
import {
	SUPABASE_ANON_KEY,
	SUPABASE_URL,
	supabaseClient,
} from '../../lib/supabase-client';
import AuthButtons from './AuthButtons';
import Progress from './Progress';
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { UserError } from '../../lib/errors';
import { sendWorksheet } from '@/commands/send-worksheet';

export type AppProps = {
	title: string;
	isOfficeInitialized: boolean;
};

const errorMessages = {
	'no-session': 'Please log in first',
};

const App: React.FC<AppProps> = ({ title, isOfficeInitialized }) => {
	const [session, setSession] = React.useState<Session | null | undefined>(
		undefined,
	);

	const [email, setEmail] = React.useState<string>('');
	const [password, setPassword] = React.useState<string>('');
	const [alertIsOpen, setAlertIsOpen] = React.useState<boolean>(false);
	const [errorKey, setErrorKey] = React.useState<
		keyof typeof errorMessages | null
	>(null);

	React.useEffect(() => {
		supabaseClient.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});
	}, []);

	const populate = async () => {
		try {
			if (session) {
				const userToken = session.access_token;
				await populateWorksheet({
					userToken,
					supabaseUrl: SUPABASE_URL,
					supabaseAnonKey: SUPABASE_ANON_KEY,
				});
			} else {
				throw new UserError('No session', 'no-session');
			}
		} catch (error: unknown) {
			console.error(error);
			if (error instanceof UserError) {
				if (error.type === 'no-session') {
					setErrorKey(error.type);
					setAlertIsOpen(true);
				}
			}
		}
	};

	const send = async () => {
		try {
			if (session) {
				await sendWorksheet({
					supabaseUrl: SUPABASE_URL,
					supabaseAnonKey: SUPABASE_ANON_KEY,
					userToken: session.access_token,
				});
			} else {
				throw new UserError('No session', 'no-session');
			}
		} catch (error) {
			console.error(error);
			if (error instanceof UserError) {
				setErrorKey(error.type);
				setAlertIsOpen(true);
			}
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
			<AlertDialog open={alertIsOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Ups. There was an error!</AlertDialogTitle>
						<AlertDialogDescription>
							{errorKey && errorMessages[errorKey]}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setAlertIsOpen(false)}>
							OK
						</AlertDialogCancel>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{!session && (
				<>
					<div className="flex-container">
						<div className="flex items-center space-x-2">
							<Label htmlFor="email" className="w-20">
								E-Mail
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
								Passwort
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
				<AuthButtons
					session={session}
					email={email}
					password={password}
					setSession={setSession}
				/>
			</div>
			<Separator className="my-4" />
			<div className="flex-container">
				<Button className="w-full" onClick={populate}>
					Datenblatt befüllen
				</Button>

				<Button className="w-full" onClick={() => undefined}>
					Datenblatt validieren
				</Button>

				<Button className="w-full" onClick={send}>
					Datenblatt senden
				</Button>
			</div>
		</>
	);
};

export default App;
