import { Session } from '@supabase/supabase-js';
import { supabaseClient } from './supabase-client';
import React from 'react';
export async function isLoggedIn(
	setSession: React.Dispatch<React.SetStateAction<Session | null | undefined>>,
) {
	const { data, error } = await supabaseClient.auth.getSession();

	if (error) {
		console.error(error);
		return false;
	}

	if (!data || !data.session) {
		return false;
	}

	setSession(data.session);
	return true;
}

export async function login({
	email,
	password,
	setSession,
}: {
	email: string;
	password: string;
	setSession: React.Dispatch<React.SetStateAction<Session | null | undefined>>;
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

	setSession(data.session);
	console.log('login success:', data);
}

export async function logout(
	setSession: React.Dispatch<React.SetStateAction<Session | null | undefined>>,
) {
	console.log('onLogout');

	const { error } = await supabaseClient.auth.signOut();

	if (error) {
		console.error(error);
		return;
	}
	setSession(null);

	console.log('logout success');
}
