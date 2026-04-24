/**
 * Danh sách các mô phỏng hóa học do Chemistry Odyssey tự phát triển (Custom Simulations)
 * Thay thế cho các mô phỏng bên thứ ba, đảm bảo số liệu chuẩn xác hóa học.
 */

export const CHEM_SIMULATIONS = [
  // === LỚP 8 ===
  {
    id: 'molarity',
    title: 'Pha chế dung dịch & Nồng độ mol',
    description: 'Hòa tan các chất rắn (CuSO₄, KMnO₄...) vào nước. Tính toán số mol, nồng độ mol và kiểm tra độ bão hòa.',
    icon: '🧪',
    grade: 8,
    topics: ['Nồng độ', 'Pha chế', 'Số mol'],
    component: 'MolaritySim',
  },
  {
    id: 'density',
    title: 'Khối lượng riêng & Lực đẩy Archimedes',
    description: 'Cân khối lượng và đo thể tích các vật liệu (gỗ, nhôm, vàng...). Thả vào các chất lỏng khác nhau để xem vật nổi hay chìm.',
    icon: '⚖️',
    grade: 8,
    topics: ['Khối lượng riêng', 'Sự nổi', 'Thể tích'],
    component: 'DensitySim',
  },
  {
    id: 'ph_scale',
    title: 'Thang pH và Nồng độ [H⁺], [OH⁻]',
    description: 'Đo pH của 14 loại dung dịch thực tế phổ biến (Axit dạ dày, Cà phê, Máu, Xà phòng...). Hệ thống tự tính toán nồng độ ion.',
    icon: '🔬',
    grade: 8,
    topics: ['pH', 'Axit', 'Bazơ'],
    component: 'pHScaleSim',
  },

  // === LỚP 9 ===
  {
    id: 'molarity_9',
    title: 'Nồng độ mol dung dịch',
    description: 'Tìm hiểu sâu về nồng độ mol, điểm bão hòa và sự kết tủa khi nồng độ vượt mức.',
    icon: '🧫',
    grade: 9,
    topics: ['Nồng độ mol', 'Dung dịch', 'Kết tủa'],
    component: 'MolaritySim',
  },

  // === LỚP 10 ===
  {
    id: 'gas_properties',
    title: 'Định luật Khí lý tưởng (PV = nRT)',
    description: 'Mô phỏng chuyển động của các phân tử khí. Thay đổi nhiệt độ, thể tích, số mol và quan sát sự biến thiên của áp suất.',
    icon: '🎈',
    grade: 10,
    topics: ['Áp suất', 'PV=nRT', 'Nhiệt độ'],
    component: 'GasLawSim',
  },
  {
    id: 'density_10',
    title: 'Tỉ khối và Khối lượng riêng',
    description: 'Khám phá sự liên hệ giữa khối lượng, thể tích vật rắn và lực đẩy Archimedes trong chất lỏng.',
    icon: '⚖️',
    grade: 10,
    topics: ['Khối lượng riêng', 'Tỉ khối'],
    component: 'DensitySim',
  },

  // === LỚP 11 ===
  {
    id: 'ph_scale_11',
    title: 'Cân bằng Axit - Bazơ',
    description: 'Đo pH các dung dịch, phân tích mối quan hệ giữa pH, pOH, [H⁺] và [OH⁻] ở trạng thái cân bằng.',
    icon: '⚗️',
    grade: 11,
    topics: ['pH/pOH', 'Cân bằng', 'Ion'],
    component: 'pHScaleSim',
  },
];
