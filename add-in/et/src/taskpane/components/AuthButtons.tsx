//@ts-ignore
import * as React from 'react';
import { Button } from '../components/ui/button';

import { login, logout } from '../../lib/auth';
import { Session } from '@supabase/gotrue-js';

export default function AuthButtons({
	session,
	email,
	password,
}: {
	email: string;
	password: string;
	session: Session | null | undefined;
}) {
	async function handleLogin() {
		login({ email, password });
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
		<Button className="btn" onClick={logout}>
			LOG OUT
		</Button>
	);
}
