//@ts-ignore
import * as React from 'react';
import { Button } from '../components/ui/button';

import { login, logout } from '../../lib/auth';
import { Session } from '@supabase/gotrue-js';

export default function AuthButtons({
	session,
	setSession,
	email,
	password,
}: {
	email: string;
	password: string;
	session: Session | null | undefined;
	setSession: React.Dispatch<React.SetStateAction<Session | null | undefined>>;
}) {
	async function handleLogin() {
		login({ email, password, setSession });
	}
	async function handleLogout() {
		logout(setSession);
	}

	if (session === undefined) {
		return (
			<Button className="btn btn-disabled" onClick={handleLogin}>
				LOADING...
			</Button>
		);
	}

	if (session === null) {
		return (
			<Button className="btn" onClick={handleLogin}>
				LOG IN
			</Button>
		);
	}

	return (
		<Button className="btn" onClick={handleLogout}>
			LOG OUT
		</Button>
	);
}
