export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      surveys: {
        Row: {
          id: number
          created_at: string
          full_name: string
          contact_number: string
          date: string
          age: number
          likes_pizza: boolean
          likes_pasta: boolean
          likes_papAndWors: boolean
          likes_chickenStirFry: boolean
          rating_eatOut: number
          rating_watchMovies: number
          rating_watchTV: number
          rating_listenRadio: number
        }
        Insert: {
          id?: number
          created_at?: string
          full_name: string
          contact_number: string
          date: string
          age: number
          likes_pizza: boolean
          likes_pasta: boolean
          likes_papAndWors: boolean
          likes_chickenStirFry: boolean
          rating_eatOut: number
          rating_watchMovies: number
          rating_watchTV: number
          rating_listenRadio: number
        }
        Update: {
          id?: number
          created_at?: string
          full_name?: string
          contact_number?: string
          date?: string
          age?: number
          likes_pizza?: boolean
          likes_pasta?: boolean
          likes_papAndWors?: boolean
          likes_chickenStirFry?: boolean
          rating_eatOut?: number
          rating_watchMovies?: number
          rating_watchTV?: number
          rating_listenRadio?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}