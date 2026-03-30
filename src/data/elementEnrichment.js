// Dữ liệu bổ sung cho các nguyên tố trong bảng tuần hoàn
// Chỉ bổ sung cho 30 nguyên tố phổ biến nhất (lớp 8-12)
// Các nguyên tố khác sẽ hiển thị thông tin cơ bản

export const elementEnrichment = {
  1: { // H
    electronegativity: 2.20,
    state: "Khí",
    meltingPoint: -259.16,
    boilingPoint: -252.87,
    density: "0.00009 g/cm³",
    discoveredBy: "Henry Cavendish",
    yearDiscovered: 1766,
    electron_configuration: "1s¹",
    properties: [
      "Nhẹ nhất trong tất cả các nguyên tố",
      "Khí không màu, không mùi",
      "Cháy với ngọn lửa xanh nhạt",
      "Chiếm 75% khối lượng vũ trụ"
    ],
    funFact: "Hydro là nguyên tố phổ biến nhất trong vũ trụ. Mặt trời chủ yếu được tạo thành từ Hydro!",
    uses: ["Nhiên liệu tên lửa", "Sản xuất amoniac", "Pin nhiên liệu", "Hàn cắt kim loại"],
  },
  2: { // He
    electronegativity: null,
    state: "Khí",
    meltingPoint: -272.2,
    boilingPoint: -268.93,
    density: "0.000164 g/cm³",
    discoveredBy: "Pierre Janssen, Joseph Norman Lockyer",
    yearDiscovered: 1868,
    electron_configuration: "1s²",
    properties: [
      "Khí hiếm, đơn nguyên tử",
      "Không màu, rất nhẹ",
      "Trơ về mặt hóa học",
      "Nhiệt độ sôi thấp nhất"
    ],
    funFact: "Heli được phát hiện trên Mặt trời trước khi được tìm thấy trên Trái đất! Tên gọi heli đến từ 'Helios' — thần Mặt trời.",
    uses: ["Bơm bóng bay", "Làm mát nam châm siêu dẫn trong MRI", "Khí bảo vệ hàn", "Lặn sâu"],
  },
  6: { // C
    electronegativity: 2.55,
    state: "Rắn",
    meltingPoint: 3550,
    boilingPoint: 4027,
    density: "2.267 g/cm³ (graphite)",
    discoveredBy: "Người cổ đại",
    yearDiscovered: null,
    electron_configuration: "1s² 2s² 2p²",
    properties: [
      "Có nhiều dạng thù hình: kim cương, than chì, fullerene",
      "Kim cương là vật liệu cứng nhất tự nhiên",
      "Cơ sở của hóa hữu cơ",
      "Tạo 4 liên kết cộng hóa trị"
    ],
    funFact: "Cacbon là nguyên tố kỳ diệu nhất — cùng một nguyên tố nhưng tạo ra cả kim cương quý giá và than chì mềm viết bút chì!",
    uses: ["Kim cương", "Sợi carbon", "Thép (hợp kim Fe-C)", "Than hoạt tính"],
  },
  7: { // N
    electronegativity: 3.04,
    state: "Khí",
    meltingPoint: -210.0,
    boilingPoint: -195.79,
    density: "0.001145 g/cm³",
    discoveredBy: "Daniel Rutherford",
    yearDiscovered: 1772,
    electron_configuration: "1s² 2s² 2p³",
    properties: [
      "Chiếm 78% khí quyển Trái đất",
      "Liên kết ba N≡N rất bền",
      "Cần thiết cho protein và ADN",
      "Khí không màu, không mùi"
    ],
    funFact: "Nitơ lỏng lạnh đến -196°C. Các đầu bếp dùng nó để làm kem ngay lập tức!",
    uses: ["Phân bón", "Chất nổ TNT", "Bảo quản thực phẩm", "Kem làm lạnh nhanh"],
  },
  8: { // O
    electronegativity: 3.44,
    state: "Khí",
    meltingPoint: -218.79,
    boilingPoint: -182.96,
    density: "0.001308 g/cm³",
    discoveredBy: "Joseph Priestley, Carl Wilhelm Scheele",
    yearDiscovered: 1774,
    electron_configuration: "1s² 2s² 2p⁴",
    properties: [
      "Chiếm 21% khí quyển Trái đất",
      "Cần thiết cho hô hấp",
      "Hỗ trợ sự cháy",
      "Có dạng thù hình Ozon (O₃)"
    ],
    funFact: "Oxy chiếm 65% khối lượng cơ thể con người! Phần lớn nằm trong nước (H₂O).",
    uses: ["Y tế (thở oxy)", "Hàn cắt kim loại", "Sản xuất thép", "Xử lý nước thải"],
  },
  11: { // Na
    electronegativity: 0.93,
    state: "Rắn",
    meltingPoint: 97.72,
    boilingPoint: 883,
    density: "0.968 g/cm³",
    discoveredBy: "Humphry Davy",
    yearDiscovered: 1807,
    electron_configuration: "1s² 2s² 2p⁶ 3s¹",
    properties: [
      "Kim loại kiềm, mềm, cắt được bằng dao",
      "Phản ứng mạnh với nước",
      "Có màu trắng bạc sáng bóng",
      "Bảo quản trong dầu hỏa"
    ],
    funFact: "Natri phản ứng với nước dữ dội — có thể nổ! Các nhà hóa học phải thuộc tính này từ khi học cấp 2.",
    uses: ["Muối ăn NaCl", "Xà phòng NaOH", "Đèn đường natri", "Công nghiệp hóa chất"],
  },
  12: { // Mg
    electronegativity: 1.31,
    state: "Rắn",
    meltingPoint: 650,
    boilingPoint: 1091,
    density: "1.738 g/cm³",
    discoveredBy: "Joseph Black",
    yearDiscovered: 1755,
    electron_configuration: "1s² 2s² 2p⁶ 3s²",
    properties: [
      "Kim loại nhẹ, màu trắng bạc",
      "Cháy với ngọn lửa trắng chói lòa",
      "Có trong diệp lục tố (chlorophyll)",
      "Hợp kim Mg nhẹ và bền"
    ],
    funFact: "Lửa magiê sáng đến mức không thể nhìn trực tiếp! Pháo sáng và pháo hoa dùng bột Mg để tạo ánh sáng trắng chói.",
    uses: ["Hợp kim máy bay", "Pháo sáng", "Thuốc dạ dày (MgOH₂)", "Vỏ laptop"],
  },
  13: { // Al
    electronegativity: 1.61,
    state: "Rắn",
    meltingPoint: 660.32,
    boilingPoint: 2519,
    density: "2.7 g/cm³",
    discoveredBy: "Hans Christian Ørsted",
    yearDiscovered: 1825,
    electron_configuration: "1s² 2s² 2p⁶ 3s² 3p¹",
    properties: [
      "Kim loại nhẹ, dẻo, dẫn điện tốt",
      "Có lớp oxit Al₂O₃ bảo vệ bên ngoài",
      "Phổ biến thứ 3 trong vỏ Trái đất",
      "Tái chế dễ dàng"
    ],
    funFact: "Vào thế kỷ 19, nhôm từng đắt hơn vàng! Napoleon III dùng bộ đồ ăn bằng nhôm để thể hiện sự giàu có.",
    uses: ["Lon nước giải khát", "Máy bay", "Giấy bạc", "Cửa sổ"],
  },
  17: { // Cl
    electronegativity: 3.16,
    state: "Khí",
    meltingPoint: -101.5,
    boilingPoint: -34.04,
    density: "0.0029 g/cm³",
    discoveredBy: "Carl Wilhelm Scheele",
    yearDiscovered: 1774,
    electron_configuration: "1s² 2s² 2p⁶ 3s² 3p⁵",
    properties: [
      "Khí vàng lục, mùi hắc",
      "Rất độc khi hít phải",
      "Tính oxi hóa mạnh",
      "Tẩy trắng và khử trùng"
    ],
    funFact: "Clo được dùng trong nước máy để diệt vi khuẩn. Mùi 'nước hồ bơi' chính là mùi clo!",
    uses: ["Khử trùng nước", "Sản xuất PVC", "Thuốc tẩy", "Muối ăn NaCl"],
  },
  20: { // Ca
    electronegativity: 1.00,
    state: "Rắn",
    meltingPoint: 842,
    boilingPoint: 1484,
    density: "1.55 g/cm³",
    discoveredBy: "Humphry Davy",
    yearDiscovered: 1808,
    electron_configuration: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s²",
    properties: [
      "Kim loại kiềm thổ, màu trắng bạc",
      "Thành phần chính của xương và răng",
      "Phản ứng với nước tạo Ca(OH)₂",
      "CaCO₃ là thành phần của đá vôi"
    ],
    funFact: "99% canxi trong cơ thể nằm ở xương và răng. Uống sữa mỗi ngày giúp xương chắc khỏe!",
    uses: ["Xi măng", "Thạch cao", "Bón vôi cho đất", "Bổ sung canxi (thuốc)"],
  },
  26: { // Fe
    electronegativity: 1.83,
    state: "Rắn",
    meltingPoint: 1538,
    boilingPoint: 2862,
    density: "7.874 g/cm³",
    discoveredBy: "Người cổ đại",
    yearDiscovered: null,
    electron_configuration: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s²",
    properties: [
      "Kim loại phổ biến nhất trên Trái đất",
      "Có từ tính",
      "Dễ bị gỉ (oxi hóa) trong không khí ẩm",
      "Thành phần chính của hemoglobin trong máu"
    ],
    funFact: "Lõi Trái đất chủ yếu là sắt nóng chảy! Chính dòng sắt lỏng này tạo ra từ trường bảo vệ Trái đất khỏi bức xạ Mặt trời.",
    uses: ["Thép xây dựng", "Ô tô", "Nam châm", "Dụng cụ nấu ăn"],
  },
  29: { // Cu
    electronegativity: 1.90,
    state: "Rắn",
    meltingPoint: 1084.62,
    boilingPoint: 2562,
    density: "8.96 g/cm³",
    discoveredBy: "Người cổ đại",
    yearDiscovered: null,
    electron_configuration: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s¹",
    properties: [
      "Kim loại màu đỏ cam đặc trưng",
      "Dẫn điện rất tốt (sau Ag)",
      "Dẻo, dễ kéo sợi",
      "Tạo màng xanh (patina) khi tiếp xúc không khí lâu"
    ],
    funFact: "Tượng Nữ thần Tự do ở New York được phủ 80 tấn đồng! Màu xanh lục của tượng là do đồng bị oxi hóa theo thời gian.",
    uses: ["Dây điện", "Ống nước", "Đồng xu", "Bo mạch điện tử"],
  },
  79: { // Au
    electronegativity: 2.54,
    state: "Rắn",
    meltingPoint: 1064.18,
    boilingPoint: 2856,
    density: "19.3 g/cm³",
    discoveredBy: "Người cổ đại",
    yearDiscovered: null,
    electron_configuration: "[Xe] 4f¹⁴ 5d¹⁰ 6s¹",
    properties: [
      "Kim loại quý, màu vàng đặc trưng",
      "Không bị oxi hóa trong không khí",
      "Dẻo nhất trong các kim loại",
      "Dẫn điện tốt"
    ],
    funFact: "1 ounce vàng (31g) có thể kéo thành sợi dài 80km! Hoặc dát mỏng phủ được 9m² bề mặt.",
    uses: ["Trang sức", "Điện tử (đầu nối)", "Dự trữ tài chính", "Nha khoa"],
  },
};

// Hàm merge dữ liệu bổ sung vào nguyên tố
export function enrichElement(element) {
  const extra = elementEnrichment[element.number];
  if (!extra) return element;
  return { ...element, ...extra };
}
