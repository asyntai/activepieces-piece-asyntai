import { HttpMethod, httpClient } from '@activepieces/pieces-common';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { asyntaiClient } from './client';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('asyntaiClient', () => {
  it('validates an API key with the required header', async () => {
    const sendRequest = vi.spyOn(httpClient, 'sendRequest').mockResolvedValue({
      status: 200,
      headers: {},
      body: { success: true, email: 'owner@example.com' },
    });

    const result = await asyntaiClient.validateApiKey('test-key');

    expect(result.email).toBe('owner@example.com');
    expect(sendRequest).toHaveBeenCalledWith({
      method: HttpMethod.GET,
      url: 'https://asyntai.com/api/zapier/auth/test/',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'test-key',
      },
    });
  });

  it('returns the account websites', async () => {
    const sendRequest = vi.spyOn(httpClient, 'sendRequest').mockResolvedValue({
      status: 200,
      headers: {},
      body: {
        websites: [
          { id: 10, domain: 'example.com' },
          { id: 11, domain: 'docs.example.com' },
        ],
      },
    });

    const websites = await asyntaiClient.listWebsites('test-key');

    expect(websites).toEqual([
      { id: 10, domain: 'example.com' },
      { id: 11, domain: 'docs.example.com' },
    ]);
    expect(sendRequest).toHaveBeenCalledWith({
      method: HttpMethod.GET,
      url: 'https://asyntai.com/api/zapier/websites/',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'test-key',
      },
    });
  });

  it('sends the complete assistant request', async () => {
    const sendRequest = vi.spyOn(httpClient, 'sendRequest').mockResolvedValue({
      status: 200,
      headers: {},
      body: {
        success: true,
        response: 'Hello from Asyntai',
        sender_id: 'ticket-123',
        ai_disclosure: 'This answer uses AI.',
      },
    });

    const result = await asyntaiClient.askAssistant({
      apiKey: 'test-key',
      message: 'Can you help?',
      conversationId: 'ticket-123',
      websiteId: 10,
      channel: 'email',
    });

    expect(result.response).toBe('Hello from Asyntai');
    expect(sendRequest).toHaveBeenCalledWith({
      method: HttpMethod.POST,
      url: 'https://asyntai.com/api/zapier/chat/',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'test-key',
      },
      body: {
        message: 'Can you help?',
        sender_id: 'ticket-123',
        website_id: 10,
        platform: 'email',
      },
    });
  });
});
