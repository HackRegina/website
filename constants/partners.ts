import { IPartner, Partner, PartnerImage } from '../interfaces/partner'

export const Partners: IPartner[] = [
  new Partner({
    name: 'Innovation Place',
    url: 'http://www.innovationplace.com/',
    image: new PartnerImage({
      light:
        'https://images.ctfassets.net/yswja3mg62td/1hfkWX51TKoAq4aq8cEwwa/3617c428167741ca92db60dedf5f25c1/IP_Horizontal_w_Tagline-01.png',
    }),
  }),
  new Partner({
    name: 'Innovation Saskatchewan',
    url: 'https://innovationsask.ca/',
    image: new PartnerImage({
      light:
        'https://images.ctfassets.net/yswja3mg62td/13Z7oYSDUKDeaBodh7mM6J/b3c97abd1444bca5d746731741318f6e/Innovation-SK__1_.svg',
    }),
  }),
  new Partner({
    name: 'Cultivator',
    url: 'https://www.cultivator.ca/',
    image: new PartnerImage({
      light:
        'https://images.ctfassets.net/yswja3mg62td/X92gvElPWePjf78viWzQ4/2aff68f58407d1b0c9a376c44bb7d678/Cultivator.png',
    }),
  }),
]
