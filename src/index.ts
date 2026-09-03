import { createCustomApiCallAction } from '@activepieces/pieces-common';
import { createPiece, PieceCategory } from '@activepieces/pieces-framework';
import { askAssistantAction } from './lib/actions/ask-assistant';
import { asyntaiAuth } from './lib/auth';

export const asyntai = createPiece({
  displayName: 'Asyntai',
  description: 'Use an Asyntai website assistant in customer support workflows.',
  auth: asyntaiAuth,
  minimumSupportedRelease: '0.36.1',
  categories: [
    PieceCategory.ARTIFICIAL_INTELLIGENCE,
    PieceCategory.CUSTOMER_SUPPORT,
  ],
  logoUrl: 'https://asyntai.com/static/images/icon-512.png',
  authors: ['Asyntai'],
  actions: [
    askAssistantAction,
    createCustomApiCallAction({
      auth: asyntaiAuth,
      baseUrl: () => 'https://asyntai.com/api/zapier',
      authMapping: async (auth) => ({
        'X-API-Key': auth.secret_text,
      }),
    }),
  ],
  triggers: [],
});
