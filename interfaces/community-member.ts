export interface ICommunityMember {
  user_id: string;
  team_id: string;
  username: string;
  is_primary_owner: boolean;
  is_owner: boolean;
  is_admin: boolean;
  display_name: string;
  image_1024?: string;
  image_192?: string;
  image_24?: string;
  image_32?: string;
  image_48?: string;
  image_512?: string;
  image_72?: string;
  image_original?: string;
  color?: string
}