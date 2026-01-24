/**
 * User type (basic info, no permissions - we don't need them for list view)
 */
export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_active: boolean;
  is_root: boolean;
  tenant_id: string;
  created_at: string;
  updated_at: string;
};
