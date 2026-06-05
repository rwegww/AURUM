const CHEMISTRY_GRADES = [
  { id: 'chung', label: 'CHUNG', i18nKey: 'chung' },
  { id: '8', label: 'LỚP 8', i18nKey: '8' },
  { id: '9', label: 'LỚP 9', i18nKey: '9' },
  { id: '10', label: 'LỚP 10', i18nKey: '10' },
  { id: '11', label: 'LỚP 11', i18nKey: '11' },
  { id: '12', label: 'LỚP 12', i18nKey: '12' },
];

const CHEMISTRY_TYPES = [
  { id: 'de_thi', label: 'ĐỀ THI' },
  { id: 'de_on', label: 'ĐỀ ÔN' },
  { id: 'anh', label: 'ẢNH' },
  { id: 'bai_giang', label: 'BÀI GIẢNG' },
];

export const CHEMISTRY_MATERIAL_CATEGORIES = CHEMISTRY_GRADES.flatMap((grade) =>
  CHEMISTRY_TYPES.map((type) => ({
    id: `HÓA ${grade.label} - ${type.label}`,
    i18nKey: `hoa_${grade.i18nKey}_${type.id}`,
    label: `HÓA ${grade.label} - ${type.label}`,
  }))
);

export const MATERIAL_CATEGORIES = [
  { id: 'INFOGRAPHIC HÓA 11', i18nKey: 'infographic_11', label: 'INFOGRAPHIC HÓA 11' },
  { id: 'INFOGRAPHIC HÓA 12', i18nKey: 'infographic_12', label: 'INFOGRAPHIC HÓA 12' },
  { id: 'SĐTD HÓA 10', i18nKey: 'mindmap_10', label: 'SĐTD HÓA 10' },
  { id: 'SĐTD HÓA 11', i18nKey: 'mindmap_11', label: 'SĐTD HÓA 11' },
  { id: 'SĐTD HÓA 12', i18nKey: 'mindmap_12', label: 'SĐTD HÓA 12' },
  { id: 'PHIẾU HỌC TẬP HÓA 12', i18nKey: 'worksheet_12', label: 'PHIẾU HỌC TẬP HÓA 12' },
  { id: 'TRUYỆN TRANH HÓA 10', i18nKey: 'comic_10', label: 'TRUYỆN TRANH HÓA 10' },
  { id: 'TRUYỆN TRANH 11', i18nKey: 'comic_11', label: 'TRUYỆN TRANH 11' },
  { id: 'TRUYỆN TRANH HÓA 12', i18nKey: 'comic_12', label: 'TRUYỆN TRANH HÓA 12' },
  { id: 'PHT HÓA 9', i18nKey: 'worksheet_9', label: 'PHT HÓA 9' },
  { id: 'SĐTD KHTN 6', i18nKey: 'mindmap_6', label: 'SĐTD KHTN 6' },
  ...CHEMISTRY_MATERIAL_CATEGORIES,
];

export const getMaterialCategoryOptions = (t, { includeAll = true } = {}) => {
  const categories = MATERIAL_CATEGORIES.map((category) => ({
    id: category.id,
    name: t ? t(`library.categories.${category.i18nKey}`) : category.label,
  }));

  if (!includeAll) return categories;

  return [
    { id: '', name: t ? t('library.categories.all') : 'Tất cả tài liệu' },
    ...categories,
  ];
};
