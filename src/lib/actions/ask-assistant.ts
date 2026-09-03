import { createAction, Property } from '@activepieces/pieces-framework';
import { asyntaiAuth } from '../auth';
import { asyntaiClient } from '../common/client';
import { asyntaiProps } from '../common/props';

export const askAssistantAction = createAction({
  auth: asyntaiAuth,
  name: 'ask_assistant',
  classification: 'WRITE',
  displayName: 'Ask Assistant',
  description: 'Sends a customer message to an Asyntai assistant and returns its answer.',
  audience: 'human',
  aiMetadata: {
    description:
      'Generate a customer-facing answer from one configured Asyntai website assistant. Each call adds a message to the Asyntai conversation history and can capture customer details, so retries can create duplicate history.',
    idempotent: false,
  },
  props: {
    website: asyntaiProps.website,
    message: Property.LongText({
      displayName: 'Customer Message',
      description: 'The customer message that the Asyntai assistant must answer.',
      required: true,
    }),
    conversation_id: Property.ShortText({
      displayName: 'Conversation ID',
      description:
        'A stable value for this customer or thread, such as an email address or ticket ID. Reuse it to keep conversation history.',
      placeholder: 'customer@example.com or ticket-1234',
      required: true,
    }),
    channel: Property.StaticDropdown({
      displayName: 'Source Channel',
      description:
        'Where the customer message arrived. Email channels add email-specific instructions to the assistant.',
      required: true,
      defaultValue: 'activepieces',
      options: {
        options: [
          { label: 'Other Activepieces Flow', value: 'activepieces' },
          { label: 'Email', value: 'email' },
          { label: 'Gmail', value: 'gmail' },
          { label: 'Microsoft Outlook', value: 'outlook' },
          { label: 'Website Chat', value: 'website' },
          { label: 'Slack', value: 'slack' },
          { label: 'WhatsApp', value: 'whatsapp' },
        ],
      },
    }),
  },
  async run(context) {
    const result = await asyntaiClient.askAssistant({
      apiKey: context.auth.secret_text,
      message: context.propsValue.message,
      conversationId: context.propsValue.conversation_id,
      websiteId: context.propsValue.website,
      channel: context.propsValue.channel,
    });
    return {
      success: result.success,
      answer: result.response,
      conversation_id: result.sender_id,
      ai_disclosure: result.ai_disclosure || null,
    };
  },
});
