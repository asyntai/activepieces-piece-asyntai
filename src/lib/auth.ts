import { PieceAuth } from '@activepieces/pieces-framework';
import { asyntaiClient } from './common/client';

export const asyntaiAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description:
    'Open [Asyntai API Settings](https://asyntai.com/settings/api/), generate an API key, and paste it here. API access requires a paid Asyntai plan.',
  required: true,
  validate: async ({ auth }) => {
    try {
      await asyntaiClient.validateApiKey(auth);
      return { valid: true };
    } catch {
      return {
        valid: false,
        error: 'The API key is invalid, or the Asyntai plan does not include API access.',
      };
    }
  },
  getConnectionIdentifier: async ({ auth }) => {
    try {
      const account = await asyntaiClient.validateApiKey(auth);
      return account.email;
    } catch {
      return undefined;
    }
  },
});
