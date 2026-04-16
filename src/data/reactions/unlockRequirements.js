export const unlockRequirements = {
  chemicals: {
    'H2O': { level: 1, required: [] },
    'HCl': { level: 1, required: [] },
    'NaOH': { level: 1, required: [] },
    'O2': { level: 2, required: [] },
    'H2': { level: 2, required: [] },
    'Fe': { level: 3, required: [] },
    'CuSO4': { level: 4, required: [] },
    'Na': { level: 5, required: ['rx_001'] },
    'Ag': { level: 10, required: [] },
    'Au': { level: 12, required: [] },
  },
  reactions: {
    'rx_001': { level: 2, requiredChemicals: ['H2', 'O2'] },
    'rx_006': { level: 1, requiredChemicals: ['HCl', 'NaOH'] },
    'rx_007': { level: 3, requiredChemicals: ['Fe', 'CuSO4'] },
    'rx_020': { level: 8, requiredChemicals: ['Al', 'H2SO4'] },
    'rx_037': { level: 12, requiredChemicals: ['CH3COOH', 'C2H5OH'] },
    'rx_125': { level: 12, requiredChemicals: ['Protein', 'Cu(OH)2'] },
    'rx_145': { level: 10, requiredChemicals: ['NaCl', 'AgNO3'] },
    'rx_163': { level: 10, requiredChemicals: ['SO3', 'H2O'] },
    'rx_200': { level: 12, requiredChemicals: ['C6H12O6', 'Ag2O'] },
    'rx_326': { level: 12, requiredChemicals: ['Au', 'HCl', 'HNO3'] },
    'rx_327': { level: 11, requiredChemicals: ['Ag', 'HNO3'] },
  }
};