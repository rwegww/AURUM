-- Finish normalizing business constraint and index names after table/column renames.
-- This is metadata-only and does not change data or constraint definitions.

BEGIN;

DO $$
DECLARE
  item record;
  next_name text;
BEGIN
  FOR item IN
    SELECT con.conname, rel.relname AS table_name
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace n ON n.oid = rel.relnamespace
    WHERE n.nspname = 'public'
  LOOP
    next_name := item.conname;
    next_name := replace(next_name, 'correct_option_index', 'chi_so_dap_an_dung');
    next_name := replace(next_name, 'time_limit_seconds', 'gioi_han_giay');
    next_name := replace(next_name, 'time_limit', 'gioi_han');
    next_name := replace(next_name, 'game_type', 'loai_game');
    next_name := replace(next_name, 'progress_type', 'loai_tien_do');
    next_name := replace(next_name, 'parent_id', 'cha_id');
    next_name := replace(next_name, 'round_index', 'thu_tu_vong');
    next_name := replace(next_name, 'difficulty', 'do_kho');
    next_name := replace(next_name, 'formula', 'cong_thuc');
    next_name := replace(next_name, 'category', 'danh_muc');
    next_name := replace(next_name, 'rating', 'danh_gia');
    next_name := replace(next_name, 'result', 'ket_qua');
    next_name := replace(next_name, 'active', 'dang_hoat_dong');
    next_name := replace(next_name, 'state', 'trang_thai_vat_chat');
    next_name := replace(next_name, 'code', 'ma_lop');

    IF length(next_name) > 60 THEN
      next_name := left(next_name, 52) || '_' || substr(md5(next_name), 1, 7);
    END IF;

    IF next_name <> item.conname
       AND NOT EXISTS (
         SELECT 1
         FROM pg_constraint
         WHERE connamespace = 'public'::regnamespace
           AND conname = next_name
       ) THEN
      EXECUTE format('ALTER TABLE public.%I RENAME CONSTRAINT %I TO %I', item.table_name, item.conname, next_name);
    END IF;
  END LOOP;
END $$;

DO $$
DECLARE
  item record;
  next_name text;
BEGIN
  FOR item IN
    SELECT i.relname AS index_name
    FROM pg_class i
    JOIN pg_namespace n ON n.oid = i.relnamespace
    WHERE n.nspname = 'public'
      AND i.relkind = 'i'
  LOOP
    next_name := item.index_name;
    next_name := replace(next_name, 'correct_option_index', 'chi_so_dap_an_dung');
    next_name := replace(next_name, 'time_limit_seconds', 'gioi_han_giay');
    next_name := replace(next_name, 'time_limit', 'gioi_han');
    next_name := replace(next_name, 'game_type', 'loai_game');
    next_name := replace(next_name, 'progress_type', 'loai_tien_do');
    next_name := replace(next_name, 'parent_id', 'cha_id');
    next_name := replace(next_name, 'round_index', 'thu_tu_vong');
    next_name := replace(next_name, 'difficulty', 'do_kho');
    next_name := replace(next_name, 'formula', 'cong_thuc');
    next_name := replace(next_name, 'category', 'danh_muc');
    next_name := replace(next_name, 'rating', 'danh_gia');
    next_name := replace(next_name, 'result', 'ket_qua');
    next_name := replace(next_name, 'active', 'dang_hoat_dong');
    next_name := replace(next_name, 'state', 'trang_thai_vat_chat');
    next_name := replace(next_name, 'code', 'ma_lop');

    IF length(next_name) > 60 THEN
      next_name := left(next_name, 52) || '_' || substr(md5(next_name), 1, 7);
    END IF;

    IF next_name <> item.index_name
       AND to_regclass('public.' || quote_ident(next_name)) IS NULL THEN
      EXECUTE format('ALTER INDEX public.%I RENAME TO %I', item.index_name, next_name);
    END IF;
  END LOOP;
END $$;

NOTIFY pgrst, 'reload schema';

COMMIT;
