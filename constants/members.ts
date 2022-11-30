import MembersJSON from '../data/members.json'
import { ICommunityMember } from '../interfaces/community-member'

// pulled from Slack
// eventually call:
// https://hackregina.slack.com/api/admin.analytics.getMemberAnalytics?_x_id=d0802cb2-1669773794.041&slack_route=T59Q6UULC&_x_version_ts=no-version&fp=d6
export const CommunityMembers: ICommunityMember[] = MembersJSON.member_activity