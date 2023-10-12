'use client';

import {useCallback, useEffect, useState} from "react";
import {supabaseClient} from "@/lib/supabaseClient";
import Image from "next/image";

export default function StorageView() {

  const [bucket, setBucket] = useState<any[]>([]);

  const getBucket = useCallback(async function(abortController: AbortController) {
    const {data, error} = await supabaseClient
      .storage
      .from('excel-files')
      .list(undefined, undefined, { signal: abortController.signal });

    if (error && abortController.signal.aborted) {
        return;
    }

    if (error) {
      console.error(error);
      return;
    }

    if (!data) {
      console.error('No data:', data);
      return;
    }

    setBucket(data);
  }, []);

  useEffect(() => {
    const abortController = new AbortController();

    getBucket(abortController).catch(console.error);

    return () => abortController.abort();
  }, [getBucket]);

  return <div className="p-3">
    {
      bucket.filter((item) => item.metadata).map((file) =>
        <button
          className="btn btn-success"
          key={file.id}
          onClick={async () => {
            const { data, error } = await supabaseClient
              .storage
              .from('excel-files')
              .download(file.name)

            if (error) {
              console.error(error);
              return;
            }

            if (!data) {
              console.error('no data');
              return;
            }

            const url = window.URL.createObjectURL(data);

            const a = document.createElement('a');
            a.href = url;
            a.download = file.name; // Set the desired filename

            a.click();

            window.URL.revokeObjectURL(url);
            a.remove();
          }}
        >
          <span><Image src='download-icon.svg' width={24} height={24} alt=''/></span>
          {file.name}
        </button>
      )
    }
  </div>
}