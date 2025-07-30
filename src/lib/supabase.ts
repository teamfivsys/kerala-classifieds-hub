import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database schema types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          district: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          district?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          district?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          icon: string
          description: string | null
          is_active: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          icon: string
          description?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          icon?: string
          description?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      locations: {
        Row: {
          id: string
          district: string
          city: string
          state: string
          created_at: string
        }
        Insert: {
          id?: string
          district: string
          city: string
          state?: string
          created_at?: string
        }
        Update: {
          id?: string
          district?: string
          city?: string
          state?: string
          created_at?: string
        }
      }
      ads: {
        Row: {
          id: string
          title: string
          description: string
          price: number | null
          price_type: 'fixed' | 'negotiable' | 'on_request'
          category_id: string
          location_id: string
          user_id: string
          images: string[]
          contact_phone: string | null
          contact_email: string | null
          status: 'pending' | 'approved' | 'rejected' | 'expired'
          is_featured: boolean
          featured_until: string | null
          view_count: number
          created_at: string
          updated_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          price?: number | null
          price_type?: 'fixed' | 'negotiable' | 'on_request'
          category_id: string
          location_id: string
          user_id: string
          images?: string[]
          contact_phone?: string | null
          contact_email?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'expired'
          is_featured?: boolean
          featured_until?: string | null
          view_count?: number
          created_at?: string
          updated_at?: string
          expires_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number | null
          price_type?: 'fixed' | 'negotiable' | 'on_request'
          category_id?: string
          location_id?: string
          user_id?: string
          images?: string[]
          contact_phone?: string | null
          contact_email?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'expired'
          is_featured?: boolean
          featured_until?: string | null
          view_count?: number
          created_at?: string
          updated_at?: string
          expires_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          ad_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          ad_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          ad_id?: string
          created_at?: string
        }
      }
    }
  }
}