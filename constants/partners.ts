import OrganizationsJSON from '../data/organizations.json'
import { IOrganization } from '../interfaces/organization'

export const HackReginaPartners: IOrganization[] = OrganizationsJSON.filter(org => org.is_partner)