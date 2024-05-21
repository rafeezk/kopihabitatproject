import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://dqizsbdroeoxojlvdoex.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxaXpzYmRyb2VveG9qbHZkb2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk1MDE1ODcsImV4cCI6MjAxNTA3NzU4N30.7cPwm0OK28AddLf9kdeTsI3cl5cJBCIdS3q2TuTNeRc"
);
