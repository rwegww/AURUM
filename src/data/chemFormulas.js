/**
 * Cơ sở dữ liệu công thức Hóa học - Sắp xếp theo NHÓM tính chất
 * Mỗi công thức bao gồm: tên, ký hiệu, các biến, hàm tính toán, và mô tả
 */

export const CHEM_FORMULAS = {
  basic: {
    label: 'Số mol & Khối lượng',
    icon: '⚖️',
    categories: [
      {
        name: 'Công thức tính số mol',
        formulas: [
          {
            id: 'mol_mass',
            name: 'Tính mol từ khối lượng',
            formula: 'n = m / M',
            variables: [
              { key: 'n', label: 'Số mol (mol)', unit: 'mol' },
              { key: 'm', label: 'Khối lượng chất (g)', unit: 'g' },
              { key: 'M', label: 'Khối lượng mol (g/mol)', unit: 'g/mol' },
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
            name: 'Tính mol từ thể tích khí (đktc)',
            formula: 'n = V / 22,4',
            variables: [
              { key: 'n', label: 'Số mol (mol)', unit: 'mol' },
              { key: 'V', label: 'Thể tích khí (lít)', unit: 'L' },
            ],
            solve: (vars) => {
              if (vars.V !== null) return { n: vars.V / 22.4 };
              if (vars.n !== null) return { V: vars.n * 22.4 };
              return null;
            },
          },
          {
            id: 'mol_particles',
            name: 'Tính mol từ số hạt',
            formula: 'n = N / Nₐ',
            variables: [
              { key: 'n', label: 'Số mol (mol)', unit: 'mol' },
              { key: 'N', label: 'Số hạt', unit: 'hạt' },
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
        name: 'Công thức tính khối lượng',
        formulas: [
          {
            id: 'mass_from_mol',
            name: 'Khối lượng chất',
            formula: 'm = n × M',
            variables: [
              { key: 'm', label: 'Khối lượng (g)', unit: 'g' },
              { key: 'n', label: 'Số mol (mol)', unit: 'mol' },
              { key: 'M', label: 'Khối lượng mol (g/mol)', unit: 'g/mol' },
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
    label: 'Dung dịch & Nồng độ',
    icon: '🧪',
    categories: [
      {
        name: 'Nồng độ dung dịch',
        formulas: [
          {
            id: 'concentration_percent',
            name: 'Nồng độ phần trăm',
            formula: 'C% = (mct / mdd) × 100%',
            variables: [
              { key: 'C', label: 'Nồng độ phần trăm (%)', unit: '%' },
              { key: 'mct', label: 'Khối lượng chất tan (g)', unit: 'g' },
              { key: 'mdd', label: 'Khối lượng dung dịch (g)', unit: 'g' },
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
            name: 'Nồng độ mol',
            formula: 'Cₘ = n / V',
            variables: [
              { key: 'Cm', label: 'Nồng độ mol (M)', unit: 'M' },
              { key: 'n', label: 'Số mol chất tan (mol)', unit: 'mol' },
              { key: 'V', label: 'Thể tích dung dịch (lít)', unit: 'L' },
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
            name: 'Khối lượng dung dịch',
            formula: 'mdd = mct + mdm',
            variables: [
              { key: 'mdd', label: 'Khối lượng dung dịch (g)', unit: 'g' },
              { key: 'mct', label: 'Khối lượng chất tan (g)', unit: 'g' },
              { key: 'mdm', label: 'Khối lượng dung môi (g)', unit: 'g' },
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
        name: 'Pha loãng dung dịch',
        formulas: [
          {
            id: 'dilution',
            name: 'Pha loãng dung dịch',
            formula: 'C₁V₁ = C₂V₂',
            variables: [
              { key: 'C1', label: 'Nồng độ ban đầu (M)', unit: 'M' },
              { key: 'V1', label: 'Thể tích ban đầu (mL)', unit: 'mL' },
              { key: 'C2', label: 'Nồng độ sau pha loãng (M)', unit: 'M' },
              { key: 'V2', label: 'Thể tích sau pha loãng (mL)', unit: 'mL' },
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
    label: 'Chất khí & Trạng thái',
    icon: '🌬️',
    categories: [
      {
        name: 'Thể tích & Áp suất',
        formulas: [
          {
            id: 'volume_gas',
            name: 'Thể tích khí ở đktc',
            formula: 'V = n × 22,4',
            variables: [
              { key: 'V', label: 'Thể tích (lít)', unit: 'L' },
              { key: 'n', label: 'Số mol (mol)', unit: 'mol' },
            ],
            solve: (vars) => {
              if (vars.n !== null) return { V: vars.n * 22.4 };
              if (vars.V !== null) return { n: vars.V / 22.4 };
              return null;
            },
          },
          {
            id: 'ideal_gas',
            name: 'Phương trình trạng thái khí (PV=nRT)',
            formula: 'PV = nRT',
            variables: [
              { key: 'P', label: 'Áp suất (atm)', unit: 'atm' },
              { key: 'V', label: 'Thể tích (lít)', unit: 'L' },
              { key: 'n', label: 'Số mol (mol)', unit: 'mol' },
              { key: 'T', label: 'Nhiệt độ (K)', unit: 'K' },
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
        name: 'Tỉ khối khí',
        formulas: [
          {
            id: 'density_ratio_b',
            name: 'Tỉ khối khí A so với khí B',
            formula: 'dA/B = MA / MB',
            variables: [
              { key: 'd', label: 'Tỉ khối', unit: '' },
              { key: 'MA', label: 'Khối lượng mol khí A (g/mol)', unit: 'g/mol' },
              { key: 'MB', label: 'Khối lượng mol khí B (g/mol)', unit: 'g/mol' },
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
            name: 'Tỉ khối so với không khí',
            formula: 'dA/kk = MA / 29',
            variables: [
              { key: 'd', label: 'Tỉ khối so với không khí', unit: '' },
              { key: 'MA', label: 'Khối lượng mol khí A (g/mol)', unit: 'g/mol' },
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
    label: 'Phản ứng & Hiệu suất',
    icon: '⚡',
    categories: [
      {
        name: 'Hiệu suất & Tốc độ',
        formulas: [
          {
            id: 'yield',
            name: 'Hiệu suất phản ứng',
            formula: 'H% = (thực tế / lý thuyết) × 100%',
            variables: [
              { key: 'H', label: 'Hiệu suất (%)', unit: '%' },
              { key: 'actual', label: 'Lượng thực tế', unit: '' },
              { key: 'theory', label: 'Lượng lý thuyết', unit: '' },
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
            name: 'Tốc độ phản ứng trung bình',
            formula: 'v = ΔC / Δt',
            variables: [
              { key: 'v', label: 'Tốc độ phản ứng (mol/L·s)', unit: 'mol/L·s' },
              { key: 'dC', label: 'Độ biến thiên nồng độ (mol/L)', unit: 'mol/L' },
              { key: 'dt', label: 'Độ biến thiên thời gian (s)', unit: 's' },
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
    label: 'pH & Điện hóa',
    icon: '⚛️',
    categories: [
      {
        name: 'pH & Cân bằng',
        formulas: [
          {
            id: 'ph',
            name: 'Tính pH',
            formula: 'pH = -log[H⁺]',
            variables: [
              { key: 'pH', label: 'Giá trị pH', unit: '' },
              { key: 'H', label: 'Nồng độ H⁺ (mol/L)', unit: 'mol/L' },
            ],
            solve: (vars) => {
              if (vars.H !== null && vars.H > 0) return { pH: -Math.log10(vars.H) };
              if (vars.pH !== null) return { H: Math.pow(10, -vars.pH) };
              return null;
            },
          },
          {
            id: 'equilibrium_kc',
            name: 'Hằng số cân bằng Kc (A ⇌ B)',
            formula: 'Kc = [B] / [A]',
            variables: [
              { key: 'Kc', label: 'Hằng số cân bằng Kc', unit: '' },
              { key: 'B', label: 'Nồng độ sản phẩm [B] (mol/L)', unit: 'mol/L' },
              { key: 'A', label: 'Nồng độ chất phản ứng [A] (mol/L)', unit: 'mol/L' },
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
        name: 'Điện phân',
        formulas: [
          {
            id: 'faraday',
            name: 'Định luật Faraday',
            formula: 'm = (A × I × t) / (n × F)',
            variables: [
              { key: 'm', label: 'Khối lượng chất (g)', unit: 'g' },
              { key: 'A', label: 'Khối lượng mol nguyên tử (g/mol)', unit: 'g/mol' },
              { key: 'I', label: 'Cường độ dòng điện (A)', unit: 'A' },
              { key: 't', label: 'Thời gian (s)', unit: 's' },
              { key: 'n', label: 'Số electron trao đổi', unit: '' },
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

/** Công thức nhanh hay dùng nhất - hiển thị mặc định */
export const QUICK_FORMULAS = [
  { id: 'mol_mass', label: 'n = m/M', desc: 'Tính mol từ khối lượng' },
  { id: 'mol_volume', label: 'n = V/22,4', desc: 'Tính mol từ thể tích khí đktc' },
  { id: 'mass_from_mol', label: 'm = n × M', desc: 'Tính khối lượng chất' },
  { id: 'volume_gas', label: 'V = n × 22,4', desc: 'Thể tích khí ở đktc' },
  { id: 'concentration_percent', label: 'C% = mct/mdd × 100', desc: 'Nồng độ phần trăm' },
  { id: 'concentration_mol', label: 'Cₘ = n/V', desc: 'Nồng độ mol' },
  { id: 'mol_particles', label: 'N = n × Nₐ', desc: 'Số hạt' },
  { id: 'yield', label: 'H% = thực tế/lý thuyết × 100', desc: 'Hiệu suất phản ứng' },
];

/** Đổi đơn vị thường gặp */
export const UNIT_CONVERSIONS = [
  { from: '1 L', to: '1000 mL' },
  { from: '1 mL', to: '0,001 L' },
  { from: '1 kg', to: '1000 g' },
  { from: '1 g', to: '1000 mg' },
  { from: 'T (K)', to: 't°C + 273' },
  { from: 'Nₐ', to: '6,022 × 10²³' },
  { from: 'R', to: '0,0821 L·atm/(mol·K)' },
  { from: 'F', to: '96500 C/mol' },
];
