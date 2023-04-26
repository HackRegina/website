import { useQuery } from '@tanstack/react-query'
import { fetchOrganizations } from '../fetch/organizations'
import { IOrganization } from '../interfaces/organization'
import { generateQueryKey } from '../utils/generateQueryKey'

interface IFetchOrganizations {
  sponsors: IOrganization[]
  partners: IOrganization[]
}

export const useOrganizations = (): IFetchOrganizations => {
  const { data } = useQuery(
    generateQueryKey({ key: 'organizations', query: {} }),
    fetchOrganizations,
  )
  return { sponsors: data?.sponsors || [], partners: data?.partners || [] }
}
