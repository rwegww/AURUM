import dotenv from 'dotenv';

dotenv.config({ path: ['.env.local', '.env'] });

const expectedTables = [
  'nguoi_dung',
  'khoi',
  'nhiem_vu',
  'nhiem_vu_nguoi_dung',
  'hoat_dong_nguoi_dung',
  'tien_do_nguoi_dung',
  'ghi_chu',
  'hoc_lieu',
  'phan_hoi_hoc_lieu',
  'phan_hoi',
  'bai_hoc',
  'thao_luan',
  'lop',
  'thanh_vien_lop',
  'bai_dang_lop',
  'lich_lop',
  'bai_nop',
  'hoa_chat',
  'phan_ung',
  'cau_hoi_dau',
  'phong_dau',
  'nguoi_choi',
  'tra_loi_vong',
  'lich_su_dau',
];

const oldBusinessTables = [
  'users',
  'grade_levels',
  'missions',
  'user_missions',
  'user_activities',
  'user_progress',
  'user_notes',
  'materials',
  'material_feedback',
  'feedback',
  'lessons',
  'lesson_discussions',
  'classes',
  'class_members',
  'class_posts',
  'class_schedules',
  'class_assignment_submissions',
  'lab_chemicals',
  'lab_reactions',
  'balancing_questions',
  'arena_questions',
  'arena_rooms',
  'arena_room_players',
  'arena_round_answers',
  'arena_match_history',
];

const expectedColumns = {
  nguoi_dung: [
    'diem_kinh_nghiem',
    'cap_do',
    'thong_ke_dau',
    'phut_hoat_dong',
    'hoat_dong_cuoi_luc',
    'bi_khoa',
    'so_ngay_chuoi',
    'ke_hoach_hoc',
  ],
  khoi: ['ten'],
  nhiem_vu: ['tieu_de', 'mo_ta', 'loai_hanh_dong', 'so_luong_muc_tieu', 'thuong_xp', 'bieu_tuong'],
  nhiem_vu_nguoi_dung: ['nguoi_dung_id', 'nhiem_vu_id', 'so_luong_hien_tai', 'da_hoan_thanh', 'da_nhan'],
  hoat_dong_nguoi_dung: ['nguoi_dung_id', 'loai_hanh_dong', 'thong_tin_bo_sung', 'mo_ta'],
  tien_do_nguoi_dung: ['nguoi_dung_id', 'loai_tien_do', 'doi_tuong_id', 'noi_dung_tien_do'],
  ghi_chu: ['nguoi_dung_id', 'bai_hoc_id', 'noi_dung'],
  hoc_lieu: ['tieu_de', 'mo_ta', 'danh_muc', 'luot_xem', 'luot_tai', 'nguoi_tao_id'],
  phan_hoi_hoc_lieu: ['hoc_lieu_id', 'nguoi_dung_id', 'noi_dung', 'danh_gia', 'noi_dung_tra_loi'],
  phan_hoi: ['nguoi_dung_id', 'noi_dung', 'da_duyet', 'thong_tin_bo_sung'],
  bai_hoc: ['khoi_id', 'chuong_trinh_id', 'tieu_de', 'chuong', 'thu_tu', 'module_ly_thuyet', 'module_video', 'cau_do'],
  thao_luan: ['bai_hoc_id', 'nguoi_dung_id', 'noi_dung', 'cha_id', 'luot_thich'],
  lop: ['ten', 'khoi_id', 'giao_vien_id', 'mo_ta', 'ma_lop'],
  thanh_vien_lop: ['lop_id', 'hoc_sinh_id', 'tham_gia_luc'],
  bai_dang_lop: ['lop_id', 'tac_gia_id', 'noi_dung', 'han_nop', 'hoc_sinh_nhan_id', 'cau_hoi'],
  lich_lop: ['lop_id', 'tieu_de', 'bat_dau_luc', 'ket_thuc_luc'],
  bai_nop: ['bai_dang_id', 'hoc_sinh_id', 'diem', 'phan_hoi_giao_vien', 'nop_luc', 'cau_tra_loi'],
  hoa_chat: ['cong_thuc', 'ten', 'trang_thai_vat_chat', 'mau_sac', 'danh_muc', 'la_chat_khoi_dau'],
  phan_ung: ['ten', 'phuong_trinh', 'chat_tham_gia', 'san_pham', 'khoi_id', 'danh_muc', 'dieu_kien'],
  cau_hoi_dau: ['khoi_id', 'do_kho', 'cau_hoi', 'lua_chon', 'chi_so_dap_an_dung', 'diem', 'loai_game', 'noi_dung_game'],
  phong_dau: ['ten', 'chu_phong_id', 'che_do', 'do_kho', 'so_nguoi_toi_da', 'so_nguoi_hien_tai', 'danh_sach_cau_hoi_id'],
  nguoi_choi: ['phong_dau_id', 'nguoi_dung_id', 'so_cau_dung', 'vong_da_tra_loi', 'tham_gia_luc', 'xem_cuoi_luc'],
  tra_loi_vong: ['phong_dau_id', 'cau_hoi_id', 'nguoi_dung_id', 'thu_tu_vong', 'noi_dung_tra_loi', 'dung', 'diem_duoc_cong'],
  lich_su_dau: ['nguoi_dung_id', 'phong_dau_id', 'ten_doi_thu', 'ket_qua', 'diem', 'diem_thay_doi', 'dau_luc'],
};

