-- SQL: Add unique constraint to balancing_questions
ALTER TABLE public.balancing_questions ADD CONSTRAINT unique_equation_string UNIQUE (equation_string);
