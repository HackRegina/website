export interface ITeamMemberLink {
  type: 'github' | 'twitter' | 'linkedin' | 'website' | 'other'
  url: string
}

export class TeamMemberLink implements ITeamMemberLink {
  constructor({ type, url }: Partial<ITeamMemberLink>) {
    this.type = type || 'other'
    this.url = url || '#'
  }
  type: 'github' | 'twitter' | 'linkedin' | 'website' | 'other'
  url: string
}

export interface ITeamMember {
  name: string
  bio: string
  links: ITeamMemberLink[]
}

export class TeamMember implements ITeamMember {
  constructor({ name, bio, links }: Partial<ITeamMember>) {
    this.name = name || ''
    this.bio = bio || ''
    this.links = links || []
  }
  name: string
  bio: string
  links: ITeamMemberLink[]
}
