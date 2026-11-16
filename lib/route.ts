export const routes = {
  home: () => '/',
  events: () => '/events',
  admin: {
    dashboard: () => '/admin',
    event: (id: string) => `/admin/events/${id}`,
    login: () => '/admin/login',
  },
  techmap: {
    list: () => '/techmap',
    technologies: () => '/techmap?view=technologies',
    companies: ({
      technologies,
      company,
    }: { technologies?: string[]; company?: string } = {}) => {
      const params = new URLSearchParams({ view: 'companies' });
      if (technologies) {
        for (const t of technologies) params.append('technologies', t);
      }
      if (company) params.append('company', company);
      return `/techmap?${params.toString()}`;
    },
  },
};
