// @ts-nocheck
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

const SUPABASE_URL = 'https://123yourid.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'ey123...';

type Entry = {
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
};

const headers = [
	'id',
	'thema',
	'typ',
	'datensatz_titel',
	'beschreibung',
	'raeumlicher_bezug',
	'verantwortlichkeit_bezirksebene',
	'ansprechperson_bezirksebene',
	'verantwortlichkeit_landesebene',
	'ansprechperson_landesebene',
	'datenhoheit_bei',
	'it_fachverfahren',
	'dateiformat',
	'datenqualitaet',
	'user_id',
];

const rangeString = 'A1:O1';

function generateShortUUID(): string {
	return 'xxxxxxxx'.replaceAll(/[xy]/g, c => {
		const r = Math.random() * 16 | 0;
		const v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

const suffix = 'general_overview';// GenerateShortsuffix();

function generate2DArray(entries: Entry[], headers: string[]) {
	const values = entries.map(entry => {
		const res: Array<string | boolean | number> = headers.map(header => {
			const value: string | boolean | number = entry[header];
			return value;
		});
		return res;
	});
	return values;
}

async function main(workbook: ExcelScript.Workbook): Promise<Entry[]> {
	try {
		const response = await fetch(`${SUPABASE_URL}/rest/v1/general_overview?order=id`, {
			headers: {
				apikey: `${SUPABASE_SERVICE_ROLE_KEY}`,
				authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
			},
			method: 'GET',
		});
		if (!response.ok) {
			throw new Error(response.statusText);
		}

		const json = await response.json() as Entry[];
		console.log(json);
		const currentDataSheet = workbook.getWorksheet(`sheet_${suffix}`);

		const sheet = currentDataSheet ? currentDataSheet : workbook.addWorksheet(`sheet_${suffix}`);
		sheet.getProtection().unprotect('123456789');
		sheet.setTabColor('ff6347');
		const dataRange = sheet.getRange(rangeString);
		const currentDataTable = sheet.getTable(`table_${suffix}`);
		let table: ExcelScript.Table;
		if (currentDataTable) {
			console.log('deleting old table');
			// Clear the table if we already have one
			const columns = currentDataTable.getColumns();
			for (let i = columns.length - 1; i === 0; i--) {
				columns[i].delete();
			}

			currentDataTable.delete();
			sheet.getRange(rangeString).setValues([headers]);
			table = sheet.addTable(dataRange, true);
		} else {
			sheet.getRange(rangeString).setValues([headers]);
			table = sheet.addTable(dataRange, true);
		}

		table.addRows(null, generate2DArray(json, headers));
		table.setName(`table_${suffix}`);

		// Duplicate worksheet
		const sheet_copy = sheet.copy(ExcelScript.WorksheetPositionType.end, sheet);
		sheet_copy.setTabColor('00ff00');
		sheet.getProtection().protect({
			allowAutoFilter: false, allowDeleteColumns: false, allowDeleteRows: false,
			allowEditObjects: true, allowEditScenarios: true, allowFormatCells: false,
			allowFormatColumns: false, allowFormatRows: false, allowInsertColumns: false,
			allowInsertHyperlinks: false, allowInsertRows: false, allowPivotTables: false,
			allowSort: false, selectionMode: ExcelScript.ProtectionSelectionMode.normal,
		}, '123456789');
		return json;
	} catch (error) {
		console.log(error);
		return null;
	}
}
