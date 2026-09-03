import { Property } from '@activepieces/pieces-framework';
import { asyntaiAuth } from '../auth';
import { asyntaiClient } from './client';

const website = Property.Dropdown({
  auth: asyntaiAuth,
  displayName: 'Assistant Website',
  description: 'The Asyntai website assistant that answers the message.',
  refreshers: [],
  required: true,
  options: async ({ auth }) => {
    if (!auth) {
      return {
        disabled: true,
        options: [],
        placeholder: 'Connect your Asyntai account first',
      };
    }
    try {
      const websites = await asyntaiClient.listWebsites(auth.secret_text);
      return {
        disabled: false,
        options: websites.map((item) => ({
          label: item.domain,
          value: item.id,
        })),
      };
    } catch {
      return {
        disabled: true,
        options: [],
        placeholder: 'Could not load websites. Check the connection.',
      };
    }
  },
});

export const asyntaiProps = {
  website,
};
