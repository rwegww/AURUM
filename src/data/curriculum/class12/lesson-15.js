export const bai15 = {
  "id": "hoa12_kntt_bai15",
  "classId": 12,
  "lessonId": 15,
  "programId": "ketnoi",
  "title": "Bài 15. Thế điện cực và nguồn điện hoá học",
  "chapter": "Chương 5. Pin điện và điện phân",
  "order": 15,
  "isPremium": false,
  "thumbnail": "https://res.cloudinary.com/dpcorzgkm/image/upload/v1731464309/chemistry-learning/lesson/oip4e1k80i2e7x83r8h.webp",
  "description": "Nguyên lý hoạt động của pin điện hóa. Tìm hiểu về thế điện cực chuẩn, suất điện động của pin và các loại nguồn điện thông dụng.",
  "theoryModules": [
    {
      "id": "mod1",
      "type": "heading",
      "content": {
        "text": "1. Nguyên lý hoạt động của Pin điện hóa",
        "level": "h2"
      }
    },
    {
      "id": "mod2",
      "type": "paragraph",
      "content": {
        "text": "Pin điện hóa là thiết bị chuyển hóa năng lượng của phản ứng oxi hóa - khử tự phát thành điện năng. Một pin điện hóa điển hình gồm hai nửa tế bào (hai điện cực) nối với nhau bằng cầu muối. Trong pin, dòng electron di chuyển từ cực âm sang cực dương ở mạch ngoài, tạo ra dòng điện một chiều."
      }
    },
    {
      "id": "mod3",
      "type": "list",
      "content": {
        "type": "bullet",
        "items": [
          "**Anode (Cực âm -):** Là điện cực xảy ra quá trình oxi hóa (kim loại mạnh hơn nhường electron). Ví dụ: $Zn \\rightarrow Zn^{2+} + 2e^-$.",
          "**Cathode (Cực dương +):** Là điện cực xảy ra quá trình khử (ion kim loại yếu hơn nhận electron). Ví dụ: $Cu^{2+} + 2e^- \\rightarrow Cu$."
        ]
      }
    },
    {
      "id": "mod4",
      "type": "heading",
      "content": {
        "text": "2. Pin Daniell và Cầu muối",
        "level": "h2"
      }
    },
    {
      "id": "mod5",
      "type": "infoBox",
      "content": {
        "title": "Cấu tạo Pin Daniell",
        "content": "Pin Daniell gồm thanh kẽm nhúng trong dung dịch $ZnSO_4$ và thanh đồng nhúng trong dung dịch $CuSO_4$, hai dung dịch nối với nhau bằng cầu muối (chứa dung dịch chất điện li trơ như $KNO_3$ hoặc $KCl$).\n- **Vai trò cầu muối**: Giúp duy trì sự trung hòa điện trong cả hai nửa tế bào bằng cách cho các ion di chuyển qua lại, đảm bảo pin hoạt động liên tục.",
        "color": "blue"
      }
    },
    {
      "id": "mod6",
      "type": "heading",
      "content": {
        "text": "3. Thế điện cực chuẩn và Suất điện động",
        "level": "h2"
      }
    },
    {
      "id": "mod7",
      "type": "paragraph",
      "content": {
        "text": "Để đánh giá sức mạnh oxi hóa - khử của một cặp điện cực, người ta sử dụng **Thế điện cực chuẩn** ($E^o$), được đo so với Điện cực Hydrogen chuẩn ($E^o(2H^+/H_2) = 0V$). Suất điện động của pin ($E^o_{pin}$) được tính bằng hiệu số giữa thế điện cực của cathode và anode:\n**$E^o_{pin} = E^o_{cathode} - E^o_{anode}$**.\nGiá trị $E^o_{pin}$ luôn dương đối với các pin điện hóa hoạt động tự phát."
      }
    },
    {
      "id": "mod8",
      "type": "warningBox",
      "content": {
        "title": "Pin và Acquy thực tế",
        "content": "- **Pin sơ cấp**: Chỉ dùng một lần, phản ứng hóa học không thể đảo ngược (ví dụ: pin kẽm-carbon).\n- **Pin thứ cấp (Acquy/Pin sạc)**: Có thể nạp điện (sạc) để sử dụng nhiều lần do phản ứng hóa học trong pin có tính thuận nghịch. Pin Lithium-ion trong điện thoại và xe điện là đại diện tiêu biểu nhờ mật độ năng lượng cao và tuổi thọ lớn.",
        "color": "orange"
      }
    }
  ],
  "quizzes": [
    {
      "id": "q1",
      "question": "Trong pin điện hóa Zn-Cu, quá trình nào xảy ra ở cực âm (anode)?",
      "options": [
        "Sự oxi hóa kẽm ($Zn \\rightarrow Zn^{2+} + 2e^-$).",
        "Sự khử kẽm ($Zn^{2+} + 2e^- \\rightarrow Zn$).",
        "Sự oxi hóa đồng ($Cu \\rightarrow Cu^{2+} + 2e^-$).",
        "Sự khử đồng ($Cu^{2+} + 2e^- \\rightarrow Cu$)."
      ],
      "correctAnswer": 0,
      "explanation": "Ở cực âm (anode) của pin điện hóa, kim loại mạnh hơn (kẽm) sẽ bị oxi hóa để giải phóng electron vào mạch ngoài."
    },
    {
      "id": "q2",
      "question": "Tính suất điện động chuẩn của pin điện hóa tạo bởi cặp điện cực $Fe^{2+}/Fe$ ($E^o = -0,44V$) và $Ag^+/Ag$ ($E^o = +0,80V$)?",
      "options": [
        "0,36 V.",
        "1,24 V.",
        "-1,24 V.",
        "0,44 V."
      ],
      "correctAnswer": 1,
      "explanation": "Suất điện động $E^o_{pin} = E^o_{cathode} - E^o_{anode} = E^o_{Ag^+/Ag} - E^o_{Fe^{2+}/Fe} = 0,80 - (-0,44) = 1,24 V$."
    }
  ],
  "videoModules": [
    {
      "id": "v1",
      "title": "Bài giảng: Thế điện cực và Nguồn điện hóa học",
      "url": "https://www.youtube.com/watch?v=oKKg9Hs0xL0",
      "thumbnail": "https://img.youtube.com/vi/oKKg9Hs0xL0/0.jpg",
      "description": "Nguyên lý hoạt động của pin điện hóa, suất điện động và cách tính hiệu điện thế (VietJack)."
    }
  ],
  "practiceModules": [],
  "vocabulary": [],
  "interactiveLabs": [],
  "game": null,
  "realWorldApplications": []
};
