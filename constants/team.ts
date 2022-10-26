import { ITeamMember, TeamMember, TeamMemberLink } from '../interfaces/team-member'

export const TeamMembers: ITeamMember[] = [
  new TeamMember({
    name: 'David Crossman',
    bio: 'Founder, Explorer, Lame Jokester. I am passionate about building impactful products. I lead efforts at both HackRegina and Citrus. I am not good at sports.',
    links: [
      new TeamMemberLink({
        type: 'github',
        url: 'https://github.com/DJCrossman',
      }),
      new TeamMemberLink({
        type: 'twitter',
        url: 'https://www.twitter.com/DJCrossman',
      }),
      new TeamMemberLink({
        type: 'linkedin',
        url: 'https://www.linkedin.com/in/DJCrossman',
      }),
    ],
  }),
]
