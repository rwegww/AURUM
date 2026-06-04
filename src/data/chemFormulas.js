/**
 * CÆ¡ sá»Ÿ dá»¯ liá»‡u cÃ´ng thá»©c HÃ³a há»c - Sáº¯p xáº¿p theo NHÃ“M tÃ­nh cháº¥t
 * Má»—i cÃ´ng thá»©c bao gá»“m: tÃªn, kÃ½ hiá»‡u, cÃ¡c biáº¿n, hÃ m tÃ­nh toÃ¡n, vÃ  mÃ´ táº£
 */

export const CHEM_FORMULAS = {
  basic: {
    label: 'Sá»‘ mol & Khá»‘i lÆ°á»£ng',
    icon: 'âš–ï¸',
    categories: [
      {
        name: 'CÃ´ng thá»©c tÃ­nh sá»‘ mol',
        formulas: [
          {
            id: 'mol_mass',
            name: 'TÃ­nh mol tá»« khá»‘i lÆ°á»£ng',
            formula: 'n = m / M',
            variables: [
              { key: 'n', label: 'Sá»‘ mol (mol)', unit: 'mol' },
              { key: 'm', label: 'Khá»‘i lÆ°á»£ng cháº¥t (g)', unit: 'g' },
              { key: 'M', label: 'Khá»‘i lÆ°á»£ng mol (g/mol)', unit: 'g/mol' },
            ],
            solve: (vars) => {
              if (vars.m !== null && vars.M !== null) return { n: vars.m / vars.M };
              if (vars.n !== null && vars.M !== null) return { m: vars.n * vars.M };
              if (vars.n !== null && vars.m !== null) return { M: vars.m / vars.n };
              return null;
            },
          },
          {
            id: 'mol_volume',
            name: 'TÃ­nh mol tá»« thá»ƒ tÃ­ch khÃ­ (Ä‘ktc)',
            formula: 'n = V / 22,4',
            variables: [
              { key: 'n', label: 'Sá»‘ mol (mol)', unit: 'mol' },
              { key: 'V', label: 'Thá»ƒ tÃ­ch khÃ­ (lÃ­t)', unit: 'L' },
            ],
            solve: (vars) => {
              if (vars.V !== null) return { n: vars.V / 22.4 };
              if (vars.n !== null) return { V: vars.n * 22.4 };
              return null;
            },
          },
          {
            id: 'mol_particles',
            name: 'TÃ­nh mol tá»« sá»‘ háº¡t',
            formula: 'n = N / Nâ‚',
            variables: [
              { key: 'n', label: 'Sá»‘ mol (mol)', unit: 'mol' },
              { key: 'N', label: 'Sá»‘ háº¡t', unit: 'háº¡t' },
            ],
            solve: (vars) => {
              const Na = 6.022e23;
              if (vars.N !== null) return { n: vars.N / Na };
              if (vars.n !== null) return { N: vars.n * Na };
              return null;
            },
          },
        ],
      },
      {
        name: 'CÃ´ng thá»©c tÃ­nh khá»‘i lÆ°á»£ng',
        formulas: [
          {
            id: 'mass_from_mol',
            name: 'Khá»‘i lÆ°á»£ng cháº¥t',
            formula: 'm = n Ã— M',
            variables: [
              { key: 'm', label: 'Khá»‘i lÆ°á»£ng (g)', unit: 'g' },
              { key: 'n', label: 'Sá»‘ mol (mol)', unit: 'mol' },
              { key: 'M', label: 'Khá»‘i lÆ°á»£ng mol (g/mol)', unit: 'g/mol' },
            ],
            solve: (vars) => {
              if (vars.n !== null && vars.M !== null) return { m: vars.n * vars.M };
              if (vars.m !== null && vars.M !== null) return { n: vars.m / vars.M };
              if (vars.m !== null && vars.n !== null) return { M: vars.m / vars.n };
              return null;
            },
          },
        ],
      },
    ],
  },
  concentration: {
    label: 'Dung dá»‹ch & Ná»“ng Ä‘á»™',
    icon: 'ðŸ§ª',
    categories: [
      {
        name: 'Ná»“ng Ä‘á»™ dung dá»‹ch',
        formulas: [
          {
            id: 'concentration_percent',
            name: 'Ná»“ng Ä‘á»™ pháº§n trÄƒm',
            formula: 'C% = (mct / mdd) Ã— 100%',
            variables: [
              { key: 'C', label: 'Ná»“ng Ä‘á»™ pháº§n trÄƒm (%)', unit: '%' },
              { key: 'mct', label: 'Khá»‘i lÆ°á»£ng cháº¥t tan (g)', unit: 'g' },
              { key: 'mdd', label: 'Khá»‘i lÆ°á»£ng dung dá»‹ch (g)', unit: 'g' },
            ],
            solve: (vars) => {
              if (vars.mct !== null && vars.mdd !== null) return { C: (vars.mct / vars.mdd) * 100 };
              if (vars.C !== null && vars.mdd !== null) return { mct: (vars.C * vars.mdd) / 100 };
              if (vars.C !== null && vars.mct !== null) return { mdd: (vars.mct * 100) / vars.C };
              return null;
            },
          },
          {
            id: 'concentration_mol',
            name: 'Ná»“ng Ä‘á»™ mol',
            formula: 'Câ‚˜ = n / V',
            variables: [
              { key: 'Cm', label: 'Ná»“ng Ä‘á»™ mol (M)', unit: 'M' },
              { key: 'n', label: 'Sá»‘ mol cháº¥t tan (mol)', unit: 'mol' },
              { key: 'V', label: 'Thá»ƒ tÃ­ch dung dá»‹ch (lÃ­t)', unit: 'L' },
            ],
            solve: (vars) => {
              if (vars.n !== null && vars.V !== null) return { Cm: vars.n / vars.V };
              if (vars.Cm !== null && vars.V !== null) return { n: vars.Cm * vars.V };
              if (vars.Cm !== null && vars.n !== null) return { V: vars.n / vars.Cm };
              return null;
            },
          },
          {
            id: 'mass_solution',
            name: 'Khá»‘i lÆ°á»£ng dung dá»‹ch',
            formula: 'mdd = mct + mdm',
            variables: [
              { key: 'mdd', label: 'Khá»‘i lÆ°á»£ng dung dá»‹ch (g)', unit: 'g' },
              { key: 'mct', label: 'Khá»‘i lÆ°á»£ng cháº¥t tan (g)', unit: 'g' },
              { key: 'mdm', label: 'Khá»‘i lÆ°á»£ng dung mÃ´i (g)', unit: 'g' },
            ],
            solve: (vars) => {
              if (vars.mct !== null && vars.mdm !== null) return { mdd: vars.mct + vars.mdm };
              if (vars.mdd !== null && vars.mdm !== null) return { mct: vars.mdd - vars.mdm };
              if (vars.mdd !== null && vars.mct !== null) return { mdm: vars.mdd - vars.mct };
              return null;
            },
          },
        ],
      },
      {
        name: 'Pha loÃ£ng dung dá»‹ch',
        formulas: [
          {
            id: 'dilution',
            name: 'Pha loÃ£ng dung dá»‹ch',
            formula: 'Câ‚Vâ‚ = Câ‚‚Vâ‚‚',
            variables: [
              { key: 'C1', label: 'Ná»“ng Ä‘á»™ ban Ä‘áº§u (M)', unit: 'M' },
              { key: 'V1', label: 'Thá»ƒ tÃ­ch ban Ä‘áº§u (mL)', unit: 'mL' },
              { key: 'C2', label: 'Ná»“ng Ä‘á»™ sau pha loÃ£ng (M)', unit: 'M' },
              { key: 'V2', label: 'Thá»ƒ tÃ­ch sau pha loÃ£ng (mL)', unit: 'mL' },
            ],
            solve: (vars) => {
              if (vars.C1 !== null && vars.V1 !== null && vars.V2 !== null) return { C2: (vars.C1 * vars.V1) / vars.V2 };
              if (vars.C1 !== null && vars.V1 !== null && vars.C2 !== null) return { V2: (vars.C1 * vars.V1) / vars.C2 };
              if (vars.C2 !== null && vars.V2 !== null && vars.V1 !== null) return { C1: (vars.C2 * vars.V2) / vars.V1 };
              if (vars.C2 !== null && vars.V2 !== null && vars.C1 !== null) return { V1: (vars.C2 * vars.V2) / vars.C1 };
              return null;
            },
          },
        ],
      },
    ],
  },
  gases: {
    label: 'Cháº¥t khÃ­ & Tráº¡ng thÃ¡i',
    icon: 'ðŸŒ¬ï¸',
    categories: [
      {
        name: 'Thá»ƒ tÃ­ch & Ãp suáº¥t',
        formulas: [
          {
            id: 'volume_gas',
            name: 'Thá»ƒ tÃ­ch khÃ­ á»Ÿ Ä‘ktc',
            formula: 'V = n Ã— 22,4',
            variables: [
              { key: 'V', label: 'Thá»ƒ tÃ­ch (lÃ­t)', unit: 'L' },
              { key: 'n', label: 'Sá»‘ mol (mol)', unit: 'mol' },
            ],
            solve: (vars) => {
              if (vars.n !== null) return { V: vars.n * 22.4 };
              if (vars.V !== null) return { n: vars.V / 22.4 };
              return null;
            },
          },
          {
            id: 'ideal_gas',
            name: 'PhÆ°Æ¡ng trÃ¬nh tráº¡ng thÃ¡i khÃ­ (PV=nRT)',
            formula: 'PV = nRT',
            variables: [
              { key: 'P', label: 'Ãp suáº¥t (atm)', unit: 'atm' },
              { key: 'V', label: 'Thá»ƒ tÃ­ch (lÃ­t)', unit: 'L' },
              { key: 'n', label: 'Sá»‘ mol (mol)', unit: 'mol' },
              { key: 'T', label: 'Nhiá»‡t Ä‘á»™ (K)', unit: 'K' },
            ],
            solve: (vars) => {
              const R = 0.0821;
              if (vars.n !== null && vars.T !== null && vars.V !== null) return { P: (vars.n * R * vars.T) / vars.V };
              if (vars.n !== null && vars.T !== null && vars.P !== null) return { V: (vars.n * R * vars.T) / vars.P };
              if (vars.P !== null && vars.V !== null && vars.T !== null) return { n: (vars.P * vars.V) / (R * vars.T) };
              if (vars.P !== null && vars.V !== null && vars.n !== null) return { T: (vars.P * vars.V) / (vars.n * R) };
              return null;
            },
          },
        ],
      },
      {
        name: 'Tá»‰ khá»‘i khÃ­',
        formulas: [
          {
            id: 'density_ratio_b',
            name: 'Tá»‰ khá»‘i khÃ­ A so vá»›i khÃ­ B',
            formula: 'dA/B = MA / MB',
            variables: [
              { key: 'd', label: 'Tá»‰ khá»‘i', unit: '' },
              { key: 'MA', label: 'Khá»‘i lÆ°á»£ng mol khÃ­ A (g/mol)', unit: 'g/mol' },
              { key: 'MB', label: 'Khá»‘i lÆ°á»£ng mol khÃ­ B (g/mol)', unit: 'g/mol' },
            ],
            solve: (vars) => {
              if (vars.MA !== null && vars.MB !== null) return { d: vars.MA / vars.MB };
              if (vars.d !== null && vars.MB !== null) return { MA: vars.d * vars.MB };
              if (vars.d !== null && vars.MA !== null) return { MB: vars.MA / vars.d };
              return null;
            },
          },
          {
            id: 'density_ratio_air',
            name: 'Tá»‰ khá»‘i so vá»›i khÃ´ng khÃ­',
            formula: 'dA/kk = MA / 29',
            variables: [
              { key: 'd', label: 'Tá»‰ khá»‘i so vá»›i khÃ´ng khÃ­', unit: '' },
              { key: 'MA', label: 'Khá»‘i lÆ°á»£ng mol khÃ­ A (g/mol)', unit: 'g/mol' },
            ],
            solve: (vars) => {
              if (vars.MA !== null) return { d: vars.MA / 29 };
              if (vars.d !== null) return { MA: vars.d * 29 };
              return null;
            },
          },
        ],
      },
    ],
  },
  reaction: {
    label: 'Pháº£n á»©ng & Hiá»‡u suáº¥t',
    icon: 'âš¡',
    categories: [
      {
        name: 'Hiá»‡u suáº¥t & Tá»‘c Ä‘á»™',
        formulas: [
          {
            id: 'yield',
            name: 'Hiá»‡u suáº¥t pháº£n á»©ng',
            formula: 'H% = (thá»±c táº¿ / lÃ½ thuyáº¿t) Ã— 100%',
            variables: [
              { key: 'H', label: 'Hiá»‡u suáº¥t (%)', unit: '%' },
              { key: 'actual', label: 'LÆ°á»£ng thá»±c táº¿', unit: '' },
              { key: 'theory', label: 'LÆ°á»£ng lÃ½ thuyáº¿t', unit: '' },
            ],
            solve: (vars) => {
              if (vars.actual !== null && vars.theory !== null) return { H: (vars.actual / vars.theory) * 100 };
              if (vars.H !== null && vars.theory !== null) return { actual: (vars.H * vars.theory) / 100 };
              if (vars.H !== null && vars.actual !== null) return { theory: (vars.actual * 100) / vars.H };
              return null;
            },
          },
          {
            id: 'reaction_rate',
            name: 'Tá»‘c Ä‘á»™ pháº£n á»©ng trung bÃ¬nh',
            formula: 'v = Î”C / Î”t',
            variables: [
              { key: 'v', label: 'Tá»‘c Ä‘á»™ pháº£n á»©ng (mol/LÂ·s)', unit: 'mol/LÂ·s' },
              { key: 'dC', label: 'Äá»™ biáº¿n thiÃªn ná»“ng Ä‘á»™ (mol/L)', unit: 'mol/L' },
              { key: 'dt', label: 'Äá»™ biáº¿n thiÃªn thá»i gian (s)', unit: 's' },
            ],
            solve: (vars) => {
              if (vars.dC !== null && vars.dt !== null) return { v: Math.abs(vars.dC / vars.dt) };
              if (vars.v !== null && vars.dt !== null) return { dC: vars.v * vars.dt };
              if (vars.v !== null && vars.dC !== null) return { dt: vars.dC / vars.v };
              return null;
            },
          },
        ],
      },
    ],
  },
  advanced: {
    label: 'pH & Äiá»‡n hÃ³a',
    icon: 'âš›ï¸',
    categories: [
      {
        name: 'pH & CÃ¢n báº±ng',
        formulas: [
          {
            id: 'ph',
            name: 'TÃ­nh pH',
            formula: 'pH = -log[Hâº]',
            variables: [
              { key: 'pH', label: 'GiÃ¡ trá»‹ pH', unit: '' },
              { key: 'H', label: 'Ná»“ng Ä‘á»™ Hâº (mol/L)', unit: 'mol/L' },
            ],
            solve: (vars) => {
              if (vars.H !== null && vars.H > 0) return { pH: -Math.log10(vars.H) };
              if (vars.pH !== null) return { H: Math.pow(10, -vars.pH) };
              return null;
            },
          },
          {
            id: 'equilibrium_kc',
            name: 'Háº±ng sá»‘ cÃ¢n báº±ng Kc (A â‡Œ B)',
            formula: 'Kc = [B] / [A]',
            variables: [
              { key: 'Kc', label: 'Háº±ng sá»‘ cÃ¢n báº±ng Kc', unit: '' },
              { key: 'B', label: 'Ná»“ng Ä‘á»™ sáº£n pháº©m [B] (mol/L)', unit: 'mol/L' },
              { key: 'A', label: 'Ná»“ng Ä‘á»™ cháº¥t pháº£n á»©ng [A] (mol/L)', unit: 'mol/L' },
            ],
            solve: (vars) => {
              if (vars.B !== null && vars.A !== null) return { Kc: vars.B / vars.A };
              if (vars.Kc !== null && vars.A !== null) return { B: vars.Kc * vars.A };
              if (vars.Kc !== null && vars.B !== null) return { A: vars.B / vars.Kc };
              return null;
            },
          },
        ],
      },
      {
        name: 'Äiá»‡n phÃ¢n',
        formulas: [
          {
            id: 'faraday',
            name: 'Äá»‹nh luáº­t Faraday',
            formula: 'm = (A Ã— I Ã— t) / (n Ã— F)',
            variables: [
              { key: 'm', label: 'Khá»‘i lÆ°á»£ng cháº¥t (g)', unit: 'g' },
              { key: 'A', label: 'Khá»‘i lÆ°á»£ng mol nguyÃªn tá»­ (g/mol)', unit: 'g/mol' },
              { key: 'I', label: 'CÆ°á»ng Ä‘á»™ dÃ²ng Ä‘iá»‡n (A)', unit: 'A' },
              { key: 't', label: 'Thá»i gian (s)', unit: 's' },
              { key: 'n', label: 'Sá»‘ electron trao Ä‘á»•i', unit: '' },
            ],
            solve: (vars) => {
              const F = 96500;
              if (vars.A !== null && vars.I !== null && vars.t !== null && vars.n !== null)
                return { m: (vars.A * vars.I * vars.t) / (vars.n * F) };
              if (vars.m !== null && vars.A !== null && vars.I !== null && vars.n !== null)
                return { t: (vars.m * vars.n * F) / (vars.A * vars.I) };
              if (vars.m !== null && vars.A !== null && vars.t !== null && vars.n !== null)
                return { I: (vars.m * vars.n * F) / (vars.A * vars.t) };
              return null;
            },
          },
        ],
      },
    ],
  },
};

