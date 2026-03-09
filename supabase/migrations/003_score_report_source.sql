-- Add report source classification for score reports
ALTER TABLE score_reports
ADD COLUMN report_source TEXT NOT NULL DEFAULT 'practice'
CHECK (report_source IN ('practice', 'official'));
