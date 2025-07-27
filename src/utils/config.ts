import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';

export const url = 'https://icmmdaacjaowtklhlokt.supabase.co';
export const anonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljbW1kYWFjamFvd3RrbGhsb2t0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NjM1ODksImV4cCI6MjA2OTAzOTU4OX0.20PXhiszMyEDaslY10TpZ97QMokNNf7LTAzGtYJvIiE';
export const roleService =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljbW1kYWFjamFvd3RrbGhsb2t0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQ2MzU4OSwiZXhwIjoyMDY5MDM5NTg5fQ.JO9HlDfauzx1rArYtMKMecBZ3_KiDJeULhDFFHbORfU';

// Initialize the Supabase client
export const supabase = createClient(url, roleService, {});
