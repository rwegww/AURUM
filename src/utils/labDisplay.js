const aggregateBatches = (batches) => {
  const batchMap = new Map();

  batches.forEach((batch) => {
    const amount = Number(batch.amount || 0);
    if (!batch.formula || amount <= 0) return;

    const key = `${batch.formula}_${batch.unit}`;
    if (!batchMap.has(key)) {
      batchMap.set(key, {
        formula: batch.formula,
        name: batch.name,
        amount: 0,
        unit: batch.unit,
        state: batch.state,
        isPrecipitate: batch.isPrecipitate,
      });
    }
    batchMap.get(key).amount += amount;
  });

  return Array.from(batchMap.values());
};

export const getCurrentBeakerDisplay = (materialBatches = []) => ({
  inputList: aggregateBatches(materialBatches.filter(batch => !batch.isProduct)),
  productList: aggregateBatches(materialBatches.filter(batch => batch.isProduct)),
});
