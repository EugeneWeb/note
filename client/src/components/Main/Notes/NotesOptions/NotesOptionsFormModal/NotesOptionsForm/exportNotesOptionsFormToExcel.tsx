import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { NotesOptionsFormValues } from "./NotesOptionsForm";

export const exportNotesOptionsFormToExcel = async (
    values: NotesOptionsFormValues
) => {
    const fileName = `Служебная_записка_№${values.number}.xlsx`;

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet(fileName, {
        pageSetup: {
            orientation: "portrait",
            paperSize: 9, // Размер бумаги (A4)
            fitToPage: true,
            horizontalCentered: true,
        },
        properties: {
            defaultColWidth: 20,
        },
    });

    const data = [
        ["Регистрационно-учетная карточка служебной записки"],
        [
            "",
            `${values.reg_num} ${
                values.reg_date?.toLocaleDateString("ru") || ""
            }`,
        ],
        [],
        ["Содержание:", values.summary],
        ["Регистратор:", values.registrar],
        ["Подписант:", values.signatory],
        ["Исполнитель:", values.executor],
        ["Кому:", values.to_whom],
        ["Описание:", values.desc],
    ];

    ws.addRows(data);

    const fontName = "Times New Roman";
    ws.eachRow((row) =>
        row.eachCell((cell) => (cell.font = { name: fontName, size: 11 }))
    );

    const borderStyle: Partial<ExcelJS.Border> = {
        style: "thin",
        color: { argb: "FFDBDBDB" },
    };
    const bordersStyle: Partial<ExcelJS.Borders> = {
        bottom: borderStyle,
        top: borderStyle,
        left: borderStyle,
        right: borderStyle,
    };

    for (let i = 4; i < 10; i++) {
        const row = ws.getRow(i);
        row.border = bordersStyle;
        row.alignment = { indent: 1, vertical: "top", wrapText: true };
        ws.getCell(`A${i}`).font.underline = true;
    }

    const alignVHCenter: Partial<ExcelJS.Alignment> = {
        horizontal: "center",
        vertical: "middle",
    };
    ws.getCell("A1").style = {
        font: { bold: true, size: 12, name: fontName },
        alignment: alignVHCenter,
    };
    ws.getCell("B2").style = {
        alignment: alignVHCenter,
        border: bordersStyle,
        font: { size: 12, name: fontName },
    };

    ws.mergeCells("A1:D1");
    ws.mergeCells("B2:C2");
    for (let i = 3; i < 10; i++) ws.mergeCells(`B${i}:D${i}`);

    // автоматическое определение высоты строки, исходя из количества символов в ячейке с данными формы
    ws.getColumn(2).eachCell((cell, rowNumber) => {
        const maxCharactersPerCell = 58,
            baseHeight = 18,
            addedHeightToColumn = 13.5,
            textLength = cell.value ? cell.value.toString().length : 0;
        const height = baseHeight + Math.max(0, Math.ceil(textLength / maxCharactersPerCell) - 1) *addedHeightToColumn;
        ws.getRow(rowNumber).height = height;
    });

    const buffer = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), fileName);
};
