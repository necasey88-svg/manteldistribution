// Minimal hand-written types matching supabase/schema.sql.
// Regenerate with `supabase gen types typescript` once the project
// is linked, and replace this file.
export interface Database {
  public: {
    Tables: {
      dealers: {
        Row: {
          id: string;
          user_id: string;
          company_name: string;
          contact_name: string;
          email: string;
          phone: string | null;
          status: "pending" | "approved" | "rejected";
          net_terms_days: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["dealers"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["dealers"]["Row"]>;
        Relationships: [];
      };
      purchase_orders: {
        Row: {
          id: string;
          dealer_id: string;
          po_number: string;
          status: "submitted" | "approved" | "in_production" | "shipped" | "cancelled";
          subtotal_cents: number;
          notes: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["purchase_orders"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["purchase_orders"]["Row"]>;
        Relationships: [];
      };
      purchase_order_line_items: {
        Row: {
          id: string;
          purchase_order_id: string;
          product_sku: string;
          product_name: string;
          qty: number;
          unit_price_cents: number;
        };
        Insert: Partial<Database["public"]["Tables"]["purchase_order_line_items"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["purchase_order_line_items"]["Row"]>;
        Relationships: [];
      };
      dealer_applications: {
        Row: {
          id: string;
          company_name: string;
          contact_name: string;
          email: string;
          phone: string | null;
          business_type: string;
          website: string | null;
          expected_volume: string | null;
          message: string | null;
          status: "new" | "reviewing" | "approved" | "declined";
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["dealer_applications"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["dealer_applications"]["Row"]>;
        Relationships: [];
      };
      products: {
        Row: {
          sku: string;
          slug: string;
          name: string;
          material: "precast" | "wood";
          collection: string;
          description: string;
          price_cents: number;
          msrp_cents: number;
          lead_time_days: number;
          dimensions: string | null;
          weight_lbs: number | null;
          finish: string[];
          min_order_qty: number;
          in_stock: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["products"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["products"]["Row"]>;
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          dealer_id: string | null;
          stripe_checkout_session_id: string | null;
          customer_email: string;
          status: "pending" | "paid" | "fulfilled" | "cancelled";
          subtotal_cents: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["orders"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["orders"]["Row"]>;
        Relationships: [];
      };
      order_line_items: {
        Row: {
          id: string;
          order_id: string;
          product_sku: string;
          product_name: string;
          qty: number;
          unit_price_cents: number;
        };
        Insert: Partial<Database["public"]["Tables"]["order_line_items"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["order_line_items"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
