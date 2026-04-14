/**
 * AURUM CHEMISTRY KNOWLEDGE BASE
 * Contains all static theoretical data, maps, and safety constants for the Aurum AI Agent.
 */

export const SAFETY_RESTRICTIONS = [
  'thuốc nổ', 'bom', 'chế tạo nổ', 'tnt', 'dynamite', 'nitroglycerin',
  'đầu độc', 'độc hại để giết', 'giết', 'tấn công', 'phát nổ', 'nổ mạnh',
  'làm vũ khí', 'weapon', 'explosive', 'poison'
];

export const PEDAGOGICAL_PROMPTS = [
  'Bạn có muốn thử mô phỏng phản ứng này trong Lab 3D không?',
  'Bạn có biết yếu tố nào ảnh hưởng đến tốc độ của phản ứng này không?',
  'Hãy thử liên hệ chất này với ứng dụng thực tế trong đời sống nhé!',
  'Bạn có muốn xem chất này thuộc nhóm kiến thức nào trong lộ trình hóa học không?',
  'Bạn có muốn so sánh chất này với một chất gần giống để học nhanh hơn không?'
];

export const COMMON_ION_MAP = {
  'H+': { name: 'Ion hiđro', charge: '+1', kind: 'cation' },
  'NH4+': { name: 'Ion amoni', charge: '+1', kind: 'cation' },
  'Na+': { name: 'Ion natri', charge: '+1', kind: 'cation' },
  'K+': { name: 'Ion kali', charge: '+1', kind: 'cation' },
  'Ag+': { name: 'Ion bạc', charge: '+1', kind: 'cation' },
  'Mg2+': { name: 'Ion magie', charge: '+2', kind: 'cation' },
  'Ca2+': { name: 'Ion canxi', charge: '+2', kind: 'cation' },
  'Ba2+': { name: 'Ion bari', charge: '+2', kind: 'cation' },
  'Zn2+': { name: 'Ion kẽm', charge: '+2', kind: 'cation' },
  'Fe2+': { name: 'Ion sắt(II)', charge: '+2', kind: 'cation' },
  'Fe3+': { name: 'Ion sắt(III)', charge: '+3', kind: 'cation' },
  'Cu2+': { name: 'Ion đồng(II)', charge: '+2', kind: 'cation' },
  'Al3+': { name: 'Ion nhôm', charge: '+3', kind: 'cation' },
  'OH-': { name: 'Ion hiđroxit', charge: '-1', kind: 'anion' },
  'Cl-': { name: 'Ion clorua', charge: '-1', kind: 'anion' },
  'Br-': { name: 'Ion bromua', charge: '-1', kind: 'anion' },
  'I-': { name: 'Ion iodua', charge: '-1', kind: 'anion' },
  'NO3-': { name: 'Ion nitrat', charge: '-1', kind: 'anion' },
  'NO2-': { name: 'Ion nitrit', charge: '-1', kind: 'anion' },
  'HCO3-': { name: 'Ion hiđrocacbonat', charge: '-1', kind: 'anion' },
  'HSO4-': { name: 'Ion hiđrosunfat', charge: '-1', kind: 'anion' },
  'MnO4-': { name: 'Ion pemanganat', charge: '-1', kind: 'anion' },
  'CO3 2-': { name: 'Ion cacbonat', charge: '-2', kind: 'anion' },
  'CO32-': { name: 'Ion cacbonat', charge: '-2', kind: 'anion' },
  'SO4 2-': { name: 'Ion sunfat', charge: '-2', kind: 'anion' },
  'SO42-': { name: 'Ion sunfat', charge: '-2', kind: 'anion' },
  'SO3 2-': { name: 'Ion sunfit', charge: '-2', kind: 'anion' },
  'SO32-': { name: 'Ion sunfit', charge: '-2', kind: 'anion' },
  'S2-': { name: 'Ion sunfua', charge: '-2', kind: 'anion' },
  'Cr2O7 2-': { name: 'Ion đicromat', charge: '-2', kind: 'anion' },
  'Cr2O72-': { name: 'Ion đicromat', charge: '-2', kind: 'anion' },
  'PO4 3-': { name: 'Ion photphat', charge: '-3', kind: 'anion' },
  'PO43-': { name: 'Ion photphat', charge: '-3', kind: 'anion' }
};

export const VALENCY_MAP = {
  H: 'I', He: '0', Li: 'I', Be: 'II', B: 'III', C: 'II, IV', N: 'II, III, IV, V', O: 'II', F: 'I',
  Na: 'I', Mg: 'II', Al: 'III', Si: 'IV', P: 'III, V', S: 'II, IV, VI', Cl: 'I, III, V, VII', Ar: '0',
  K: 'I', Ca: 'II', Sc: 'III', Ti: 'II, III, IV', V: 'II, III, IV, V', Cr: 'II, III, VI', Mn: 'II, IV, VII',
  Fe: 'II, III', Co: 'II, III', Ni: 'II, III', Cu: 'I, II', Zn: 'II', Br: 'I, III, V, VII', Ag: 'I',
  Sr: 'II', Sn: 'II, IV', I: 'I, III, V, VII', Ba: 'II', Pb: 'II, IV'
};

export const OXIDATION_STATE_MAP = {
  H: ['+1', '-1 (trong hiđrua kim loại)'],
  O: ['-2', '-1 (trong peoxit)', '+2 (trong OF2)'],
  F: ['-1'],
  Cl: ['-1', '+1', '+3', '+5', '+7'],
  Br: ['-1', '+1', '+3', '+5', '+7'],
  I: ['-1', '+1', '+3', '+5', '+7'],
  S: ['-2', '+4', '+6'],
  N: ['-3', '+1', '+2', '+3', '+4', '+5'],
  P: ['-3', '+3', '+5'],
  C: ['-4', '+2', '+4'],
  Fe: ['+2', '+3'],
  Cu: ['+1', '+2'],
  Mn: ['+2', '+4', '+6', '+7'],
  Cr: ['+2', '+3', '+6']
};

