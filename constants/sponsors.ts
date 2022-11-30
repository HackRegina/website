import OrganizationsJSON from '../data/organizations.json'
import { IOrganization } from '../interfaces/organization'

export const HackReginaSponsors: IOrganization[] = OrganizationsJSON.filter((org) => org.is_sponsor)
