INSERT INTO storage.buckets(id, name)
	VALUES ('excel-files', 'excel-files');

CREATE POLICY "Give users authenticated access to bucket excel-files" ON "storage"."objects"
	USING (((bucket_id = 'excel-files'::text) AND (auth.role() = 'authenticated'::text)));

