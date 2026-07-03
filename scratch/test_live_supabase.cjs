const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fzlrqxfzcjhwlpziwcwu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6bHJxeGZ6Y2pod2xweml3Y3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwNjIxNjcsImV4cCI6MjA5ODYzODE2N30.73HJ9QE9JvZJyax-sZTSW39AVVceJY41BhW1KHUyZLg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log('Testing connection to Supabase...');
  try {
    const { data, error } = await supabase.from('groups').select('*');
    if (error) {
      console.error('Error fetching groups:', error);
    } else {
      console.log('Success! Groups count:', data.length);
      console.log('Data:', data);
    }
  } catch (err) {
    console.error('Exception caught:', err);
  }
}

run();
