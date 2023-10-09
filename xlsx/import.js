// @ts-check
/* eslint n/prefer-global/process: [error] */

import {readFile} from 'node:fs/promises';
import postgres from 'postgres';

export async function main() {
	let sql;

	try {
		if (process.env.DATABASE_URL === undefined) {
			throw new Error('DATABASE_URL is not set');
		}

		// This file needs to be generate from the Gesamtübersicht von SenASGIVA Abteilung III.xlsx
		const content = await readFile('./general_overview.json', 'utf8');
		/**
		 * @type {Array<{
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
    dateiformat: string;
    datenqualitaet: string;
}>}
		 */
		const json = JSON.parse(content);

		sql = postgres(process.env.DATABASE_URL);
		const result = await sql`insert into general_overview ${sql(json)}`;

		console.log(result);
		await sql.end();
	} catch (error) {
		throw error;
	} finally {
		if (sql !== undefined) {
			await sql.end();
		}
	}
}

await main();
