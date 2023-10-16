/* global Excel, */

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
// - [ ] copy should also protect the columns `id` and `user_id`

const SUPABASE_URL = 'https://vtjpdxufdfjdtcezgtvc.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0anBkeHVmZGZqZHRjZXpndHZjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5NjU5ODM1MywiZXhwIjoyMDEyMTc0MzUzfQ.SUOdYGv5f47A3ruyPvWMKZXmBz1sM0l0QdPUZUQiE4I';

interface Entry {
	ansprechperson_bezirksebene: string | undefined;
	ansprechperson_landesebene: string | undefined;
	beschreibung: string | undefined;
	dateiformat: string | undefined;
	datenhoheit_bei: string | undefined;
	datenqualitaet: string | undefined;
	datensatz_titel: string | undefined;
	id: number;
	it_fachverfahren: string | undefined;
	raeumlicher_bezug: string | undefined;
	thema: string | undefined;
	typ: string | undefined;
	user_id: string | undefined;
	verantwortlichkeit_bezirksebene: string | undefined;
	verantwortlichkeit_landesebene: string | undefined;
}

const headers = [
	'id',
	'ansprechperson_bezirksebene',
	'ansprechperson_landesebene',
	'beschreibung',
	'dateiformat',
	'datenhoheit_bei',
	'datenqualitaet',
	'datensatz_titel',
	'it_fachverfahren',
	'raeumlicher_bezug',
	'thema',
	'typ',
	'verantwortlichkeit_bezirksebene',
	'verantwortlichkeit_landesebene',
	'user_id',
];

const rangeString = 'A1:O1';

// function generateShortUUID(): string {
//   return "xxxxxxxx".replace(/[xy]/g, function (c) {
//     var r = (Math.random() * 16) | 0,
//       v = c == "x" ? r : (r & 0x3) | 0x8;
//     return v.toString(16);
//   });
// }

const suffix = 'general_overview'; //generateShortsuffix();

function generate2DArray(entries: Entry[], headers: string[]) {
	const values = entries.map((entry) => {
		const res: (string | boolean | number)[] = headers.map((header) => {
			//@ts-ignore
			const value: string | boolean | number = entry[header];
			return value;
		});
		return res;
	});
	return values;
}

export default async function main() {
	try {
		await Excel.run(async (context) => {
			const response = await fetch(`${SUPABASE_URL}/rest/v1/general_overview`, {
				headers: {
					apikey: `${SUPABASE_SERVICE_ROLE_KEY}`,
					authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
				},
				method: 'GET',
			});
			if (!response.ok) {
				throw new Error(response.statusText);
			}
			const json = (await response.json()) as Entry[];
			console.log(json);

			let sheet = context.workbook.worksheets.getItemOrNullObject(
				`sheet_${suffix}`,
			);
			await context.sync();
			console.log(sheet.isNullObject);
			if (sheet.isNullObject === true) {
				// Only create a new sheet if it does not exist already
				console.log('creating new sheet');
				sheet = context.workbook.worksheets.add(`sheet_${suffix}`);
			} else {
				console.log('sheet exists');

				sheet = context.workbook.worksheets.getItem(`sheet_${suffix}`);
			}
			await context.sync();

			sheet.protection.unprotect('123456789');
			sheet.tabColor = 'ff6347';
			const dataRange = sheet.getRange(rangeString);
			await sheet.tables.context.sync();

			let currentDataTable = sheet.tables.getItemOrNullObject(
				`table_${suffix}`,
			);
			// eslint-disable-next-line office-addins/no-navigational-load
			currentDataTable.load('isNullObject');

			let table: Excel.Table;
			await context.sync();
			if (currentDataTable.isNullObject !== true) {
				currentDataTable = sheet.tables.getItem(`table_${suffix}`);
				console.log('deleting old table');
				currentDataTable.delete();
				// clear the table if we already have one
				await context.sync();
				sheet.getRange(rangeString).values = [headers];
				table = sheet.tables.add(dataRange, true);
			} else {
				sheet.getRange(rangeString).values = [headers];
				table = sheet.tables.add(dataRange, true);
			}

			table.rows.add(undefined, generate2DArray(json, headers));
			table.name = `table_${suffix}`;

			// Duplicate worksheet
			const sheet_copy = sheet.copy(Excel.WorksheetPositionType.end, sheet);
			sheet_copy.tabColor = '00ff00';
			sheet.protection.protect(
				{
					allowAutoFilter: false,
					allowDeleteColumns: false,
					allowDeleteRows: false,
					allowEditObjects: true,
					allowEditScenarios: true,
					allowFormatCells: false,
					allowFormatColumns: false,
					allowFormatRows: false,
					allowInsertColumns: false,
					allowInsertHyperlinks: false,
					allowInsertRows: false,
					allowPivotTables: false,
					allowSort: false,
					selectionMode: Excel.ProtectionSelectionMode.normal,
				},
				'123456789',
			);
			await context.sync();
		});
	} catch (e: unknown) {
		if (e instanceof Error) {
			console.log(e, e.stack);
		}

		return null;
	}
}
