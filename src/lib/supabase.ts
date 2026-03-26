import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cfvymtfxazxzwmlvgkbu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmdnltdGZ4YXp4endtbHZna2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0ODIyMzYsImV4cCI6MjA5MDA1ODIzNn0.B7yqjuFhmTOpIlsSl5RsMLxTaNiktiXuKlcoYia-ymA'; // Using legacy anon key as it's common in these projects

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
