-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_email VARCHAR NOT NULL DEFAULT 'loja.alphatechbr@gmail.com',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin email
INSERT INTO admin_settings (admin_email) 
VALUES ('loja.alphatechbr@gmail.com')
ON CONFLICT DO NOTHING;

-- Enable realtime
alter publication supabase_realtime add table admin_settings;