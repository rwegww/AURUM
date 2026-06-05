export const CHEMISTRY_GRADES = [
  { id: 'chung', label: 'CHUNG', i18nKey: 'chung' },
  { id: '7', label: 'LỚP 7', i18nKey: '7' },
  { id: '8', label: 'LỚP 8', i18nKey: '8' },
  { id: '9', label: 'LỚP 9', i18nKey: '9' },
  { id: '10', label: 'LỚP 10', i18nKey: '10' },
  { id: '11', label: 'LỚP 11', i18nKey: '11' },
  { id: '12', label: 'LỚP 12', i18nKey: '12' },
];

export const CHEMISTRY_TYPES = [
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
