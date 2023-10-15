import { supabaseClient } from "@/lib/supabaseClient";
import { Row } from "@/app/components/db-view/types";

let rows: Row[] = [];

export const dbStore = {
  subscribe(renderCallback: () => void) {
    const abortController = new AbortController();

    getRows(abortController)
      .then((data) => {
        rows = [...data];
        renderCallback();
      })
      .catch(console.error);

    const subscription = supabaseClient
      .channel("schema-db-changes")
      .on(
        // @ts-ignore
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "general_overview",
        },
        (data: { new: Row }) => updateRows(data, renderCallback),
      )
      .subscribe();

    return () => {
      abortController.abort();
      subscription.unsubscribe().catch(console.error);
    };
  },

  getSnapshot() {
    return rows;
  },
};

async function getRows(abortController: AbortController): Promise<Row[]> {
  const { data, error } = await supabaseClient
    .from("general_overview")
    .select()
    .order("id", { ascending: true })
    .abortSignal(abortController.signal);

  if (error) {
    if (abortController.signal.aborted) {
      return [];
    }

    console.error(error);
    return [];
  }

  if (!data) {
    console.error("No data:", data);
    return [];
  }

  return data;
}

function updateRows(data: { new: Row }, renderCallback: () => void) {
  const newRow = data.new;

  const index = rows.findIndex((row) => row.id === newRow.id);
  const oldRow = rows[index] as Row;

  let key: keyof Row;
  for (key in oldRow) {
    if (key === "recentlyModified") {
      continue;
    }

    if (oldRow[key] === newRow[key]) {
      continue;
    }

    // @ts-ignore
    // see https://stackoverflow.com/questions/61758438/type-is-not-assignable-to-type-never-2322
    oldRow[key] = newRow[key];

    oldRow.recentlyModified = [...(oldRow.recentlyModified || []), key];

    setTimeout(() => {
      oldRow.recentlyModified = [];
      rows = [...rows];
      renderCallback();
    }, 1000);
  }

  rows = [...rows];
  renderCallback();
}
