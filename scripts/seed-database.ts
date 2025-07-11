import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const sampleClients = [
  {
    name: 'John Smith',
    email: 'john.smith@techstart.com',
    phone: '+1 (555) 123-4567',
    company: 'TechStart Inc',
    status: 'active',
    notes: 'Q4 tax returns due next month. Client is very responsive.',
    created_at: new Date('2024-01-15').toISOString()
  },
  {
    name: 'Maria Garcia',
    email: 'maria.garcia@global-solutions.com',
    phone: '+1 (555) 234-5678',
    company: 'Global Solutions Ltd',
    status: 'active',
    notes: 'Annual audit completed. All documents submitted on time.',
    created_at: new Date('2024-01-20').toISOString()
  },
  {
    name: 'David Kim',
    email: 'david.kim@retail-partners.com',
    phone: '+1 (555) 345-6789',
    company: 'Retail Partners LLC',
    status: 'pending',
    notes: 'New client onboarding in progress. Initial consultation completed.',
    created_at: new Date('2024-02-01').toISOString()
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah.wilson@service-co.com',
    phone: '+1 (555) 456-7890',
    company: 'Service Co',
    status: 'active',
    notes:
      'Payroll tax filing due this week. Client needs assistance with new software.',
    created_at: new Date('2024-02-05').toISOString()
  },
  {
    name: 'Michael Brown',
    email: 'michael.brown@innovate-corp.com',
    phone: '+1 (555) 567-8901',
    company: 'Innovate Corp',
    status: 'inactive',
    notes: 'Client on hold due to restructuring. Will resume services in Q2.',
    created_at: new Date('2024-01-10').toISOString()
  },
  {
    name: 'Emily Davis',
    email: 'emily.davis@startup-ventures.com',
    phone: '+1 (555) 678-9012',
    company: 'Startup Ventures',
    status: 'active',
    notes: 'Series A funding completed. Need to update tax structure.',
    created_at: new Date('2024-02-10').toISOString()
  },
  {
    name: 'Robert Johnson',
    email: 'robert.johnson@manufacturing-pro.com',
    phone: '+1 (555) 789-0123',
    company: 'Manufacturing Pro',
    status: 'pending',
    notes:
      'Initial consultation scheduled. Client interested in cost optimization.',
    created_at: new Date('2024-02-15').toISOString()
  },
  {
    name: 'Jennifer Lee',
    email: 'jennifer.lee@consulting-group.com',
    phone: '+1 (555) 890-1234',
    company: 'Consulting Group',
    status: 'active',
    notes: 'Quarterly review completed. Client satisfied with services.',
    created_at: new Date('2024-01-25').toISOString()
  },
  {
    name: 'Thomas Anderson',
    email: 'thomas.anderson@digital-agency.com',
    phone: '+1 (555) 901-2345',
    company: 'Digital Agency',
    status: 'active',
    notes: 'Year-end closing in progress. All documents received.',
    created_at: new Date('2024-01-30').toISOString()
  },
  {
    name: 'Lisa Thompson',
    email: 'lisa.thompson@healthcare-solutions.com',
    phone: '+1 (555) 012-3456',
    company: 'Healthcare Solutions',
    status: 'inactive',
    notes: 'Client temporarily suspended services due to budget constraints.',
    created_at: new Date('2024-01-05').toISOString()
  }
];

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // First, clear existing data
    const { error: deleteError } = await supabaseAdmin
      .from('clients')
      .delete()
      .neq('client_id', 0); // This will match all rows, since client_id is never 0

    if (deleteError) {
      console.log('Error clearing existing data:', deleteError.message);
    } else {
      console.log('Cleared existing client data.');
    }

    // Insert sample clients
    const { data, error } = await supabaseAdmin
      .from('clients')
      .insert(sampleClients)
      .select();

    if (error) {
      console.error('Error inserting sample data:', error);
      return;
    }

    console.log(`Successfully inserted ${data?.length || 0} sample clients.`);
    console.log('Database seeding completed!');

    // Display the inserted data
    console.log('\nInserted clients:');
    data?.forEach((client, index) => {
      console.log(
        `${index + 1}. ${client.name || 'N/A'} - ${client.company || 'N/A'} (${client.status})`
      );
    });
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seeding function
seedDatabase();
