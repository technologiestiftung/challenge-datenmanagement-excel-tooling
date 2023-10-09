# Data Processing

to make the processing of the file easer the headers from the file we transformed the headers.

- Replace all whitespace and replace with `_`
- Replace all `[ä,ö,ü]` with `[ae,oe,ue]`
- Make all lower case

We used office script to convert the file `Gesamtübersicht von SenASGIVA Abteilung III.xlsx` to JSON.

```ts
interface TableData {
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
}
function main(workbook: ExcelScript.Workbook): TableData[] {
    const sheet = workbook.getActiveWorksheet()


    const tables = sheet.getTables()
    if (tables[0]) {
        const table = tables[0];
        const texts = table.getRange().getTexts();
        const keys = texts[0].map(item => item.toLowerCase().replace(/\s/g, "_").replace(/[Ää]/gi, "ae").replace("_-_", "_").replace("-","_"));
        const data: TableData[] = texts.slice(1).map((row, index, arr) => {
            const item = {} as TableData;
            for (let i = 0; i < keys.length; i++) {
                item[keys[i]] = row[i];
            }
            return item;
        })
        // If the sheet already exists this will fail silently
        const outputSheet = workbook.addWorksheet("output");
        outputSheet.getRange("A1").setValue(JSON.stringify(data));
        return data;
    }
}
```