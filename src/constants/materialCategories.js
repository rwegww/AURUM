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

