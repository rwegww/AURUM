export const enqueueLabProgressSave = (queueRef, saveTask) => {
  const queuedSave = queueRef.current
    .catch(() => undefined)
    .then(saveTask);

  queueRef.current = queuedSave;
  return queuedSave;
};
