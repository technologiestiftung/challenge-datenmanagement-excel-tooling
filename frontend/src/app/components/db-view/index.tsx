"use client";

import { useSyncExternalStore } from "react";
import { Row } from "@/app/components/db-view/types";
import { dbStore } from "@/app/components/db-view/store";

export default function DbView() {
  const rows = useSyncExternalStore(dbStore.subscribe, dbStore.getSnapshot);

  return (
    <>
      <table className="table table-zebra">
        <thead>
          <tr>
            {rows.length > 0 &&
              Object.entries(rows[0]).map(([key]) => <th key={key}>{key}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row: Row) => (
            <tr key={row.id}>
              {Object.entries(row).map(([key, value]) => (
                <td
                  key={key}
                  className={
                    row.recentlyModified?.includes(key)
                      ? "transition bg-blue-200"
                      : "transition bg-none"
                  }
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
