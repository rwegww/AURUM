/**
 * Danh sách thí nghiệm mô phỏng tương tác PhET (phet.colorado.edu)
 * Mỗi thí nghiệm là 1 iframe nhúng mô phỏng tương tác, phân theo lớp
 */

export const CHEM_SIMULATIONS = [
  // === LỚP 8 ===
  {
    id: 'concentration',
    title: 'Nồng độ dung dịch',
    description: 'Thay đổi lượng chất tan, thể tích dung dịch và quan sát sự thay đổi nồng độ mol.',
    icon: '🧪',
    grade: 8,
    topics: ['Nồng độ', 'Chất tan', 'Dung dịch'],
    url: 'https://phet.colorado.edu/sims/html/molarity/latest/molarity_all.html?locale=vi',
  },
  {
    id: 'states_of_matter',
    title: 'Trạng thái của vật chất',
    description: 'Quan sát phân tử ở 3 trạng thái rắn, lỏng, khí. Thay đổi nhiệt độ và áp suất.',
    icon: '🧊',
    grade: 8,
    topics: ['Trạng thái', 'Phân tử', 'Nhiệt độ'],
    url: 'https://phet.colorado.edu/sims/html/states-of-matter/latest/states-of-matter_all.html?locale=vi',
  },
  {
    id: 'ph_scale',
    title: 'Thang pH',
    description: 'Đo pH của nhiều loại dung dịch khác nhau và hiểu tính axit-bazơ.',
    icon: '🔬',
    grade: 8,
    topics: ['pH', 'Axit', 'Bazơ'],
    url: 'https://phet.colorado.edu/sims/html/ph-scale/latest/ph-scale_all.html?locale=vi',
  },
  {
    id: 'density',
    title: 'Khối lượng riêng',
    description: 'Khám phá mối quan hệ giữa khối lượng, thể tích và khối lượng riêng.',
    icon: '⚖️',
    grade: 8,
    topics: ['Khối lượng riêng', 'Khối lượng', 'Thể tích'],
    url: 'https://phet.colorado.edu/sims/html/density/latest/density_all.html?locale=vi',
  },

  // === LỚP 9 ===
  {
    id: 'concentration_solutions',
    title: 'Nồng độ mol dung dịch',
    description: 'Pha chế dung dịch với nồng độ mol xác định, thay đổi chất tan và thể tích.',
    icon: '🧫',
    grade: 9,
    topics: ['Nồng độ mol', 'Pha chế', 'Dung dịch'],
    url: 'https://phet.colorado.edu/sims/html/molarity/latest/molarity_all.html?locale=vi',
  },
  {
    id: 'acid_base_solutions',
    title: 'Dung dịch Axit - Bazơ',
    description: 'Tìm hiểu về axit mạnh, axit yếu, bazơ mạnh, bazơ yếu và đo pH.',
    icon: '⚗️',
    grade: 9,
    topics: ['Axit', 'Bazơ', 'pH', 'Điện li'],
    url: 'https://phet.colorado.edu/sims/html/acid-base-solutions/latest/acid-base-solutions_all.html?locale=vi',
  },
  {
    id: 'reactants_products',
    title: 'Chất phản ứng, Sản phẩm và Phần dư',
    description: 'Tạo sản phẩm từ chất phản ứng, tìm hiểu chất dư và chất hết.',
    icon: '🔄',
    grade: 9,
    topics: ['Phản ứng hóa học', 'Chất dư', 'Hiệu suất'],
    url: 'https://phet.colorado.edu/sims/html/reactants-products-and-leftovers/latest/reactants-products-and-leftovers_all.html?locale=vi',
  },
  {
    id: 'balancing_equations',
    title: 'Cân bằng phương trình hóa học',
    description: 'Cân bằng phương trình hóa học bằng cách thêm hệ số.',
    icon: '⚖️',
    grade: 9,
    topics: ['Phương trình', 'Cân bằng', 'Hệ số'],
    url: 'https://phet.colorado.edu/sims/html/balancing-chemical-equations/latest/balancing-chemical-equations_all.html?locale=vi',
  },

  // === LỚP 10 ===
  {
    id: 'gas_properties',
    title: 'Tính chất của khí',
    description: 'Bơm khí vào bình kín, thay đổi nhiệt độ và thể tích. Khám phá định luật khí.',
    icon: '🎈',
    grade: 10,
    topics: ['Áp suất', 'Thể tích', 'Nhiệt độ', 'PV=nRT'],
    url: 'https://phet.colorado.edu/sims/html/gas-properties/latest/gas-properties_all.html?locale=vi',
  },
  {
    id: 'gases_intro',
    title: 'Giới thiệu về Khí',
    description: 'Khám phá mối quan hệ giữa áp suất, thể tích, nhiệt độ và số mol khí.',
    icon: '💨',
    grade: 10,
    topics: ['Khí lý tưởng', 'Boyle', 'Charles'],
    url: 'https://phet.colorado.edu/sims/html/gases-intro/latest/gases-intro_all.html?locale=vi',
  },
  {
    id: 'atomic_structure',
    title: 'Cấu tạo nguyên tử',
    description: 'Xây dựng nguyên tử từ proton, neutron và electron. Xác định nguyên tố.',
    icon: '⚛️',
    grade: 10,
    topics: ['Nguyên tử', 'Proton', 'Electron', 'Neutron'],
    url: 'https://phet.colorado.edu/sims/html/build-an-atom/latest/build-an-atom_all.html?locale=vi',
  },
  {
    id: 'isotopes',
    title: 'Đồng vị và Khối lượng nguyên tử',
    description: 'Tìm hiểu về đồng vị, tính khối lượng nguyên tử trung bình.',
    icon: '🔬',
    grade: 10,
    topics: ['Đồng vị', 'Khối lượng nguyên tử', 'Số khối'],
    url: 'https://phet.colorado.edu/sims/html/isotopes-and-atomic-mass/latest/isotopes-and-atomic-mass_all.html?locale=vi',
  },

  // === LỚP 11 ===
  {
    id: 'molecule_shapes',
    title: 'Hình dạng phân tử',
    description: 'Khám phá hình dạng phân tử dựa trên mô hình VSEPR.',
    icon: '🔗',
    grade: 11,
    topics: ['Hình học phân tử', 'VSEPR', 'Liên kết'],
    url: 'https://phet.colorado.edu/sims/html/molecule-shapes/latest/molecule-shapes_all.html?locale=vi',
  },
  {
    id: 'molecule_polarity',
    title: 'Độ phân cực phân tử',
    description: 'Tìm hiểu cách phân bố electron ảnh hưởng đến độ phân cực phân tử.',
    icon: '⚡',
    grade: 11,
    topics: ['Phân cực', 'Lưỡng cực', 'Điện âm'],
    url: 'https://phet.colorado.edu/sims/html/molecule-polarity/latest/molecule-polarity_all.html?locale=vi',
  },
  {
    id: 'reaction_rates',
    title: 'Tốc độ phản ứng',
    description: 'Thay đổi nhiệt độ, nồng độ và quan sát tốc độ phản ứng thay đổi.',
    icon: '⏱️',
    grade: 11,
    topics: ['Tốc độ phản ứng', 'Xúc tác', 'Năng lượng hoạt hóa'],
    url: 'https://phet.colorado.edu/sims/html/reactions-and-rates/latest/reactions-and-rates_all.html?locale=vi',
  },

  // === LỚP 12 ===
  {
    id: 'molecule_builder',
    title: 'Xây dựng phân tử',
    description: 'Xây dựng phân tử hữu cơ và vô cơ từ các nguyên tử.',
    icon: '🧬',
    grade: 12,
    topics: ['Phân tử', 'Công thức', 'Hóa hữu cơ'],
    url: 'https://phet.colorado.edu/sims/html/build-a-molecule/latest/build-a-molecule_all.html?locale=vi',
  },
  {
    id: 'beer_lambert',
    title: 'Phòng thí nghiệm Beer-Lambert',
    description: 'Khám phá định luật Beer-Lambert về hấp thụ ánh sáng qua dung dịch.',
    icon: '🌈',
    grade: 12,
    topics: ['Beer-Lambert', 'Quang phổ', 'Hấp thụ'],
    url: 'https://phet.colorado.edu/sims/html/beers-law-lab/latest/beers-law-lab_all.html?locale=vi',
  },
];
