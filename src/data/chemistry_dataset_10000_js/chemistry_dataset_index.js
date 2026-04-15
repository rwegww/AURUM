import { CHEMISTRY_DATASET_PART_1 } from './chemistry_dataset_part1.js';
import { CHEMISTRY_DATASET_PART_2 } from './chemistry_dataset_part2.js';
import { CHEMISTRY_DATASET_PART_3 } from './chemistry_dataset_part3.js';
import { CHEMISTRY_DATASET_PART_4 } from './chemistry_dataset_part4.js';
import { CHEMISTRY_DATASET_PART_5 } from './chemistry_dataset_part5.js';

export const CHEMISTRY_DATASET_META = {
  "datasetName": "Chemistry Spoken Knowledge Dataset",
  "version": "1.0.0",
  "totalRecords": 10000,
  "parts": 5,
  "recordsPerPart": 2000,
  "sourceFile": "Pasted code(3).js",
  "categoryCounts": {
    "concept_query": 5704,
    "concept_overview": 840,
    "concept_formula": 128,
    "concept_compare": 300,
    "learning_path": 320,
    "ion_query": 420,
    "valency_query": 430,
    "oxidation_query": 180,
    "safety_refusal": 250,
    "greeting": 196,
    "tutor_support": 1232
  },
  "notes": [
    "Dữ liệu mở rộng từ knowledge base gốc của người dùng.",
    "Bao gồm câu hỏi chính quy, văn nói, không dấu, hỏi ngắn, hỏi ôn tập và chào hỏi cơ bản.",
    "Có thêm ion, hóa trị, số oxi hóa và các mẫu từ chối nội dung nguy hiểm."
  ]
};

export const CHEMISTRY_DATASET = [
  ...CHEMISTRY_DATASET_PART_1,
  ...CHEMISTRY_DATASET_PART_2,
  ...CHEMISTRY_DATASET_PART_3,
  ...CHEMISTRY_DATASET_PART_4,
  ...CHEMISTRY_DATASET_PART_5
];