export const CHEMISTRY_KNOWLEDGE_BASE = [
  {
    id: 'atom-structure',
    category: 'Đại cương',
    patterns: ['cấu tạo nguyên tử', 'nguyên tử gồm gì', 'proton neutron electron', 'hạt cơ bản', 'nguyên tử là gì'],
    title: 'Cấu tạo nguyên tử',
    explanation:
      'Nguyên tử gồm **hạt nhân** và **vỏ electron**. Hạt nhân chứa **proton** mang điện dương và **neutron** không mang điện. Electron mang điện âm và chuyển động quanh hạt nhân theo các mức năng lượng. Trong nguyên tử trung hòa: số proton = số electron. **Số hiệu nguyên tử Z = số proton**; **số khối A = proton + neutron**.',
    suggestions: ['Số hiệu nguyên tử là gì?', 'Cấu hình electron', 'Đồng vị là gì?']
  },
  {
    id: 'isotope',
    category: 'Đại cương',
    patterns: ['đồng vị', 'isotope', 'nguyên tử cùng z khác n'],
    title: 'Đồng vị',
    explanation:
      'Đồng vị là các nguyên tử của cùng một nguyên tố có **cùng số proton** nhưng **khác số neutron**, nên khác số khối. Tính chất hóa học của các đồng vị gần như giống nhau vì phụ thuộc chủ yếu vào electron; tính chất vật lý có thể khác nhau.',
    suggestions: ['Nguyên tử khối trung bình', 'Số khối và số hiệu nguyên tử']
  },
  {
    id: 'electron-config',
    category: 'Đại cương',
    patterns: ['cấu hình electron', 'electron hóa trị', 'lớp electron', 'phân bố electron'],
    title: 'Cấu hình electron và electron hóa trị',
    explanation:
      'Electron được phân bố vào các lớp và phân lớp theo mức năng lượng tăng dần. **Electron hóa trị** là các electron ở lớp ngoài cùng, quyết định phần lớn tính chất hóa học của nguyên tố. Dựa vào cấu hình electron có thể suy ra vị trí nguyên tố trong bảng tuần hoàn, khuynh hướng nhường/nhận electron và hóa trị thường gặp.',
    suggestions: ['Bảng tuần hoàn', 'Hóa trị là gì?']
  },
  {
    id: 'periodic-law',
    category: 'Đại cương',
    patterns: ['bảng tuần hoàn', 'định luật tuần hoàn', 'chu kì nhóm', 'periodic table'],
    title: 'Bảng tuần hoàn các nguyên tố hóa học',
    explanation:
      'Bảng tuần hoàn sắp xếp các nguyên tố theo **chiều tăng dần điện tích hạt nhân**. **Chu kì** là hàng ngang, **nhóm** là cột dọc. Các nguyên tố cùng nhóm thường có cấu hình electron lớp ngoài cùng gần giống nhau nên có tính chất hóa học tương tự.',
    suggestions: ['Xu hướng bảng tuần hoàn', 'Kim loại và phi kim']
  },
  {
    id: 'periodic-trends',
    category: 'Đại cương',
    patterns: ['xu hướng bảng tuần hoàn', 'bán kính nguyên tử', 'độ âm điện', 'năng lượng ion hóa'],
    title: 'Một số xu hướng tuần hoàn quan trọng',
    explanation:
      'Trong một chu kì từ trái sang phải, **bán kính nguyên tử thường giảm**, còn **độ âm điện** và **năng lượng ion hóa** thường tăng. Trong một nhóm từ trên xuống, **bán kính nguyên tử tăng**, còn độ âm điện thường giảm. Kim loại mạnh dần khi đi xuống trong nhóm IA; phi kim mạnh thường tăng về phía góc trên bên phải bảng tuần hoàn.',
    suggestions: ['Liên kết hóa học', 'Tính kim loại phi kim']
  },
  {
    id: 'chemical-bonding',
    category: 'Liên kết',
    patterns: ['liên kết hóa học', 'liên kết gì', 'các loại liên kết', 'loại liên kết'],
    title: 'Các loại liên kết hóa học cơ bản',
    formula: '\\text{Cộng hóa trị} \\leftrightarrow \\text{Ion} \\leftrightarrow \\text{Kim loại}',
    explanation:
      'Ba loại thường gặp là: **liên kết ion** (kim loại + phi kim, do cho nhận electron), **liên kết cộng hóa trị** (thường giữa các phi kim, do dùng chung electron) và **liên kết kim loại** (mạng ion dương trong “biển electron” tự do). Ngoài ra còn có **liên kết hiđro** và **tương tác Van der Waals** ở mức liên phân tử.',
    suggestions: ['Liên kết ion', 'Liên kết cộng hóa trị', 'Liên kết hiđro']
  },
  {
    id: 'ionic-bond',
    category: 'Liên kết',
    patterns: ['liên kết ion', 'ion bond'],
    title: 'Liên kết ion',
    explanation:
      'Liên kết ion hình thành khi một nguyên tử nhường electron và nguyên tử khác nhận electron, tạo nên lực hút tĩnh điện giữa cation và anion. Hợp chất ion thường có nhiệt độ nóng chảy cao, dẫn điện khi nóng chảy hoặc khi tan trong nước.',
    suggestions: ['Liên kết cộng hóa trị', 'Chất điện li là gì?']
  },
  {
    id: 'covalent-bond',
    category: 'Liên kết',
    patterns: ['liên kết cộng hóa trị', 'covalent', 'dùng chung electron'],
    title: 'Liên kết cộng hóa trị',
    explanation:
      'Liên kết cộng hóa trị được tạo bởi một hay nhiều cặp electron dùng chung giữa các nguyên tử. Có thể là **không cực** hoặc **có cực** tùy theo chênh lệch độ âm điện. Nhiều chất cộng hóa trị tồn tại dưới dạng phân tử, ít dẫn điện ở trạng thái thường.',
    suggestions: ['Phân cực liên kết', 'Liên kết ion']
  },
  {
    id: 'metallic-bond',
    category: 'Liên kết',
    patterns: ['liên kết kim loại', 'kim loại dẫn điện vì sao'],
    title: 'Liên kết kim loại',
    explanation:
      'Trong tinh thể kim loại, các ion dương nằm ở nút mạng còn electron hóa trị chuyển động tương đối tự do tạo thành “biển electron”. Điều này giải thích tính dẻo, dẫn điện, dẫn nhiệt và ánh kim của kim loại.',
    suggestions: ['Dãy hoạt động hóa học của kim loại']
  },
  {
    id: 'mole-concept',
    category: 'Mol và định lượng',
    patterns: ['mol là gì', 'khái niệm mol', 'số avogadro'],
    title: 'Khái niệm mol',
    explanation:
      'Mol là lượng chất chứa **6,022 × 10^23** hạt vi mô như nguyên tử, phân tử, ion. Mol là cầu nối giữa thế giới vi mô và đại lượng đo được trong thí nghiệm như khối lượng, thể tích, nồng độ.',
    suggestions: ['n = m/M', 'Khối lượng mol', 'Mol theo thể tích khí']
  },
  {
    id: 'molar-mass',
    category: 'Mol và định lượng',
    patterns: ['khối lượng mol', 'molar mass', 'm là gì'],
    title: 'Khối lượng mol',
    explanation:
      'Khối lượng mol **M** là khối lượng của 1 mol chất, đơn vị thường dùng là g/mol. Về số trị, khối lượng mol của một chất bằng tổng nguyên tử khối của các nguyên tử trong công thức hóa học của chất đó.',
    suggestions: ['n = m/M', 'Tính phân tử khối']
  },
  {
    id: 'mol-mass',
    category: 'Mol và định lượng',
    patterns: ['mol theo khối lượng', 'n = m/m', 'n=m/m', 'mol từ m', 'tính số mol theo khối lượng'],
    title: 'Công thức tính số mol theo khối lượng',
    formula: 'n = \\frac{m}{M}',
    explanation:
      'Trong đó: **n** là số mol, **m** là khối lượng chất tính bằng gam, **M** là khối lượng mol tính bằng g/mol. Đây là công thức cơ bản nhất trong bài toán hóa học định lượng.',
    suggestions: ['Mol theo thể tích khí', 'Nồng độ mol']
  },
  {
    id: 'mol-particles',
    category: 'Mol và định lượng',
    patterns: ['mol theo số hạt', 'n=n/na', 'số hạt avogadro', 'tính mol theo số phân tử'],
    title: 'Công thức tính số mol theo số hạt',
    formula: 'n = \\frac{N}{N_A}',
    explanation:
      'Trong đó **N** là số hạt vi mô và **N_A = 6,022 \\times 10^{23}** hạt/mol. Công thức này dùng khi đề cho số nguyên tử, phân tử hoặc ion.',
    suggestions: ['Mol là gì?', 'Khối lượng mol']
  },
  {
    id: 'mol-vol',
    category: 'Mol và định lượng',
    patterns: ['mol theo thể tích', 'đktc', 'v/22.4', 'mol khí', 'tính mol khí'],
    title: 'Công thức tính số mol chất khí ở điều kiện tiêu chuẩn thường dùng',
    formula: 'n = \\frac{V}{22,4}',
    explanation:
      'Trong nhiều bài học phổ thông, ở **đktc** người ta thường dùng thể tích mol khí là **22,4 lít/mol**. Khi đó số mol khí được tính bằng thể tích khí chia cho 22,4.',
    suggestions: ['Phương trình khí lí tưởng', 'Tỉ khối chất khí']
  },
  {
    id: 'ideal-gas',
    category: 'Chất khí',
    patterns: ['phương trình khí lý tưởng', 'pv=nrt', 'khí lý tưởng', 'khí lí tưởng'],
    title: 'Phương trình khí lí tưởng',
    formula: 'PV = nRT',
    explanation:
      'Phương trình liên hệ áp suất **P**, thể tích **V**, số mol **n**, hằng số khí **R** và nhiệt độ tuyệt đối **T**. Khi làm bài cần thống nhất hệ đơn vị. Đây là công thức tổng quát hơn so với dùng 22,4 lít/mol.',
    suggestions: ['Định luật Boyle', 'Định luật Charles']
  },
  {
    id: 'boyle-law',
    category: 'Chất khí',
    patterns: ['định luật boyle', 'boyle mariotte', 'p1v1=p2v2'],
    title: 'Định luật Boyle – Mariotte',
    formula: 'P_1V_1 = P_2V_2',
    explanation:
      'Ở nhiệt độ không đổi, thể tích của một lượng khí xác định tỉ lệ nghịch với áp suất. Khi áp suất tăng thì thể tích giảm và ngược lại.',
    suggestions: ['Định luật Charles', 'PV=nRT']
  },
  {
    id: 'charles-law',
    category: 'Chất khí',
    patterns: ['định luật charles', 'v/t', 'v1/t1=v2/t2'],
    title: 'Định luật Charles',
    formula: '\\frac{V_1}{T_1} = \\frac{V_2}{T_2}',
    explanation:
      'Ở áp suất không đổi, thể tích của một lượng khí xác định tỉ lệ thuận với nhiệt độ tuyệt đối. Nhiệt độ trong công thức phải đổi sang Kelvin.',
    suggestions: ['Nhiệt độ tuyệt đối là gì?', 'PV=nRT']
  },
  {
    id: 'density-gas',
    category: 'Chất khí',
    patterns: ['tỉ khối chất khí', 'd khí', 'so với h2', 'so với không khí'],
    title: 'Tỉ khối chất khí',
    explanation:
      'Tỉ khối của khí A đối với khí B bằng tỉ số khối lượng mol: **d(A/B) = M_A / M_B**. Một số dạng quen thuộc: **d(A/H2) = M_A / 2** và **d(A/kk) = M_A / 29** nếu lấy khối lượng mol trung bình của không khí xấp xỉ 29 g/mol.',
    suggestions: ['Khối lượng mol', 'PV=nRT']
  },
  {
    id: 'solution-basic',
    category: 'Dung dịch',
    patterns: ['dung dịch là gì', 'chất tan dung môi', 'solution là gì'],
    title: 'Dung dịch và các khái niệm cơ bản',
    explanation:
      'Dung dịch gồm **chất tan** và **dung môi**. Nếu chất tan phân bố đều ở mức phân tử/ion trong dung môi thì thu được hệ đồng nhất. Nước là dung môi rất thông dụng vì có khả năng hòa tan nhiều chất phân cực và chất điện li.',
    suggestions: ['Nồng độ mol', 'Nồng độ phần trăm', 'Pha loãng dung dịch']
  },
  {
    id: 'molar-conc',
    category: 'Dung dịch',
    patterns: ['nồng độ mol', 'cm', 'mol/l', 'molar concentration'],
    title: 'Công thức tính nồng độ mol',
    formula: 'C_M = \\frac{n}{V}',
    explanation:
      'Trong đó **C_M** là nồng độ mol (mol/L), **n** là số mol chất tan, **V** là thể tích dung dịch tính bằng lít. Đây là đại lượng quan trọng trong bài toán pha chế và phản ứng trong dung dịch.',
    suggestions: ['Pha loãng dung dịch', 'Nồng độ phần trăm']
  },
  {
    id: 'percent-conc',
    category: 'Dung dịch',
    patterns: ['nồng độ phần trăm', 'c%', 'percent concentration'],
    title: 'Công thức tính nồng độ phần trăm',
    formula: 'C\\% = \\frac{m_{ct}}{m_{dd}} \\times 100\\%',
    explanation:
      'Trong đó **m_ct** là khối lượng chất tan, **m_dd** là khối lượng dung dịch. Nồng độ phần trăm biểu diễn số gam chất tan trong 100 gam dung dịch.',
    suggestions: ['Nồng độ mol', 'Khối lượng dung dịch']
  },
  {
    id: 'dilution',
    category: 'Dung dịch',
    patterns: ['pha loãng', 'dilution', 'c1v1=c2v2'],
    title: 'Pha loãng dung dịch',
    formula: 'C_1V_1 = C_2V_2',
    explanation:
      'Khi pha loãng mà lượng chất tan không đổi, số mol chất tan trước và sau pha loãng bằng nhau nên có công thức **C1V1 = C2V2**. Công thức này chỉ đúng khi cùng nói về nồng độ mol của cùng một chất tan.',
    suggestions: ['Nồng độ mol', 'Dung dịch là gì?']
  },
  {
    id: 'solubility',
    category: 'Dung dịch',
    patterns: ['độ tan', 'solubility', 'bão hòa', 'dung dịch bão hòa'],
    title: 'Độ tan và dung dịch bão hòa',
    explanation:
      'Độ tan cho biết lượng chất tan tối đa có thể hòa tan trong một lượng dung môi xác định ở nhiệt độ xác định. Dung dịch chứa lượng chất tan tối đa gọi là **dung dịch bão hòa**; nếu chứa ít hơn là **chưa bão hòa**.',
    suggestions: ['Kết tinh', 'Ảnh hưởng của nhiệt độ đến độ tan']
  },
  {
    id: 'electrolyte',
    category: 'Dung dịch',
    patterns: ['chất điện li', 'điện li là gì', 'acid base salt in water'],
    title: 'Chất điện li và không điện li',
    explanation:
      'Chất điện li là chất khi tan trong nước hoặc nóng chảy tạo ra ion nên có khả năng dẫn điện. Axit, bazơ, muối thường là chất điện li; nhiều hợp chất cộng hóa trị như đường, ancol không điện li hoặc điện li rất yếu.',
    suggestions: ['Axit là gì?', 'Bazơ là gì?', 'pH là gì?']
  },
  {
    id: 'acid-definition',
    category: 'Axit – bazơ – muối',
    patterns: ['axit là gì', 'acid là gì', 'định nghĩa axit'],
    title: 'Axit',
    explanation:
      'Theo Arrhenius, axit là chất khi tan trong nước phân li tạo **H+**. Theo Brønsted–Lowry, axit là chất **cho proton**. Axit thường làm quỳ tím hóa đỏ, phản ứng với bazơ tạo muối và nước, và một số axit phản ứng với kim loại giải phóng hiđro.',
    suggestions: ['Bazơ là gì?', 'Phản ứng trung hòa', 'pH là gì?']
  },
  {
    id: 'base-definition',
    category: 'Axit – bazơ – muối',
    patterns: ['bazơ là gì', 'base là gì', 'định nghĩa bazơ', 'kiềm là gì'],
    title: 'Bazơ và kiềm',
    explanation:
      'Theo Arrhenius, bazơ là chất khi tan trong nước phân li tạo **OH-**. Theo Brønsted–Lowry, bazơ là chất **nhận proton**. Bazơ tan trong nước gọi là **kiềm**. Dung dịch bazơ thường làm quỳ tím hóa xanh và phenolphtalein hóa hồng.',
    suggestions: ['Axit là gì?', 'Phản ứng trung hòa']
  },
  {
    id: 'salt-definition',
    category: 'Axit – bazơ – muối',
    patterns: ['muối là gì', 'salt là gì', 'định nghĩa muối'],
    title: 'Muối',
    explanation:
      'Muối là hợp chất ion gồm cation kim loại hoặc amoni và anion gốc axit. Muối có thể được tạo thành từ phản ứng giữa axit và bazơ, giữa kim loại và axit, hoặc qua nhiều phản ứng trao đổi trong dung dịch.',
    suggestions: ['Phản ứng trao đổi', 'Muối axit và muối trung hòa']
  },
  {
    id: 'oxide-classification',
    category: 'Axit – bazơ – muối',
    patterns: ['oxit là gì', 'phân loại oxit', 'oxide'],
    title: 'Phân loại oxit',
    explanation:
      'Oxit là hợp chất của oxi với một nguyên tố khác. Có thể chia thành **oxit bazơ**, **oxit axit**, **oxit lưỡng tính** và **oxit trung tính**. Ví dụ: Na2O là oxit bazơ, SO3 là oxit axit, Al2O3 là oxit lưỡng tính, CO là oxit trung tính.',
    suggestions: ['Axit bazơ muối', 'Phản ứng oxit với nước']
  },
  {
    id: 'neutralization',
    category: 'Axit – bazơ – muối',
    patterns: ['trung hòa', 'phản ứng trung hòa', 'neutralization'],
    title: 'Phản ứng trung hòa',
    formula: 'H^+ + OH^- \rightarrow H_2O',
    explanation:
      'Phản ứng trung hòa là phản ứng giữa axit và bazơ tạo thành muối và nước. Ở mức ion rút gọn, bản chất của phản ứng là ion **H+** kết hợp với ion **OH-** tạo thành nước.',
    suggestions: ['Axit là gì?', 'Bazơ là gì?', 'pH là gì?']
  },
  {
    id: 'ph-scale',
    category: 'Axit – bazơ – muối',
    patterns: ['ph là gì', 'thang ph', 'môi trường axit bazơ', 'poh'],
    title: 'pH và môi trường dung dịch',
    formula: 'pH = -\\log[H^+]',
    explanation:
      'pH dùng để biểu thị độ axit – bazơ của dung dịch. Dung dịch có **pH < 7** thường là môi trường axit, **pH = 7** gần trung tính, **pH > 7** là môi trường bazơ ở điều kiện thường dùng trong chương trình học. Với nước tinh khiết ở 25°C: **pH + pOH = 14**.',
    suggestions: ['Axit mạnh và yếu', 'Bazơ mạnh và yếu']
  },
  {
    id: 'strong-weak-acid-base',
    category: 'Axit – bazơ – muối',
    patterns: ['axit mạnh axit yếu', 'bazơ mạnh bazơ yếu', 'điện li mạnh yếu'],
    title: 'Axit mạnh/yếu và bazơ mạnh/yếu',
    explanation:
      'Axit mạnh và bazơ mạnh phân li gần như hoàn toàn trong nước; axit yếu và bazơ yếu chỉ phân li một phần. Cần phân biệt **độ mạnh** với **nồng độ**: một axit yếu vẫn có thể có dung dịch đậm đặc, còn axit mạnh có thể ở nồng độ thấp.',
    suggestions: ['pH là gì?', 'Chất điện li']
  },
  {
    id: 'precipitation',
    category: 'Phản ứng hóa học',
    patterns: ['kết tủa', 'precipitation', 'phản ứng kết tủa'],
    title: 'Phản ứng kết tủa',
    explanation:
      'Phản ứng kết tủa xảy ra khi hai dung dịch chất điện li phản ứng với nhau tạo thành chất rắn không tan. Ví dụ quen thuộc là **AgNO3 + NaCl → AgCl↓ + NaNO3**. Việc nhận biết chất kết tủa dựa vào quy tắc tính tan là rất quan trọng.',
    suggestions: ['Bảng tính tan', 'Phản ứng trao đổi']
  },
  {
    id: 'gas-evolution',
    category: 'Phản ứng hóa học',
    patterns: ['phản ứng tạo khí', 'giải phóng khí', 'thoát khí'],
    title: 'Phản ứng tạo chất khí',
    explanation:
      'Một số phản ứng trong dung dịch tạo ra chất khí như CO2, SO2, H2S, NH3 hoặc H2. Ví dụ: muối cacbonat tác dụng với axit tạo CO2; kim loại tác dụng với axit loãng thường tạo H2; muối amoni với bazơ mạnh có thể giải phóng NH3.',
    suggestions: ['Kim loại + axit', 'Muối cacbonat']
  },
  {
    id: 'reaction-classification',
    category: 'Phản ứng hóa học',
    patterns: ['phân loại phản ứng', 'các loại phản ứng', 'reaction types'],
    title: 'Một số kiểu phản ứng hóa học thường gặp',
    explanation:
      'Các kiểu phản ứng cơ bản gồm: **hóa hợp**, **phân hủy**, **thế**, **trao đổi**, **trung hòa**, **cháy**, **oxi hóa – khử**, **kết tủa**, **tạo khí**. Một phản ứng thực tế có thể đồng thời thuộc nhiều nhóm nếu xét theo tiêu chí khác nhau.',
    suggestions: ['Phản ứng oxi hóa khử', 'Phản ứng trao đổi']
  },
  {
    id: 'reaction-rate',
    category: 'Động hóa học',
    patterns: ['tốc độ phản ứng', 'yếu tố ảnh hưởng tốc độ phản ứng', 'reaction rate'],
    title: 'Tốc độ phản ứng và các yếu tố ảnh hưởng',
    explanation:
      'Tốc độ phản ứng cho biết mức độ nhanh chậm của phản ứng. Các yếu tố ảnh hưởng chính gồm **nồng độ**, **nhiệt độ**, **diện tích bề mặt chất rắn**, **áp suất** với chất khí và **chất xúc tác**. Tăng nhiệt độ thường làm tăng tốc độ phản ứng.',
    suggestions: ['Xúc tác là gì?', 'Cân bằng hóa học']
  },
  {
    id: 'catalyst',
    category: 'Động hóa học',
    patterns: ['xúc tác', 'catalyst', 'chất xúc tác là gì'],
    title: 'Chất xúc tác',
    explanation:
      'Chất xúc tác làm tăng tốc độ phản ứng bằng cách tạo cơ chế phản ứng có năng lượng hoạt hóa thấp hơn nhưng **không làm thay đổi vị trí cân bằng cuối cùng** và không bị tiêu hao hoàn toàn sau phản ứng.',
    suggestions: ['Tốc độ phản ứng', 'Cân bằng hóa học']
  },
  {
    id: 'chemical-equilibrium',
    category: 'Cân bằng hóa học',
    patterns: ['cân bằng hóa học', 'equilibrium', 'phản ứng thuận nghịch'],
    title: 'Cân bằng hóa học',
    explanation:
      'Cân bằng hóa học là trạng thái của phản ứng thuận nghịch khi tốc độ phản ứng thuận bằng tốc độ phản ứng nghịch. Ở trạng thái cân bằng, nồng độ các chất không đổi theo thời gian nhưng phản ứng vẫn diễn ra ở mức vi mô.',
    suggestions: ['Le Chatelier', 'Hằng số cân bằng']
  },
  {
    id: 'le-chatelier',
    category: 'Cân bằng hóa học',
    patterns: ['le chatelier', 'dịch chuyển cân bằng', 'nguyên lý chuyển dịch cân bằng'],
    title: 'Nguyên lý Le Chatelier',
    explanation:
      'Khi hệ cân bằng chịu tác động từ bên ngoài như thay đổi nồng độ, nhiệt độ hoặc áp suất, cân bằng sẽ chuyển dịch theo chiều làm giảm tác động đó. Nguyên lý này giúp dự đoán chiều chuyển dịch của hệ cân bằng.',
    suggestions: ['Cân bằng hóa học', 'Tốc độ phản ứng']
  },
  {
    id: 'enthalpy',
    category: 'Nhiệt hóa học',
    patterns: ['nhiệt phản ứng', 'entanpi', 'enthalpy', 'delta h'],
    title: 'Hiệu ứng nhiệt của phản ứng',
    formula: '\\Delta H = H_{sp} - H_{tp}',
    explanation:
      'Nếu **ΔH < 0**, phản ứng tỏa nhiệt; nếu **ΔH > 0**, phản ứng thu nhiệt. Nhiệt hóa học giúp giải thích vì sao một số phản ứng tự làm nóng môi trường, còn một số phản ứng cần hấp thụ nhiệt để xảy ra.',
    suggestions: ['Phản ứng tỏa nhiệt', 'Định luật Hess']
  },
  {
    id: 'hess-law',
    category: 'Nhiệt hóa học',
    patterns: ['định luật hess', 'hess law'],
    title: 'Định luật Hess',
    explanation:
      'Biến thiên entanpi của phản ứng chỉ phụ thuộc vào trạng thái đầu và trạng thái cuối, không phụ thuộc vào con đường thực hiện phản ứng. Vì vậy có thể cộng trừ các phương trình nhiệt hóa học để tính ΔH của phản ứng cần tìm.',
    suggestions: ['Hiệu ứng nhiệt', 'Chu trình Born-Haber']
  },
  {
    id: 'redox',
    category: 'Oxi hóa – khử',
    patterns: ['oxi hóa khử', 'redox', 'số oxi hóa', 'chất oxi hóa là gì', 'chất khử là gì'],
    title: 'Phản ứng oxi hóa – khử',
    explanation:
      'Phản ứng oxi hóa – khử là phản ứng có sự **thay đổi số oxi hóa** của các nguyên tố. **Chất oxi hóa** là chất nhận electron, còn **chất khử** là chất nhường electron. Quá trình oxi hóa là nhường electron; quá trình khử là nhận electron.',
    suggestions: ['Số oxi hóa', 'Cân bằng phản ứng oxi hóa khử']
  },
  {
    id: 'oxidation-number',
    category: 'Oxi hóa – khử',
    patterns: ['số oxi hóa', 'oxidation number', 'quy tắc số oxi hóa'],
    title: 'Số oxi hóa và quy tắc cơ bản',
    explanation:
      'Số oxi hóa là điện tích giả định của nguyên tử trong hợp chất nếu xem electron liên kết thuộc hoàn toàn về nguyên tử có độ âm điện lớn hơn. Một số quy tắc thường dùng: đơn chất có số oxi hóa bằng 0; tổng số oxi hóa trong phân tử trung hòa bằng 0; tổng số oxi hóa trong ion bằng điện tích của ion.',
    suggestions: ['Oxi hóa khử', 'Chất oxi hóa chất khử']
  },
  {
    id: 'electrochemistry',
    category: 'Điện hóa',
    patterns: ['điện hóa', 'pin điện hóa', 'galvani', 'điện cực'],
    title: 'Điện hóa học cơ bản',
    explanation:
      'Điện hóa học nghiên cứu mối liên hệ giữa phản ứng oxi hóa – khử và dòng điện. Trong **pin điện hóa**, phản ứng hóa học tự diễn ra để tạo dòng điện. Trong **điện phân**, dòng điện được dùng để ép phản ứng oxi hóa – khử xảy ra theo chiều không tự diễn ra.',
    suggestions: ['Điện phân', 'Pin Daniell']
  },
  {
    id: 'electrolysis',
    category: 'Điện hóa',
    patterns: ['điện phân', 'electrolysis', 'catot anot'],
    title: 'Điện phân',
    explanation:
      'Trong điện phân, **catot** là nơi xảy ra quá trình **khử**, **anot** là nơi xảy ra quá trình **oxi hóa**. Khi điện phân dung dịch, việc ưu tiên ion nào bị điện phân còn phụ thuộc vào bản chất ion và điện cực.',
    suggestions: ['Điện hóa học', 'Oxi hóa khử']
  },
  {
    id: 'metal-activity-series',
    category: 'Kim loại',
    patterns: ['dãy hoạt động hóa học kim loại', 'dãy điện hóa kim loại', 'kim loại mạnh yếu'],
    title: 'Dãy hoạt động hóa học của kim loại',
    explanation:
      'Dãy hoạt động hóa học cho biết mức độ dễ nhường electron của kim loại. Kim loại hoạt động mạnh có thể đẩy kim loại yếu hơn ra khỏi dung dịch muối của nó; nhiều kim loại đứng trước H có thể phản ứng với axit loãng giải phóng H2.',
    suggestions: ['Kim loại tác dụng với axit', 'Điện hóa học']
  },
  {
    id: 'metal-properties',
    category: 'Kim loại',
    patterns: ['tính chất kim loại', 'kim loại có tính chất gì'],
    title: 'Tính chất vật lý và hóa học chung của kim loại',
    explanation:
      'Kim loại thường có ánh kim, dẫn điện, dẫn nhiệt, tính dẻo. Về hóa học, kim loại có xu hướng **nhường electron** nên thể hiện tính khử. Kim loại có thể tác dụng với phi kim, với nước hoặc dung dịch axit tùy vào mức độ hoạt động hóa học.',
    suggestions: ['Dãy hoạt động hóa học', 'Ăn mòn kim loại']
  },
  {
    id: 'corrosion',
    category: 'Kim loại',
    patterns: ['ăn mòn kim loại', 'gỉ sắt', 'corrosion'],
    title: 'Ăn mòn kim loại',
    explanation:
      'Ăn mòn kim loại là quá trình phá hủy kim loại do tác dụng của môi trường. Có hai dạng chính là **ăn mòn hóa học** và **ăn mòn điện hóa**. Chống ăn mòn có thể bằng sơn phủ, mạ kim loại, bảo vệ điện hóa hoặc dùng hợp kim bền hơn.',
    suggestions: ['Điện hóa học', 'Kim loại']
  },
  {
    id: 'nonmetal-properties',
    category: 'Phi kim',
    patterns: ['tính chất phi kim', 'phi kim có tính chất gì'],
    title: 'Tính chất chung của phi kim',
    explanation:
      'Phi kim thường có xu hướng **nhận electron** hoặc dùng chung electron trong liên kết cộng hóa trị. Nhiều phi kim là chất oxi hóa, có thể phản ứng với kim loại tạo muối hoặc oxit; oxit của phi kim nhiều trường hợp là oxit axit.',
    suggestions: ['Liên kết cộng hóa trị', 'Oxit axit']
  },
  {
    id: 'halogen',
    category: 'Phi kim',
    patterns: ['halogen', 'nhóm halogen', 'clo brom iot flo'],
    title: 'Nhóm halogen',
    explanation:
      'Halogen gồm F, Cl, Br, I... là các phi kim mạnh, thường có số oxi hóa -1 trong hợp chất. Chúng có khả năng oxi hóa khá mạnh, phản ứng với kim loại tạo muối halogenua và với hiđro tạo hiđro halogenua.',
    suggestions: ['Axit HCl', 'Số oxi hóa']
  },
  {
    id: 'oxygen-sulfur',
    category: 'Phi kim',
    patterns: ['oxi và lưu huỳnh', 'nhóm oxi lưu huỳnh', 'nhóm via'],
    title: 'Nhóm oxi – lưu huỳnh',
    explanation:
      'Oxi là phi kim hoạt động mạnh, tham gia nhiều phản ứng cháy và oxi hóa. Lưu huỳnh có thể vừa thể hiện tính oxi hóa vừa thể hiện tính khử, có nhiều số oxi hóa khác nhau như -2, +4, +6.',
    suggestions: ['Oxi hóa khử', 'SO2 và SO3']
  },
  {
    id: 'nitrogen-phosphorus',
    category: 'Phi kim',
    patterns: ['nitơ photpho', 'nhóm nitơ', 'nhóm va'],
    title: 'Nhóm nitơ – photpho',
    explanation:
      'Nitơ khá trơ ở điều kiện thường do liên kết ba bền trong N2, nhưng nhiều hợp chất của nitơ rất quan trọng như NH3, HNO3, muối nitrat. Photpho có dạng trắng và đỏ, tham gia nhiều phản ứng oxi hóa – khử và tạo axit photphoric cùng các muối photphat.',
    suggestions: ['Amoniac', 'Axit nitric', 'Photphat']
  },
  {
    id: 'organic-overview',
    category: 'Hữu cơ',
    patterns: ['hóa hữu cơ là gì', 'organic chemistry', 'hợp chất hữu cơ'],
    title: 'Khái quát về hóa học hữu cơ',
    explanation:
      'Hóa hữu cơ nghiên cứu các hợp chất của cacbon, ngoại trừ một số hợp chất đơn giản như CO, CO2, H2CO3, muối cacbonat, xianua kim loại... Hợp chất hữu cơ thường có liên kết cộng hóa trị, đa dạng về cấu trúc và phản ứng.',
    suggestions: ['Hiđrocacbon', 'Nhóm chức', 'Đồng phân']
  },
  {
    id: 'hydrocarbon',
    category: 'Hữu cơ',
    patterns: ['hiđrocacbon', 'hydrocarbon', 'hợp chất chỉ có c và h'],
    title: 'Hiđrocacbon',
    explanation:
      'Hiđrocacbon là hợp chất hữu cơ chỉ chứa cacbon và hiđro. Gồm các nhóm lớn như **ankan**, **anken**, **ankin**, **aren**. Tính chất hóa học phụ thuộc vào loại liên kết trong phân tử: no, không no hay thơm.',
    suggestions: ['Ankan', 'Anken', 'Ankin', 'Benzen']
  },
  {
    id: 'alkane',
    category: 'Hữu cơ',
    patterns: ['ankan', 'alkane', 'công thức ankan'],
    title: 'Ankan',
    formula: 'C_nH_{2n+2}',
    explanation:
      'Ankan là hiđrocacbon no mạch hở, chỉ chứa liên kết đơn C–C và C–H. Phản ứng đặc trưng thường gặp là **phản ứng thế** với halogen và **phản ứng cháy**.',
    suggestions: ['Anken', 'Đồng phân mạch cacbon']
  },
  {
    id: 'alkene',
    category: 'Hữu cơ',
    patterns: ['anken', 'alkene', 'công thức anken'],
    title: 'Anken',
    formula: 'C_nH_{2n}',
    explanation:
      'Anken là hiđrocacbon không no có một liên kết đôi C=C. Phản ứng đặc trưng là **phản ứng cộng** như cộng H2, Br2, HX và phản ứng trùng hợp đối với một số monome phù hợp.',
    suggestions: ['Ankin', 'Phản ứng cộng']
  },
  {
    id: 'alkyne',
    category: 'Hữu cơ',
    patterns: ['ankin', 'alkyne', 'công thức ankin'],
    title: 'Ankin',
    formula: 'C_nH_{2n-2}',
    explanation:
      'Ankin là hiđrocacbon không no có một liên kết ba C≡C. Chúng có thể tham gia phản ứng cộng tương tự anken; một số ankin đầu mạch còn thể hiện tính axit rất yếu.',
    suggestions: ['Anken', 'Axetilen']
  },
  {
    id: 'benzene',
    category: 'Hữu cơ',
    patterns: ['benzen', 'benzene', 'aren'],
    title: 'Benzen và hiđrocacbon thơm',
    explanation:
      'Benzen là đại diện quan trọng của hiđrocacbon thơm. Do hệ electron π liên hợp bền, benzen ưu tiên tham gia **pháº£n ứng thế** hơn là phản ứng cộng. Benzen là nguyên liệu nền của nhiều hợp chất hữu cơ công nghiệp.',
    suggestions: ['Ankan', 'Anken', 'Phenol']
  },
  {
    id: 'functional-group',
    category: 'Hữu cơ',
    patterns: ['nhóm chức', 'functional group'],
    title: 'Nhóm chức',
    explanation:
      'Nhóm chức là nhóm nguyên tử quyết định tính chất hóa học đặc trưng của hợp chất hữu cơ. Ví dụ: **–OH** của ancol, **–CHO** của andehit, **>C=O** của xeton, **–COOH** của axit cacboxylic, **–COO–** của este.',
    suggestions: ['Ancol', 'Axit cacboxylic', 'Este']
  },
  {
    id: 'alcohol',
    category: 'Hữu cơ',
    patterns: ['ancol', 'alcohol', 'etanol'],
    title: 'Ancol',
    explanation:
      'Ancol là hợp chất hữu cơ có nhóm **–OH** liên kết trực tiếp với nguyên tử cacbon no. Ancol có thể tham gia phản ứng với kim loại kiềm, phản ứng tách nước, oxi hóa và phản ứng cháy.',
    suggestions: ['Phenol', 'Este hóa']
  },
  {
    id: 'phenol',
    category: 'Hữu cơ',
    patterns: ['phenol', 'phenol là gì'],
    title: 'Phenol',
    explanation:
      'Phenol có nhóm –OH gắn trực tiếp vào vòng benzen. Do ảnh hưởng của vòng thơm, phenol thể hiện tính axit mạnh hơn ancol thông thường và có thể phản ứng với dung dịch bazơ mạnh.',
    suggestions: ['Ancol', 'Benzen']
  },
  {
    id: 'aldehyde-ketone',
    category: 'Hữu cơ',
    patterns: ['andehit', 'xeton', 'aldehyde', 'ketone'],
    title: 'Andehit và xeton',
    explanation:
      'Andehit chứa nhóm **–CHO**, còn xeton chứa nhóm **>C=O** nằm giữa mạch cacbon. Andehit dễ bị oxi hóa hơn xeton; một số phản ứng nhận biết andehit gồm phản ứng tráng bạc và phản ứng với Cu(OH)2 trong môi trường kiềm, đun nóng.',
    suggestions: ['Axit cacboxylic', 'Ancol']
  },
  {
    id: 'carboxylic-acid',
    category: 'Hữu cơ',
    patterns: ['axit cacboxylic', 'carboxylic acid', 'cooh'],
    title: 'Axit cacboxylic',
    explanation:
      'Axit cacboxylic chứa nhóm chức **–COOH**. Chúng thể hiện tính axit, phản ứng với bazơ, oxit bazơ, muối cacbonat và có thể tham gia phản ứng este hóa với ancol.',
    suggestions: ['Este', 'Ancol', 'Phản ứng este hóa']
  },
  {
    id: 'ester',
    category: 'Hữu cơ',
    patterns: ['este', 'ester', 'este hóa'],
    title: 'Este',
    explanation:
      'Este thường được tạo thành từ phản ứng giữa axit cacboxylic và ancol. Nhiều este có mùi thơm đặc trưng. Phản ứng quan trọng của este là **thủy phân** trong môi trường axit hoặc bazơ; trong môi trường bazơ phản ứng còn gọi là **xà phòng hóa**.',
    suggestions: ['Axit cacboxylic', 'Lipit', 'Xà phòng hóa']
  },
  {
    id: 'lipid',
    category: 'Hữu cơ',
    patterns: ['lipit', 'lipid', 'chất béo'],
    title: 'Lipit và chất béo',
    explanation:
      'Chất béo là trieste của glixerol với axit béo. Chúng không tan trong nước, nhẹ hơn nước và là nguồn dự trữ năng lượng quan trọng. Phản ứng đặc trưng là thủy phân/xà phòng hóa.',
    suggestions: ['Este', 'Glixerol']
  },
  {
    id: 'carbohydrate',
    category: 'Hữu cơ',
    patterns: ['cacbohidrat', 'glucozo', 'saccarozo', 'tinh bột', 'cellulose'],
    title: 'Cacbohiđrat',
    explanation:
      'Cacbohiđrat gồm các nhóm lớn như **monosaccarit** (glucozơ, fructozơ), **đisaccarit** (saccarozơ) và **polisaccarit** (tinh bột, xenlulozơ). Đây là nhóm chất hữu cơ quan trọng trong sinh học và công nghiệp thực phẩm.',
    suggestions: ['Glucozơ', 'Tinh bột', 'Xenlulozơ']
  },
  {
    id: 'amine-amino-acid-protein',
    category: 'Hữu cơ',
    patterns: ['amin', 'amino axit', 'protein', 'peptit'],
    title: 'Amin, amino axit, peptit và protein',
    explanation:
      'Amin là dẫn xuất của amoniac khi một hay nhiều H bị thay bằng gốc hiđrocacbon. Amino axit vừa có nhóm **–NH2** vừa có nhóm **–COOH** trong phân tử. Peptit và protein được tạo bởi các gốc amino axit liên kết với nhau qua **liên kết peptit**.',
    suggestions: ['Axit bazơ', 'Nhóm chức']
  },
  {
    id: 'polymer',
    category: 'Hữu cơ',
    patterns: ['polime', 'polymer', 'trùng hợp', 'trùng ngưng'],
    title: 'Polime',
    explanation:
      'Polime là hợp chất có phân tử khối rất lớn do nhiều mắt xích liên kết với nhau tạo thành. Có hai hướng tạo polime thường gặp là **trùng hợp** và **trùng ngưng**. Nhiều vật liệu quen thuộc như PE, PVC, nilon đều là polime.',
    suggestions: ['Anken', 'Vật liệu polime']
  },
  {
    id: 'lab-safety',
    category: 'An toàn',
    patterns: ['an toàn phòng thí nghiệm', 'lab safety', 'quy tắc an toàn hóa học'],
    title: 'Nguyên tắc an toàn trong phòng thí nghiệm hóa học',
    explanation:
      'Luôn đeo kính, găng tay và áo choàng phù hợp; đọc nhãn hóa chất trước khi dùng; không nếm hay ngửi trực tiếp hóa chất; thêm axit vào nước khi pha loãng, không làm ngược lại; dùng tủ hút với chất bay hơi độc; thu gom chất thải đúng quy định; và xử lý sự cố theo quy trình an toàn của phòng thí nghiệm.',
    suggestions: ['Kí hiệu cảnh báo hóa chất', 'Xử lý tràn đổ hóa chất']
  },
  {
    id: 'hazard-symbols',
    category: 'An toàn',
    patterns: ['ký hiệu cảnh báo hóa chất', 'ghs', 'hazard symbols'],
    title: 'Một số nhóm cảnh báo hóa chất thường gặp',
    explanation:
      'Các cảnh báo thường gặp gồm: **dễ cháy**, **ăn mòn**, **độc cấp tính**, **gây kích ứng**, **oxi hóa mạnh**, **nguy hại môi trường**. Khi xây dựng ứng dụng giáo dục, nên gắn biểu tượng nguy cơ và hướng dẫn xử lý an toàn thay vì chỉ hiển thị tên chất.',
    suggestions: ['An toàn phòng thí nghiệm']
  }
];

export const CHEMISTRY_CURRICULUM = [
  {
    id: 'chemistry-map',
    patterns: ['bản đồ kiến thức', 'bản đồ hóa học', 'sơ đồ hóa học', 'toàn bộ hóa học', 'tổng quan hóa học', 'knowledge map'],
    title: 'Bản đồ kiến thức hóa học cốt lõi',
    explanation:
      'Chào mừng bạn đến với **Bản đồ Kiến thức Aurum**. Đây là nơi hội tụ tất cả các mảng kiến thức từ **đại cương nguyên tử – bảng tuần hoàn**, **liên kết hóa học** đến **hóa học hữu cơ** và **an toàn phòng thí nghiệm**. Nhấn nút bên dưới để mở bản đồ tương tác và khám phá chiều sâu của hóa học!',
    suggestions: ['Khám phá bản đồ', 'Đại cương', 'Hữu cơ', 'An toàn']
  }
];

export const FLAT_KNOWLEDGE_BASE = [...CHEMISTRY_KNOWLEDGE_BASE, ...CHEMISTRY_CURRICULUM];
