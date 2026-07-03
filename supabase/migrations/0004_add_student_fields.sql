-- Add new student data columns to support simplified student registry
ALTER TABLE students ADD COLUMN IF NOT EXISTS student_number TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS contact TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS parent_contact TEXT;

-- Relax status constraint to allow Left, On hold, Completed, Finished
ALTER TABLE students DROP CONSTRAINT IF EXISTS students_status_check;
ALTER TABLE students ADD CONSTRAINT students_status_check CHECK (
  status IN ('active', 'inactive', 'Left', 'On hold', 'Completed', 'Finished')
);
