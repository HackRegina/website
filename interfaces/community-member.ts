export interface ICommunityMember {
  user_id: string;
  team_id: string;
  username: string;
  date_created: number;
  is_primary_owner: boolean;
  is_owner: boolean;
  is_admin: boolean;
  display_name: string;
  reactions_added: number;
  days_active: number;
  is_billable_seat: boolean;
  messages_posted: number;
  date_last_active: number;
  image_original?: string;
  is_custom_image?: boolean
  color?: string
}