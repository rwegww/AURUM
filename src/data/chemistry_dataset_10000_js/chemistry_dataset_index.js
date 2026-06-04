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
    "Dá»¯ liá»‡u má»Ÿ rá»™ng tá»« knowledge base gá»‘c cá»§a ngÆ°á»i dÃ¹ng.",
    "Bao gá»“m cÃ¢u há»i chÃ­nh quy, vÄƒn nÃ³i, khÃ´ng dáº¥u, há»i ngáº¯n, há»i Ã´n táº­p vÃ  chÃ o há»i cÆ¡ báº£n.",
    "CÃ³ thÃªm ion, hÃ³a trá»‹, sá»‘ oxi hÃ³a vÃ  cÃ¡c máº«u tá»« chá»‘i ná»™i dung nguy hiá»ƒm."
  ]
};

export const CHEMISTRY_DATASET = [
  ...CHEMISTRY_DATASET_PART_1,
  ...CHEMISTRY_DATASET_PART_2,
  ...CHEMISTRY_DATASET_PART_3,
  ...CHEMISTRY_DATASET_PART_4,
  ...CHEMISTRY_DATASET_PART_5
];

