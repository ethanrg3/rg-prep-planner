-- Default tutor record for development (auth skipped)
-- This allows creating students without a real authenticated user

INSERT INTO tutors (id, auth_user_id, full_name, email)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Default Tutor',
  'tutor@rgprep.com'
);
