'use client';

import AuthButtons from "@/app/components/auth-buttons";
import DbView from "@/app/components/db-view";
import {useEffect, useState} from "react";
import {supabaseClient} from "@/lib/supabaseClient";
import {Session} from "@supabase/gotrue-js";
import StorageView from "@/app/components/storage-view";

export default function Home() {

  const [session, setSession] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    })

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <main className="overflow-x-auto">
      <div className="flex w-full justify-center p-3">
        <AuthButtons session={session} />
      </div>
      { session && <StorageView /> }
      { session && <DbView /> }
    </main>
  )
}
