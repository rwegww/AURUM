export const MATERIAL_CATEGORIES = [
  { id: 'INFOGRAPHIC HÃ“A 11', i18nKey: 'infographic_11', label: 'INFOGRAPHIC HÃ“A 11' },
  { id: 'INFOGRAPHIC HÃ“A 12', i18nKey: 'infographic_12', label: 'INFOGRAPHIC HÃ“A 12' },
  { id: 'SÄTD HÃ“A 10', i18nKey: 'mindmap_10', label: 'SÄTD HÃ“A 10' },
  { id: 'SÄTD HÃ“A 11', i18nKey: 'mindmap_11', label: 'SÄTD HÃ“A 11' },
  { id: 'SÄTD HÃ“A 12', i18nKey: 'mindmap_12', label: 'SÄTD HÃ“A 12' },
  { id: 'PHIáº¾U Há»ŒC Táº¬P HÃ“A 12', i18nKey: 'worksheet_12', label: 'PHIáº¾U Há»ŒC Táº¬P HÃ“A 12' },
  { id: 'TRUYá»†N TRANH HÃ“A 10', i18nKey: 'comic_10', label: 'TRUYá»†N TRANH HÃ“A 10' },
  { id: 'TRUYá»†N TRANH 11', i18nKey: 'comic_11', label: 'TRUYá»†N TRANH 11' },
  { id: 'TRUYá»†N TRANH HÃ“A 12', i18nKey: 'comic_12', label: 'TRUYá»†N TRANH HÃ“A 12' },
  { id: 'PHT HÃ“A 9', i18nKey: 'worksheet_9', label: 'PHT HÃ“A 9' },
  { id: 'SÄTD KHTN 6', i18nKey: 'mindmap_6', label: 'SÄTD KHTN 6' },
];

export const getMaterialCategoryOptions = (t, { includeAll = true } = {}) => {
  const categories = MATERIAL_CATEGORIES.map((category) => ({
    id: category.id,
    name: t ? t(`library.categories.${category.i18nKey}`) : category.label,
  }));

  if (!includeAll) return categories;

  return [
    { id: '', name: t ? t('library.categories.all') : 'Táº¥t cáº£ tÃ i liá»‡u' },
    ...categories,
  ];
};

