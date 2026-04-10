import { Document, Packer, Paragraph, TextRun } from "docx";
import fs from "fs";

const doc = new Document({
    sections: [
        {
            properties: {},
            children: [
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "BÀI TẬP ÔN TẬP HÓA HỌC",
                            bold: true,
                            size: 32,
                        }),
                    ],
                    alignment: "center",
                }),
                new Paragraph({
                    children: [new TextRun({ text: "" })],
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Phần 1: Trắc nghiệm",
                            bold: true,
                            size: 24,
                        }),
                    ],
                }),
                new Paragraph({
                    children: [new TextRun({ text: "Câu 1: Nguyên tố nào có số hiệu nguyên tử là 1?" })],
                }),
                new Paragraph({ children: [new TextRun({ text: "A. Heli" })] }),
                new Paragraph({ children: [new TextRun({ text: "B. Hidro" })] }),
                new Paragraph({ children: [new TextRun({ text: "C. Liti" })] }),
                new Paragraph({ children: [new TextRun({ text: "D. Beri" })] }),
                
                new Paragraph({
                    children: [new TextRun({ text: "" })],
                }),
                
                new Paragraph({
                    children: [new TextRun({ text: "Câu 2: Công thức hóa học của nước là gì?" })],
                }),
                new Paragraph({ children: [new TextRun({ text: "A. H2O" })] }),
                new Paragraph({ children: [new TextRun({ text: "B. CO2" })] }),
                new Paragraph({ children: [new TextRun({ text: "C. NaCl" })] }),
                new Paragraph({ children: [new TextRun({ text: "D. O2" })] }),

                new Paragraph({
                    children: [new TextRun({ text: "" })],
                }),

                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Phần 2: Tự luận",
                            bold: true,
                            size: 24,
                        }),
                    ],
                }),
                new Paragraph({
                    children: [new TextRun({ text: "Câu 3: Hãy nêu tính chất hóa học của Axit Sunfuric (H2SO4) loãng." })],
                }),
                new Paragraph({
                    children: [new TextRun({ text: "Câu 4: Viết phương trình hóa học khi cho sắt tác dụng với dung dịch Axit Clohidric." })],
                }),
            ],
        },
    ],
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("BaiTapHoaHoc_Testing.docx", buffer);
    console.log("File 'BaiTapHoaHoc_Testing.docx' has been created successfully!");
});
