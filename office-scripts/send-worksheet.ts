//@ts-nocheck
// NOTES:
//
// - this script needs the active worksheet so might not be useful in power automate
// - When duplicating a sheet the tables on the sheet also get duplicated.
//   We can't access the table on the copied sheet by the same name as the old one
//   since the name gets a random number appended.
//   This script is actually very much in need for a UI
// TODO:
// - get active worksheet
// - get table

// - (optional) compare to existing table (to only post diff)
// - create JSON from table
// - POST to API

const SUPABASE_URL = "https://123yourid.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "ey123...";

interface Result {
  success: boolean;
  message: string;
}

function tableToJson<T>(table: ExcelScript.Table){
    const texts = table.getRange().getTexts()
    const keys = texts[0].map(item => item.toLowerCase().replace(/\s/g, "_").replace(/[Ää]/gi, "ae"));
    const data: T[] = texts.slice(1).map((row, index, arr) => {
      const item = {} as T
      for (let i = 0; i < keys.length; i++) {
        item[keys[i]] = row[i];
      }
      return item;
    })
    return data;
}

async function main(workbook: ExcelScript.Workbook): Promise<Result> {
  try{

  const sheet = workbook.getActiveWorksheet();
  const tables = sheet.getTables();
  if(tables.length === 0){
    throw new Error("Could not find any tables in this sheet");
  }
    if (!tables[0].getName().startsWith("table_general_overview")){
      throw new Error("Could not find any table with name starting with `table_general_overview`");
    }

  const table = tables[0];
  const data = tableToJson(table);
  console.log(data);
  // This is a temporary fix since we dont have user_ids yet

  data.forEach((item: {user_id: string|null}) =>{
    item.user_id = null;
  })

  const response = await fetch(`${SUPABASE_URL}/rest/v1/general_overview`, {
    method: "POST",
    headers: {
      apikey: `${SUPABASE_SERVICE_ROLE_KEY}`,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify(data),
  });

  if(response.ok){

    return { success: true, message: "yay" };
  }else{
    const message = await response.text()
    console.log(message )
    return { success: false, message };
  }
  }catch(e){
    console.log(e);
    return { success: false, message: e.message };

  }

}
