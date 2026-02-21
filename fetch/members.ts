import { type UsersListResponse, WebClient } from '@slack/web-api';

const token = process.env.SLACK_TOKEN;

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
  color?: string;
}

export interface MemberResponse {
  members: ICommunityMember[];
  cursor: string | null;
}

type FetchMembersRequest = {
  cursor?: string;
};

export const fetchMembers = async ({ cursor }: FetchMembersRequest = {}) => {
  if (!token) return { members: [], cursor: null };
  const web = new WebClient(token);
  const { members = [], response_metadata: meta }: UsersListResponse = await web.users.list({
    limit: 100,
    cursor,
  });
  return {
    members: members.map(
      (member): ICommunityMember => ({
        user_id: member.id || '',
        team_id: member.team_id || '',
        username: member.name || '',
        is_primary_owner: !!member.is_primary_owner,
        is_owner: !!member.is_owner,
        is_admin: !!member.is_admin,
        display_name: member.real_name || '',
        image_1024: member?.profile?.image_1024 || '',
        image_192: member?.profile?.image_192 || '',
        image_24: member?.profile?.image_24 || '',
        image_32: member?.profile?.image_32 || '',
        image_48: member?.profile?.image_48 || '',
        image_512: member?.profile?.image_512 || '',
        image_72: member?.profile?.image_72 || '',
        image_original: member?.profile?.image_original || '',
        color: member.color || '',
      }),
    ),
    cursor: meta?.next_cursor || null,
  };
};