/** CÃ´ng thá»©c nhanh hay dÃ¹ng nháº¥t - hiá»ƒn thá»‹ máº·c Ä‘á»‹nh */
export const QUICK_FORMULAS = [
  { id: 'mol_mass', label: 'n = m/M', desc: 'TÃ­nh mol tá»« khá»‘i lÆ°á»£ng' },
  { id: 'mol_volume', label: 'n = V/22,4', desc: 'TÃ­nh mol tá»« thá»ƒ tÃ­ch khÃ­ Ä‘ktc' },
  { id: 'mass_from_mol', label: 'm = n Ã— M', desc: 'TÃ­nh khá»‘i lÆ°á»£ng cháº¥t' },
  { id: 'volume_gas', label: 'V = n Ã— 22,4', desc: 'Thá»ƒ tÃ­ch khÃ­ á»Ÿ Ä‘ktc' },
  { id: 'concentration_percent', label: 'C% = mct/mdd Ã— 100', desc: 'Ná»“ng Ä‘á»™ pháº§n trÄƒm' },
  { id: 'concentration_mol', label: 'Câ‚˜ = n/V', desc: 'Ná»“ng Ä‘á»™ mol' },
  { id: 'mol_particles', label: 'N = n Ã— Nâ‚', desc: 'Sá»‘ háº¡t' },
  { id: 'yield', label: 'H% = thá»±c táº¿/lÃ½ thuyáº¿t Ã— 100', desc: 'Hiá»‡u suáº¥t pháº£n á»©ng' },
];

/** Äá»•i Ä‘Æ¡n vá»‹ thÆ°á»ng gáº·p */
export const UNIT_CONVERSIONS = [
  { from: '1 L', to: '1000 mL' },
  { from: '1 mL', to: '0,001 L' },
  { from: '1 kg', to: '1000 g' },
  { from: '1 g', to: '1000 mg' },
  { from: 'T (K)', to: 'tÂ°C + 273' },
  { from: 'Nâ‚', to: '6,022 Ã— 10Â²Â³' },
  { from: 'R', to: '0,0821 LÂ·atm/(molÂ·K)' },
  { from: 'F', to: '96500 C/mol' },
];

