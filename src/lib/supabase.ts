import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client with service role
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Database types
export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          company: string;
          status: 'active' | 'inactive' | 'pending';
          created_at: string;
          updated_at: string;
          assigned_to: string;
          notes: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string;
          company?: string;
          status?: 'active' | 'inactive' | 'pending';
          created_at?: string;
          updated_at?: string;
          assigned_to?: string;
          notes?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          company?: string;
          status?: 'active' | 'inactive' | 'pending';
          created_at?: string;
          updated_at?: string;
          assigned_to?: string;
          notes?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          title: string;
          description: string;
          file_url: string;
          file_type: string;
          file_size: number;
          client_id: string;
          created_by: string;
          created_at: string;
          updated_at: string;
          status: 'draft' | 'published' | 'archived';
          tags: string[];
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          file_url: string;
          file_type: string;
          file_size: number;
          client_id?: string;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
          status?: 'draft' | 'published' | 'archived';
          tags?: string[];
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          file_url?: string;
          file_type?: string;
          file_size?: number;
          client_id?: string;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
          status?: 'draft' | 'published' | 'archived';
          tags?: string[];
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string;
          status: 'todo' | 'in_progress' | 'review' | 'completed';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          assigned_to: string;
          created_by: string;
          client_id?: string;
          due_date: string;
          created_at: string;
          updated_at: string;
          tags: string[];
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          status?: 'todo' | 'in_progress' | 'review' | 'completed';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          assigned_to?: string;
          created_by?: string;
          client_id?: string;
          due_date?: string;
          created_at?: string;
          updated_at?: string;
          tags?: string[];
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          status?: 'todo' | 'in_progress' | 'review' | 'completed';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          assigned_to?: string;
          created_by?: string;
          client_id?: string;
          due_date?: string;
          created_at?: string;
          updated_at?: string;
          tags?: string[];
        };
      };
      messages: {
        Row: {
          id: string;
          subject: string;
          content: string;
          sender_id: string;
          recipient_id: string;
          client_id?: string;
          read: boolean;
          created_at: string;
          updated_at: string;
          priority: 'low' | 'medium' | 'high';
        };
        Insert: {
          id?: string;
          subject: string;
          content: string;
          sender_id?: string;
          recipient_id: string;
          client_id?: string;
          read?: boolean;
          created_at?: string;
          updated_at?: string;
          priority?: 'low' | 'medium' | 'high';
        };
        Update: {
          id?: string;
          subject?: string;
          content?: string;
          sender_id?: string;
          recipient_id?: string;
          client_id?: string;
          read?: boolean;
          created_at?: string;
          updated_at?: string;
          priority?: 'low' | 'medium' | 'high';
        };
      };
      deadlines: {
        Row: {
          id: string;
          title: string;
          description: string;
          due_date: string;
          client_id?: string;
          task_id?: string;
          created_by: string;
          assigned_to: string;
          status: 'pending' | 'completed' | 'overdue';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          due_date: string;
          client_id?: string;
          task_id?: string;
          created_by?: string;
          assigned_to?: string;
          status?: 'pending' | 'completed' | 'overdue';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          due_date?: string;
          client_id?: string;
          task_id?: string;
          created_by?: string;
          assigned_to?: string;
          status?: 'pending' | 'completed' | 'overdue';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          created_at?: string;
          updated_at?: string;
        };
      };
      financial_records: {
        Row: {
          id: string;
          type: 'income' | 'expense' | 'invoice' | 'payment';
          amount: number;
          description: string;
          client_id?: string;
          invoice_number?: string;
          due_date?: string;
          paid_date?: string;
          status: 'pending' | 'paid' | 'overdue' | 'cancelled';
          created_by: string;
          created_at: string;
          updated_at: string;
          category: string;
        };
        Insert: {
          id?: string;
          type: 'income' | 'expense' | 'invoice' | 'payment';
          amount: number;
          description: string;
          client_id?: string;
          invoice_number?: string;
          due_date?: string;
          paid_date?: string;
          status?: 'pending' | 'paid' | 'overdue' | 'cancelled';
          created_by?: string;
          created_at?: string;
          updated_at?: string;
          category: string;
        };
        Update: {
          id?: string;
          type?: 'income' | 'expense' | 'invoice' | 'payment';
          amount?: number;
          description?: string;
          client_id?: string;
          invoice_number?: string;
          due_date?: string;
          paid_date?: string;
          status?: 'pending' | 'paid' | 'overdue' | 'cancelled';
          created_by?: string;
          created_at?: string;
          updated_at?: string;
          category?: string;
        };
      };
      firm_settings: {
        Row: {
          id: string;
          setting_key: string;
          setting_value: string;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          setting_key: string;
          setting_value: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          setting_key?: string;
          setting_value?: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
