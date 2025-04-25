import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://apkwfdjpuonvgcukihla.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwa3dmZGpwdW9udmdjdWtpaGxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1OTI4MzIsImV4cCI6MjA2MTE2ODgzMn0._29-Zo2nk0GaNEkRPpOH1iVXTx4pPaVANDI2Oshb4rA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);