const getCredentials = () => {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL and service role/anon key.');
  }

  return { url: url.replace(/\/$/, ''), key };
};

const request = async (path, { method = 'GET', prefer } = {}) => {
  const { url, key } = getCredentials();
  return fetch(`${url}${path}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      ...(prefer ? { Prefer: prefer } : {}),
    },
  });
};

const countRows = async (table) => {
  const response = await request(`/rest/v1/${table}?select=*`, {
    method: 'HEAD',
    prefer: 'count=exact',
  });
  if (!response.ok) return { ok: false, status: response.status, count: null };
  const range = response.headers.get('content-range') || '';
  return {
    ok: true,
    status: response.status,
    count: range.includes('/') ? Number(range.split('/').pop()) : null,
  };
};

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const propertiesOf = (definitions, table) => definitions[table]?.properties || {};

const main = async () => {
  const schemaResponse = await request('/rest/v1/');
  assert(schemaResponse.ok, `OpenAPI schema fetch failed: ${schemaResponse.status}`);
  const schema = await schemaResponse.json();
  const definitions = schema.definitions || schema.components?.schemas || {};
  const paths = Object.keys(schema.paths || {});

  for (const table of expectedTables) {
    assert(definitions[table], `Expected public.${table} to exist.`);
  }

  for (const table of oldBusinessTables) {
    assert(!definitions[table], `Expected old business table public.${table} to be renamed.`);
  }

  for (const [table, columns] of Object.entries(expectedColumns)) {
    const properties = propertiesOf(definitions, table);
    for (const column of columns) {
      assert(properties[column], `Expected ${table}.${column} to exist.`);
    }
  }

  assert(!propertiesOf(definitions, 'lop').name, 'Expected lop.name to be renamed to lop.ten.');
  assert(!propertiesOf(definitions, 'bai_hoc').title, 'Expected bai_hoc.title to be renamed to bai_hoc.tieu_de.');
  assert(!propertiesOf(definitions, 'phan_hoi').message, 'Expected phan_hoi.message to be renamed to phan_hoi.noi_dung.');
  assert(!propertiesOf(definitions, 'phong_dau').current_players, 'Expected phong_dau.current_players to be renamed.');
  assert(!propertiesOf(definitions, 'cau_hoi_dau').payload, 'Expected cau_hoi_dau.payload to be renamed.');

  const rowChecks = ['nguoi_dung', 'bai_hoc', 'hoa_chat', 'phan_ung'];
  for (const table of rowChecks) {
    const result = await countRows(table);
    assert(result.ok, `Could not count rows for ${table}: ${result.status}`);
    assert((result.count ?? 0) > 0, `Expected ${table} to keep existing rows.`);
  }

  assert(paths.includes('/rpc/claim_mission_reward'), 'Expected claim_mission_reward RPC to be exposed.');
  assert(paths.includes('/rpc/increment_likes'), 'Expected increment_likes RPC to be exposed.');
  assert(paths.includes('/rpc/increment_material_view'), 'Expected increment_material_view RPC to be exposed.');
  assert(paths.includes('/rpc/create_arena_room'), 'Expected create_arena_room RPC to be exposed.');
  assert(paths.includes('/rpc/join_arena_room'), 'Expected join_arena_room RPC to be exposed.');
  assert(paths.includes('/rpc/leave_arena_room'), 'Expected leave_arena_room RPC to be exposed.');
  assert(paths.includes('/rpc/start_arena_room'), 'Expected start_arena_room RPC to be exposed.');

  console.log('Vietnamese business schema validation passed.');
};

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
