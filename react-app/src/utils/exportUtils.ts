import { utils, writeFile } from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = (samples: any[], fileName: string) => {
  const worksheet = utils.json_to_sheet(samples);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Samples");
  writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToCSV = (samples: any[], fileName: string) => {
  const worksheet = utils.json_to_sheet(samples);
  const csv = utils.sheet_to_csv(worksheet);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `${fileName}.csv`);
};
