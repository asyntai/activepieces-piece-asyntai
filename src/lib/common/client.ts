import {
  HttpMethod,
  httpClient,
} from '@activepieces/pieces-common';

async function validateApiKey(apiKey: string): Promise<AsyntaiAuthResponse> {
  const response = await httpClient.sendRequest<AsyntaiAuthResponse>({
    method: HttpMethod.GET,
    url: `${ASYNTAI_API_BASE_URL}/auth/test/`,
    headers: asyntaiHeaders(apiKey),
  });
  return response.body;
}

async function listWebsites(apiKey: string): Promise<AsyntaiWebsite[]> {
  const response = await httpClient.sendRequest<AsyntaiWebsitesResponse>({
    method: HttpMethod.GET,
    url: `${ASYNTAI_API_BASE_URL}/websites/`,
    headers: asyntaiHeaders(apiKey),
  });
  return response.body.websites;
}

async function askAssistant({
  apiKey,
  message,
  conversationId,
  websiteId,
  channel,
}: AskAssistantParams): Promise<AsyntaiAnswerResponse> {
  const response = await httpClient.sendRequest<AsyntaiAnswerResponse>({
    method: HttpMethod.POST,
    url: `${ASYNTAI_API_BASE_URL}/chat/`,
    headers: asyntaiHeaders(apiKey),
    body: {
      message,
      sender_id: conversationId,
      website_id: websiteId,
      platform: channel,
    },
  });
  return response.body;
}

function asyntaiHeaders(apiKey: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'X-API-Key': apiKey,
  };
}

const ASYNTAI_API_BASE_URL = 'https://asyntai.com/api/zapier';

export const asyntaiClient = {
  askAssistant,
  listWebsites,
  validateApiKey,
};

export type AsyntaiAnswerResponse = {
  success: boolean;
  response: string;
  sender_id: string;
  ai_disclosure: string;
};

export type AsyntaiWebsite = {
  id: number;
  domain: string;
};

type AskAssistantParams = {
  apiKey: string;
  message: string;
  conversationId: string;
  websiteId: number;
  channel: string;
};

type AsyntaiAuthResponse = {
  success: boolean;
  email: string;
};

type AsyntaiWebsitesResponse = {
  websites: AsyntaiWebsite[];
};
