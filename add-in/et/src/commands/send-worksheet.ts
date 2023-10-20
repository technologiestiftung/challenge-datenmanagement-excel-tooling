/* global Excel, */

import { Entry } from './populate-worksheet';

// TODO:
// - how to send this from a users account and not the service role
// - how make the headers/table creation more generic
// - how to distribute the worksheet and scripts

// IDEAS:
// - [x] should we create a READ ONLY sheet?
//       and force the user to make a copy?
// - [x] we make a copy for the user.
//       Updates only happen to the original sheet
//       copies are not affected

export async function tableToJson(
	table: Excel.Table,
	context: Excel.RequestContext,
) {
	const range = table.getRange();
	range.load('text');
	await context.sync();
	const texts = range.text;
	const keys = texts[0].map((item) =>
		item.toLowerCase().replace(/\s/g, '_').replace(/[Ää]/gi, 'ae'),
	);
	const data: unknown[] = texts.slice(1).map((row) => {
		const item = {} as { [key: string]: unknown };
		for (let i = 0; i < keys.length; i++) {
			if (keys[i] === 'id') {
				item[keys[i]] = parseInt(row[i]);
			} else {
				item[keys[i]] = row[i];
			}
		}
		return item;
	});
	return data;
}

// const suffix = 'general_overview'; //generateShortsuffix();

export async function sendWorksheet({
	userToken,
	supabaseUrl,
	supabaseAnonKey,
}: {
	userToken: string;
	supabaseUrl: string;
	supabaseAnonKey: string;
}) {
	try {
		await Excel.run(async (context) => {
			try {
				const sheet = context.workbook.worksheets.getActiveWorksheet();
				sheet.load('tables');
				await context.sync();
				const tables = sheet.tables;
				if (tables.count === 0) {
					throw new Error('Could not find any tables in this sheet');
				}
				await context.sync();
				let table = tables.getItemAt(0);
				table.load('name');
				await context.sync();
				if (!table.name.startsWith('table_general_overview')) {
					throw new Error(
						'Could not find any table with name starting with `table_general_overview`',
					);
				}

				table = tables.getItemAt(0);
				const data = (await tableToJson(table, context)) as Entry[];
				console.log(data);
				// This is a temporary fix since we dont have user_ids yet

				const response = await fetch(
					`${supabaseUrl}/rest/v1/general_overview`,
					{
						method: 'POST',
						headers: {
							apikey: `${supabaseAnonKey}`,
							Authorization: `Bearer ${userToken}`,
							'Content-Type': 'application/json',
							Prefer: 'resolution=merge-duplicates',
						},
						body: JSON.stringify(data),
					},
				);

				if (response.ok) {
					await context.sync();
					return { success: true, message: 'yay' };
				} else {
					const message = await response.text();
					console.log(message);
					await context.sync();
					return { success: false, message };
				}
			} catch (e: unknown) {
				console.log(e);
				await context.sync();
				if (e instanceof Error) {
					return { success: false, message: e.message };
				} else {
					return { success: false, message: 'unknown error' };
				}
			}
		});
	} catch (e: unknown) {
		if (e instanceof Error) {
			console.log(e, e.stack);
		}

		return null;
	}
}
