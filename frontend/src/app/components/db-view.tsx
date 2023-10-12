'use client';

import {supabaseClient} from "@/lib/supabaseClient";
import {useCallback, useEffect, useState} from "react";

type Row = {
  id: number;
  thema: string;
  typ: string;
  datensatz_titel: string;
  beschreibung: string;
  raeumlicher_bezug: string;
  verantwortlichkeit_bezirksebene: string;
  ansprechperson_bezirksebene: string;
  verantwortlichkeit_landesebene: string;
  ansprechperson_landesebene: string;
  datenhoheit_bei: string;
  it_fachverfahren: string;
  datenqualitaet: string;
  user_id: string;
}

export default function DbView() {

  const [rows, setRows] = useState<any[]>([]);

  const getRows = useCallback(async function (abortController: AbortController)  {
    const {data, error} = await supabaseClient
      .from('general_overview')
      .select()
      .order('id', {ascending: true})
      .abortSignal(abortController.signal);

    if (error) {
      if (abortController.signal.aborted) {
        return;
      }

      console.error(error);
      return
    }

    if (!data) {
      console.error('No data:', data);
      return;
    }

    setRows(data);
  }, []);

  useEffect(() => {
    let abortController = new AbortController();

    const subscription = supabaseClient.channel('schema-db-changes').on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'general_overview',
      },
      () => {
        abortController = new AbortController();

        getRows(abortController).catch(console.error);
      }
    ).subscribe();

    return () => {
      abortController.abort();
      subscription.unsubscribe().catch(console.error);
    }
  }, [getRows])

  useEffect(() => {
    const abortController = new AbortController();

    getRows(abortController).catch((e) => console.error(e));

    return () => abortController.abort()
  }, [getRows]);



  return <>
    <table className="table table-zebra">
      <thead>
        <tr>
        {
          rows.length > 0
          && Object.entries(rows[0]).map(([key]) =>
            <th key={key}>{key}</th>
          )
        }
        </tr>
      </thead>
      <tbody>
      {rows.map((row: Row) => <tr key={row.id}>
        {
          Object.entries(row).map(([key, value]) =>
            <td key={key}>{value}</td>
          )
        }
      </tr>)}
      </tbody>
    </table>
  </>
}