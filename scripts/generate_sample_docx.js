import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import fs from "fs";

// Create a new document
const doc = new Document({
    sections: [
        {
            properties: {},
            children: [
                new Paragraph({
                    text: "BÀI TẬP ÔN TẬP HÓA HỌC (VÍ DỤ MẪU)",
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({ text: "" }), // spacing
                
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "PHẦN I. TRẮC NGHIỆM",
                            bold: true,
                            size: 28,
                        }),
                    ],
                }),
                new Paragraph({ text: "" }),

                new Paragraph({
                    children: [
                        new TextRun({ text: "Câu 1. ", bold: true }),
                        new TextRun("Nguyên tố nào có số hiệu nguyên tử là 1?"),
                    ],
                }),
                new Paragraph({ text: "A. Heli" }),
                new Paragraph({ text: "B. Hidro" }),
                new Paragraph({ text: "C. Liti" }),
                new Paragraph({ text: "D. Beri" }),
                new Paragraph({ text: "" }),

                new Paragraph({
                    children: [
                        new TextRun({ text: "Câu 2. ", bold: true }),
                        new TextRun("Công thức hóa học của nước là gì?"),
                    ],
                }),
                new Paragraph({ text: "A. H2O" }),
                new Paragraph({ text: "B. CO2" }),
                new Paragraph({ text: "C. NaCl" }),
                new Paragraph({ text: "D. O2" }),
                new Paragraph({ text: "" }),

                new Paragraph({
                    children: [
                        new TextRun({
                            text: "PHẦN II. TỰ LUẬN",
                            bold: true,
                            size: 28,
                        }),
                    ],
                }),
                new Paragraph({ text: "" }),

                new Paragraph({
                    children: [
                        new TextRun({ text: "Câu 3. ", bold: true }),
                        new TextRun("Hãy nêu tính chất hóa học của Axit Sunfuric (H2SO4) loãng."),
                    ],
                }),
                new Paragraph({ text: "" }),

                new Paragraph({
                    children: [
                        new TextRun({ text: "Câu 4. ", bold: true }),
                        new TextRun("Viết phương trình hóa học khi cho sắt (Fe) tác dụng với dung dịch Axit Clohidric (HCl)."),
                    ],
                }),
                new Paragraph({ text: "" }),

                new Paragraph({
                    children: [
                        new TextRun({
                            text: "ĐÁP ÁN THAM KHẢO",
                            bold: true,
                        }),
                    ],
                }),
                new Paragraph({ text: "1-B, 2-A" }),
            ],
        },
    ],
});

// Finalize and save
Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("BaiTapMau_Chemistry_Odyssey.docx", buffer);
    console.log("Success: BaiTapMau_Chemistry_Odyssey.docx has been created in the root directory.");
});
