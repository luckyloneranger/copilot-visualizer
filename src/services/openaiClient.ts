import { AzureOpenAI } from 'openai';
import { ApiConfiguration } from '@/types';
import { AZURE_DEFAULT_API_VERSION } from '@/constants';

export interface AzureClientResult {
  client: AzureOpenAI;
  config: Required<ApiConfiguration>;
}

const pickAzureConfig = (apiConfig?: ApiConfiguration): Required<ApiConfiguration> => {
  const endpoint = apiConfig?.endpoint || process.env.AZURE_OPENAI_ENDPOINT || '';
  const apiKey = apiConfig?.apiKey || process.env.AZURE_OPENAI_API_KEY || '';
  const deployment = apiConfig?.deployment || process.env.AZURE_OPENAI_DEPLOYMENT || '';
  const apiVersion = apiConfig?.apiVersion || process.env.AZURE_OPENAI_API_VERSION || AZURE_DEFAULT_API_VERSION;

  if (!endpoint || !apiKey || !deployment) {
    throw new Error('Azure OpenAI credentials are not configured. Please set them in settings or environment variables.');
  }

  return { endpoint, apiKey, deployment, apiVersion };
};

export const createAzureClient = (apiConfig?: ApiConfiguration): AzureClientResult => {
  const config = pickAzureConfig(apiConfig);
  const client = new AzureOpenAI({
    endpoint: config.endpoint,
    apiKey: config.apiKey,
    apiVersion: config.apiVersion,
    deployment: config.deployment,
  });

  return { client, config };
};
