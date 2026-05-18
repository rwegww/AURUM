export const stableRandom = (seed, salt = 0) => {
  const input = `${seed}:${salt}`;
  let hash = 2166136261;

  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0) / 4294967295;
};

export const stableRange = (seed, salt, min, max) => min + stableRandom(seed, salt) * (max - min);
