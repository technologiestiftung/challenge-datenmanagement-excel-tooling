import { supabaseClient } from './supabase-client';

export async function isLoggedIn() {
	const { data, error } = await supabaseClient.auth.getSession();

	if (error) {
		console.error(error);
		return false;
	}

	if (!data || !data.session) {
		return false;
	}

	return true;
}

export async function login({
	email,
	password,
}: {
	email: string;
	password: string;
}) {
	console.log('onLogin');

	const { data, error } = await supabaseClient.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		console.error(error);
		return;
	}

	if (!data) {
		console.error('data is null');
		return;
	}

	console.log('login success:', data);
}

export async function logout() {
	console.log('onLogout');

	const { error } = await supabaseClient.auth.signOut();

	if (error) {
		console.error(error);
		return;
	}

	console.log('logout success');
}
