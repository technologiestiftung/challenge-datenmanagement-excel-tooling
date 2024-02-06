"use client";

import AuthButtons from "@/app/components/auth-buttons";
import DbView from "@/app/components/db-view";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { Session } from "@supabase/gotrue-js";
import StorageView from "@/app/components/storage-view";
import { Search } from "@/app/components/search";

export default function Home() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [currentView, setCurrentView] = useState<"db" | "search" | "info">(
    "db",
  );

  let view;
  switch (currentView) {
    case "db":
      view = (
        <>
          {session && <StorageView />}
          {session && <DbView />}
        </>
      );
      break;
    case "search":
      view = <Search />;
      break;
    case "info":
      view = <div>Info</div>;
      break;
  }

  return (
    <main className="overflow-x-auto">
      <div className="flex w-full justify-center p-3">
        <AuthButtons session={session} />
      </div>
      <div className="flex w-full gap-4 p-3">
        <div className="flex flex-col h-screen justify-center gap-3">
          {["db", "search", "info"].map((view) => (
            <button
              key={view}
              className="btn"
              onClick={() => setCurrentView(view as any)}
            >
              {view}
            </button>
          ))}
        </div>
        <div>{view}</div>
      </div>
    </main>
  );
}
