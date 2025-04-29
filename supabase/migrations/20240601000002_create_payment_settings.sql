-- Create payment_settings table
CREATE TABLE IF NOT EXISTS payment_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  public_key VARCHAR NOT NULL DEFAULT 'pk_cxB1fS-bnOsQr8c2NIiwN61astAjC4IBJJ4bBEvrQH0nDL5G',
  private_key VARCHAR NOT NULL DEFAULT 'sk_MiPcpHOVy02JdXmEUN8OWq-bQNbn4u_D09lNNfA8LX0Q-Vo_',
  webhook_secret VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default payment settings
INSERT INTO payment_settings (public_key, private_key) 
VALUES ('pk_cxB1fS-bnOsQr8c2NIiwN61astAjC4IBJJ4bBEvrQH0nDL5G', 'sk_MiPcpHOVy02JdXmEUN8OWq-bQNbn4u_D09lNNfA8LX0Q-Vo_')
ON CONFLICT DO NOTHING;

-- Enable realtime
alter publication supabase_realtime add table payment_settings;