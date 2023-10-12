import {supabaseClient} from "@/lib/supabaseClient";

export async function isLoggedIn() {
  const {data, error} = await supabaseClient.auth.getSession();

  if (error) {
    console.error(error);
    return false;
  }

  if (!data || !data.session) {
    return false;
  }

  return true;
}

export async function login() {
  console.log('onLogin');

  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'azure',
    options: {
      scopes: 'email',
    },
  })

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
  console.log("onLogout");

  const {error} = await supabaseClient.auth.signOut();

  if (error) {
    console.error(error);
    return;
  }

  console.log("logout success");
}