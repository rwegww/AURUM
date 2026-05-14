/**
 * KIẾN THỨC CỐT LÕI - Core Knowledge Data
 * Maps each knowledge topic in CHEMISTRY_KNOWLEDGE_BASE to specific curriculum lessons.
 * Used by KnowledgeMap to navigate directly to related lessons.
 * 
 * IMPORTANT: lessonId must match the string ID in the database (e.g., "hoa10_kntt_bai1")
 */

export const CORE_KNOWLEDGE_LESSONS = {
  // === ĐẠI CƯƠNG ===
  'atom-structure': [
    { classId: 10, lessonId: 'hoa10_kntt_bai1', title: 'Bài 1: Thành phần của nguyên tử' },
    { classId: 10, lessonId: 'hoa10_kntt_bai2', title: 'Bài 2: Nguyên tố hóa học' },
  ],
  'isotope': [
    { classId: 10, lessonId: 'hoa10_kntt_bai2', title: 'Bài 2: Nguyên tố hóa học' },
  ],
  'electron-config': [
    { classId: 10, lessonId: 'hoa10_kntt_bai3', title: 'Bài 3: Cấu trúc lớp vỏ electron nguyên tử' },
  ],
  'periodic-law': [
    { classId: 10, lessonId: 'hoa10_kntt_bai5', title: 'Bài 5: Cấu tạo của bảng tuần hoàn' },
    { classId: 10, lessonId: 'hoa10_kntt_bai8', title: 'Bài 8: Định luật tuần hoàn and ý nghĩa' },
  ],
  'periodic-trends': [
    { classId: 10, lessonId: 'hoa10_kntt_bai6', title: 'Bài 6: Xu hướng biến đổi tính chất của nguyên tử' },
    { classId: 10, lessonId: 'hoa10_kntt_bai7', title: 'Bài 7: Xu hướng biến đổi tính chất của hợp chất' },
  ],
  'metals-nonmetals': [
    { classId: 9, lessonId: 'hoa9_kntt_bai4', title: 'Bài 4: Phân biệt Phi kim và Kim loại' },
    { classId: 9, lessonId: 'hoa9_kntt_bai16', title: 'Bài 16: Sơ lược về hóa học vỏ Trái Đất' },
    { classId: 10, lessonId: 'hoa10_kntt_bai6', title: 'Bài 6: Xu hướng biến đổi tính chất của nguyên tử' },
    { classId: 12, lessonId: 'hoa12_kntt_bai18', title: 'Bài 18: Cấu tạo và liên kết trong tinh thể kim loại' },
    { classId: 12, lessonId: 'hoa12_kntt_bai19', title: 'Bài 19: Tính chất vật lí và hoá học của kim loại' },
  ],

  // === LIÊN KẾT ===
  'chemical-bonding': [
    { classId: 10, lessonId: 'hoa10_kntt_bai10', title: 'Bài 10: Quy tắc octet' },
    { classId: 10, lessonId: 'hoa10_kntt_bai11', title: 'Bài 11: Liên kết ion' },
    { classId: 10, lessonId: 'hoa10_kntt_bai12', title: 'Bài 12: Liên kết cộng hóa trị' },
  ],
  'ionic-bond': [
    { classId: 10, lessonId: 'hoa10_kntt_bai11', title: 'Bài 11: Liên kết ion' },
  ],
  'covalent-bond': [
    { classId: 10, lessonId: 'hoa10_kntt_bai12', title: 'Bài 12: Liên kết cộng hóa trị' },
  ],
  'metallic-bond': [
    { classId: 10, lessonId: 'hoa10_kntt_bai13', title: 'Bài 13: Liên kết hydrogen and Tương tác van der Waals' },
    { classId: 12, lessonId: 'hoa12_kntt_bai18', title: 'Bài 18: Cấu tạo và liên kết trong tinh thể kim loại' },
  ],

  // === MOL VÀ ĐỊNH LƯỢNG ===
  'mole-concept': [
    { classId: 8, lessonId: 'hoa8_kntt_bai3', title: 'Bài 3: Mol và tỉ khối chất khí' },
    { classId: 8, lessonId: 'hoa8_kntt_bai6', title: 'Bài 6: Tính toán theo phương trình hóa học' },
    { classId: 10, lessonId: 'hoa10_kntt_bai1', title: 'Bài 1: Thành phần của nguyên tử' },
    { classId: 10, lessonId: 'hoa10_kntt_bai2', title: 'Bài 2: Nguyên tố hóa học' },
  ],
  'molar-mass': [
    { classId: 8, lessonId: 'hoa8_kntt_bai3', title: 'Bài 3: Mol và tỉ khối chất khí' },
    { classId: 10, lessonId: 'hoa10_kntt_bai2', title: 'Bài 2: Nguyên tố hóa học' },
  ],
  'mol-mass': [
    { classId: 8, lessonId: 'hoa8_kntt_bai3', title: 'Bài 3: Mol và tỉ khối chất khí' },
    { classId: 10, lessonId: 'hoa10_kntt_bai2', title: 'Bài 2: Nguyên tố hóa học' },
  ],
  'mol-particles': [
    { classId: 8, lessonId: 'hoa8_kntt_bai3', title: 'Bài 3: Mol và tỉ khối chất khí' },
    { classId: 10, lessonId: 'hoa10_kntt_bai1', title: 'Bài 1: Thành phần của nguyên tử' },
  ],
  'mol-vol': [
    { classId: 8, lessonId: 'hoa8_kntt_bai3', title: 'Bài 3: Mol và tỉ khối chất khí' },
    { classId: 10, lessonId: 'hoa10_kntt_bai2', title: 'Bài 2: Nguyên tố hóa học' },
  ],

  // === CHẤT KHÍ ===
  'ideal-gas': [
    { classId: 11, lessonId: 'hoa11_kntt_bai1', title: 'Bài 1: Khái niệm về cân bằng hóa học' },
  ],
  'boyle-law': [
    { classId: 11, lessonId: 'hoa11_kntt_bai1', title: 'Bài 1: Khái niệm về cân bằng hóa học' },
  ],
  'charles-law': [
    { classId: 11, lessonId: 'hoa11_kntt_bai1', title: 'Bài 1: Khái niệm về cân bằng hóa học' },
  ],
  'density-gas': [
    { classId: 8, lessonId: 'hoa8_kntt_bai3', title: 'Bài 3: Mol và tỉ khối chất khí' },
    { classId: 11, lessonId: 'hoa11_kntt_bai4', title: 'Bài 4: Nitrogen' },
  ],

  // === DUNG DỊCH ===
  'solution-basic': [
    { classId: 8, lessonId: 'hoa8_kntt_bai4', title: 'Bài 4: Dung dịch và Nồng độ' },
    { classId: 11, lessonId: 'hoa11_kntt_bai2', title: 'Bài 2: Cân bằng trong dung dịch nước' },
  ],
  'molar-conc': [
    { classId: 8, lessonId: 'hoa8_kntt_bai4', title: 'Bài 4: Dung dịch và Nồng độ' },
    { classId: 11, lessonId: 'hoa11_kntt_bai2', title: 'Bài 2: Cân bằng trong dung dịch nước' },
  ],
  'percent-conc': [
    { classId: 8, lessonId: 'hoa8_kntt_bai4', title: 'Bài 4: Dung dịch và Nồng độ' },
    { classId: 11, lessonId: 'hoa11_kntt_bai2', title: 'Bài 2: Cân bằng trong dung dịch nước' },
  ],
  'dilution': [
    { classId: 8, lessonId: 'hoa8_kntt_bai4', title: 'Bài 4: Dung dịch và Nồng độ' },
    { classId: 11, lessonId: 'hoa11_kntt_bai2', title: 'Bài 2: Cân bằng trong dung dịch nước' },
  ],
  'solubility': [
    { classId: 8, lessonId: 'hoa8_kntt_bai4', title: 'Bài 4: Dung dịch và Nồng độ' },
    { classId: 11, lessonId: 'hoa11_kntt_bai2', title: 'Bài 2: Cân bằng trong dung dịch nước' },
  ],
  'electrolyte': [
    { classId: 11, lessonId: 'hoa11_kntt_bai2', title: 'Bài 2: Cân bằng trong dung dịch nước' },
  ],

  // === AXIT – BAZƠ – MUỐI ===
  'acid-definition': [
    { classId: 8, lessonId: 'hoa8_kntt_bai8', title: 'Bài 8: acid' },
    { classId: 11, lessonId: 'hoa11_kntt_bai2', title: 'Bài 2: Cân bằng trong dung dịch nước' },
    { classId: 11, lessonId: 'hoa11_kntt_bai8', title: 'Bài 8: Sulfuric acid and muối sulfate' },
  ],
  'base-definition': [
    { classId: 8, lessonId: 'hoa8_kntt_bai9', title: 'Bài 9: Base - Thang pH' },
    { classId: 11, lessonId: 'hoa11_kntt_bai2', title: 'Bài 2: Cân bằng trong dung dịch nước' },
    { classId: 11, lessonId: 'hoa11_kntt_bai5', title: 'Bài 5: Ammonia – Muối ammonium' },
  ],
  'salt-definition': [
    { classId: 8, lessonId: 'hoa8_kntt_bai11', title: 'Bài 11: muối' },
    { classId: 8, lessonId: 'hoa8_kntt_bai12', title: 'Bài 12: Phân bón hóa học' },
    { classId: 9, lessonId: 'hoa9_kntt_bai17', title: 'Bài 17: Khai thác đá vôi. Công nghiệp Silicate' },
    { classId: 11, lessonId: 'hoa11_kntt_bai5', title: 'Bài 5: Ammonia – Muối ammonium' },
    { classId: 11, lessonId: 'hoa11_kntt_bai8', title: 'Bài 8: Sulfuric acid and muối sulfate' },
  ],
  'oxide-classification': [
    { classId: 8, lessonId: 'hoa8_kntt_bai10', title: 'Bài 10: oxide' },
    { classId: 11, lessonId: 'hoa11_kntt_bai6', title: 'Bài 6: Một số hợp chất của nitrogen với oxygen' },
    { classId: 11, lessonId: 'hoa11_kntt_bai7', title: 'Bài 7: Sulfur and sulfur dioxide' },
  ],
  'neutralization': [
    { classId: 11, lessonId: 'hoa11_kntt_bai2', title: 'Bài 2: Cân bằng trong dung dịch nước' },
  ],
  'ph-scale': [
    { classId: 8, lessonId: 'hoa8_kntt_bai9', title: 'Bài 9: Base - Thang pH' },
    { classId: 11, lessonId: 'hoa11_kntt_bai2', title: 'Bài 2: Cân bằng trong dung dịch nước' },
  ],
  'strong-weak-acid-base': [
    { classId: 8, lessonId: 'hoa8_kntt_bai8', title: 'Bài 8: acid' },
    { classId: 11, lessonId: 'hoa11_kntt_bai2', title: 'Bài 2: Cân bằng trong dung dịch nước' },
  ],

  // === PHẢN ỨNG HÓA HỌC ===
  'precipitation': [
    { classId: 11, lessonId: 'hoa11_kntt_bai2', title: 'Bài 2: Cân bằng trong dung dịch nước' },
  ],
  'gas-evolution': [
    { classId: 11, lessonId: 'hoa11_kntt_bai6', title: 'Bài 6: Một số hợp chất của nitrogen với oxygen' },
  ],
  'reaction-classification': [
    { classId: 8, lessonId: 'hoa8_kntt_bai2', title: 'Bài 2: Phản ứng hóa học' },
    { classId: 8, lessonId: 'hoa8_kntt_bai5', title: 'Bài 5: Định luật bảo toàn khối lượng và Phương trình hóa học' },
    { classId: 10, lessonId: 'hoa10_kntt_bai15', title: 'Bài 15: Phản ứng oxi hóa - khử' },
  ],

  // === ĐỘNG HÓA HỌC ===
  'reaction-rate': [
    { classId: 8, lessonId: 'hoa8_kntt_bai7', title: 'Bài 7: Tốc độ phản ứng và chất xúc tác' },
    { classId: 10, lessonId: 'hoa10_kntt_bai19', title: 'Bài 19: Tốc độ phản ứng' },
  ],
  'catalyst': [
    { classId: 8, lessonId: 'hoa8_kntt_bai7', title: 'Bài 7: Tốc độ phản ứng và chất xúc tác' },
    { classId: 10, lessonId: 'hoa10_kntt_bai19', title: 'Bài 19: Tốc độ phản ứng' },
  ],

  // === CÂN BẰNG HÓA HỌC ===
  'chemical-equilibrium': [
    { classId: 11, lessonId: 'hoa11_kntt_bai1', title: 'Bài 1: Khái niệm về cân bằng hóa học' },
  ],
  'le-chatelier': [
    { classId: 11, lessonId: 'hoa11_kntt_bai1', title: 'Bài 1: Khái niệm về cân bằng hóa học' },
  ],

  // === NHIỆT HÓA HỌC ===
  'enthalpy': [
    { classId: 10, lessonId: 'hoa10_kntt_bai17', title: 'Bài 17: Biến thiên enthalpy trong các phản ứng hóa học' },
  ],
  'hess-law': [
    { classId: 10, lessonId: 'hoa10_kntt_bai17', title: 'Bài 17: Biến thiên enthalpy trong các phản ứng hóa học' },
  ],

  // === OXI HÓA – KHỬ ===
  'redox': [
    { classId: 10, lessonId: 'hoa10_kntt_bai15', title: 'Bài 15: Phản ứng oxi hóa - khử' },
  ],
  'oxidation-number': [
    { classId: 10, lessonId: 'hoa10_kntt_bai15', title: 'Bài 15: Phản ứng oxi hóa - khử' },
  ],

  // === ĐIỆN HÓA ===
  'electrochemistry': [
    { classId: 12, lessonId: 'hoa12_kntt_bai15', title: 'Bài 15: Thế điện cực và nguồn điện hoá học' },
  ],
  'electrolysis': [
    { classId: 12, lessonId: 'hoa12_kntt_bai15', title: 'Bài 15: Thế điện cực và nguồn điện hoá học' },
  ],

  // === KIM LOẠI ===
  'metal-activity-series': [
    { classId: 9, lessonId: 'hoa9_kntt_bai2', title: 'Bài 2: Dãy hoạt động hóa học' },
    { classId: 12, lessonId: 'hoa12_kntt_bai19', title: 'Bài 19: Tính chất vật lí và hoá học của kim loại' },
  ],
  'metal-properties': [
    { classId: 9, lessonId: 'hoa9_kntt_bai1', title: 'Bài 1: Tính chất chung của kim loại' },
    { classId: 9, lessonId: 'hoa9_kntt_bai3', title: 'Bài 3: Tách kim loại và sử dụng hợp kim' },
    { classId: 12, lessonId: 'hoa12_kntt_bai18', title: 'Bài 18: Cấu tạo và liên kết trong tinh thể kim loại' },
    { classId: 12, lessonId: 'hoa12_kntt_bai19', title: 'Bài 19: Tính chất vật lí và hoá học của kim loại' },
  ],
  'corrosion': [
    { classId: 12, lessonId: 'hoa12_kntt_bai22', title: 'Bài 22: Sự ăn mòn kim loại' },
  ],

  // === PHI KIM ===
  'nonmetal-properties': [
    { classId: 10, lessonId: 'hoa10_kntt_bai21', title: 'Bài 21: Nhóm halogen' },
  ],
  'halogen': [
    { classId: 10, lessonId: 'hoa10_kntt_bai21', title: 'Bài 21: Nhóm halogen' },
    { classId: 10, lessonId: 'hoa10_kntt_bai22', title: 'Bài 22: Hydrogen halide and Muối halide' },
  ],
  'oxygen-sulfur': [
    { classId: 11, lessonId: 'hoa11_kntt_bai7', title: 'Bài 7: Sulfur and sulfur dioxide' },
    { classId: 11, lessonId: 'hoa11_kntt_bai8', title: 'Bài 8: Sulfuric acid and muối sulfate' },
  ],
  'nitrogen-phosphorus': [
    { classId: 8, lessonId: 'hoa8_kntt_bai12', title: 'Bài 12: Phân bón hóa học' },
    { classId: 11, lessonId: 'hoa11_kntt_bai4', title: 'Bài 4: Nitrogen' },
    { classId: 11, lessonId: 'hoa11_kntt_bai5', title: 'Bài 5: Ammonia – Muối ammonium' },
    { classId: 11, lessonId: 'hoa11_kntt_bai6', title: 'Bài 6: Một số hợp chất của nitrogen với oxygen' },
  ],

  // === HỮU CƠ ===
  'organic-overview': [
    { classId: 9, lessonId: 'hoa9_kntt_bai5', title: 'Bài 5: Giới thiệu Hợp chất hữu cơ' },
    { classId: 9, lessonId: 'hoa9_kntt_bai18', title: 'Bài 18: Nhiên liệu hóa thạch, Chu trình Carbon và Sự ấm lên toàn cầu' },
    { classId: 11, lessonId: 'hoa11_kntt_bai10', title: 'Bài 10: Hợp chất hữu cơ and hóa học hữu cơ' },
    { classId: 11, lessonId: 'hoa11_kntt_bai12', title: 'Bài 12: Công thức phân tử hợp chất hữu cơ' },
    { classId: 11, lessonId: 'hoa11_kntt_bai13', title: 'Bài 13: Cấu tạo hóa học hợp chất hữu cơ' },
  ],
  'hydrocarbon': [
    { classId: 9, lessonId: 'hoa9_kntt_bai8', title: 'Bài 8: Nguồn nhiên liệu' },
    { classId: 11, lessonId: 'hoa11_kntt_bai15', title: 'Bài 15: Alkane' },
    { classId: 11, lessonId: 'hoa11_kntt_bai16', title: 'Bài 16: Hydrocarbon không no' },
    { classId: 11, lessonId: 'hoa11_kntt_bai17', title: 'Bài 17: Arene (hydrocarbon thơm)' },
  ],
  'alkane': [
    { classId: 9, lessonId: 'hoa9_kntt_bai6', title: 'Bài 6: Alkane' },
    { classId: 11, lessonId: 'hoa11_kntt_bai15', title: 'Bài 15: Alkane' },
  ],
  'alkene': [
    { classId: 9, lessonId: 'hoa9_kntt_bai7', title: 'Bài 7: Alkene' },
    { classId: 11, lessonId: 'hoa11_kntt_bai16', title: 'Bài 16: Hydrocarbon không no' },
  ],
  'alkyne': [
    { classId: 11, lessonId: 'hoa11_kntt_bai16', title: 'Bài 16: Hydrocarbon không no' },
  ],
  'benzene': [
    { classId: 11, lessonId: 'hoa11_kntt_bai17', title: 'Bài 17: Arene (hydrocarbon thơm)' },
  ],
  'functional-group': [
    { classId: 11, lessonId: 'hoa11_kntt_bai13', title: 'Bài 13: Cấu tạo hóa học hợp chất hữu cơ' },
  ],
  'alcohol': [
    { classId: 9, lessonId: 'hoa9_kntt_bai9', title: 'Bài 9: Ethylic alcohol' },
    { classId: 11, lessonId: 'hoa11_kntt_bai20', title: 'Bài 20: Alcohol' },
  ],
  'phenol': [
    { classId: 11, lessonId: 'hoa11_kntt_bai21', title: 'Bài 21: Phenol' },
  ],
  'aldehyde-ketone': [
    { classId: 11, lessonId: 'hoa11_kntt_bai23', title: 'Bài 23: Hợp chất carbonyl' },
  ],
  'carboxylic-acid': [
    { classId: 9, lessonId: 'hoa9_kntt_bai10', title: 'Bài 10: Acetic acid' },
    { classId: 11, lessonId: 'hoa11_kntt_bai24', title: 'Bài 24: Carboxylic acid' },
  ],
  'ester': [
    { classId: 12, lessonId: 'hoa12_kntt_bai1', title: 'Bài 1: Ester – Lipid' },
  ],
  'lipid': [
    { classId: 9, lessonId: 'hoa9_kntt_bai11', title: 'Bài 11: Lipid' },
    { classId: 12, lessonId: 'hoa12_kntt_bai1', title: 'Bài 1: Ester – Lipid' },
    { classId: 12, lessonId: 'hoa12_kntt_bai2', title: 'Bài 2: Xà phòng và chất giặt rửa' },
  ],
  'carbohydrate': [
    { classId: 9, lessonId: 'hoa9_kntt_bai12', title: 'Bài 12: Carbohydrate. Glucose và Saccharose' },
    { classId: 9, lessonId: 'hoa9_kntt_bai13', title: 'Bài 13: Tinh bột và Cellulose' },
    { classId: 12, lessonId: 'hoa12_kntt_bai4', title: 'Bài 4: Glucose và fructose' },
    { classId: 12, lessonId: 'hoa12_kntt_bai5', title: 'Bài 5: Saccharose và maltose' },
    { classId: 12, lessonId: 'hoa12_kntt_bai6', title: 'Bài 6: Tinh bột và cellulose' },
  ],
  'amine-amino-acid-protein': [
    { classId: 9, lessonId: 'hoa9_kntt_bai14', title: 'Bài 14: Protein' },
    { classId: 12, lessonId: 'hoa12_kntt_bai8', title: 'Bài 8: Amine' },
    { classId: 12, lessonId: 'hoa12_kntt_bai9', title: 'Bài 9: Amino acid và peptide' },
    { classId: 12, lessonId: 'hoa12_kntt_bai10', title: 'Bài 10: Protein và enzyme' },
  ],
  'polymer': [
    { classId: 9, lessonId: 'hoa9_kntt_bai15', title: 'Bài 15: Polymer' },
    { classId: 12, lessonId: 'hoa12_kntt_bai12', title: 'Bài 12: Đại cương về polymer' },
    { classId: 12, lessonId: 'hoa12_kntt_bai13', title: 'Bài 13: Vật liệu polymer' },
  ],

  // === AN TOÀN ===
  'lab-safety': [
    { classId: 8, lessonId: 'hoa8_kntt_bai1', title: 'Bài 1: Sử dụng hóa chất và thiết bị cơ bản' },
  ],
  'hazard-symbols': [
    { classId: 8, lessonId: 'hoa8_kntt_bai1', title: 'Bài 1: Sử dụng hóa chất và thiết bị cơ bản' },
  ],
};
