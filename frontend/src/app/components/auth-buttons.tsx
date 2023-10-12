'use client'

import {login, logout} from "@/lib/auth";
import {Session} from "@supabase/gotrue-js";

export default function AuthButtons({ session }: { session: Session | null | undefined }) {
  if (session === undefined) {
    return <button className="btn btn-disabled" onClick={login}>LOADING...</button>
  }


  if(session === null) {
    return <button className="btn" onClick={login}>LOG IN</button>
  }

  return <button className="btn" onClick={logout}>LOG OUT</button>
}