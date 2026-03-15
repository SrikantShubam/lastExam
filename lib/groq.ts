/**
 * Groq API Integration Utility
 * Provides functions for interacting with Groq API for LLM-powered features
 */

export interface GroqConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
}

export interface GroqResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface GenerateResponseOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  systemMessage?: string;
}

// Supported Groq models
export const GROQ_MODELS = {
  LLAMA3_70B: 'llama-3.3-70b-versatile',
  LLAMA3_8B: 'llama-3.3-8b-instant',
  MIXTRAL_8X7B: 'mixtral-8x7b-32768',
  GEMMA_7B: 'gemma2-9b-it',
} as const;

const DEFAULT_CONFIG: Required<GroqConfig> = {
  apiKey: '',
  baseUrl: 'https://api.groq.com/openai/v1',
  timeout: 30000,
  maxRetries: 3,
};

/**
 * Sleep utility for retry delay
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Make a request to Groq API with retry logic
 */
async function makeRequestWithRetry(
  endpoint: string,
  apiKey: string,
  config: GroqConfig,
  retryCount = 0
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeout || 30000);

  try {
    const response = await fetch(`${config.baseUrl || DEFAULT_CONFIG.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: endpoint.includes('/chat/completions') ? undefined : 'llama-3.3-70b-versatile',
        ...JSON.parse(await (await fetch(`${config.baseUrl || DEFAULT_CONFIG.baseUrl}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: '{}',
          signal: controller.signal,
        })).then(r => r.text()).catch(() => '{}')),
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      return response;
    }

    // If it's a rate limit error (429) or server error (5xx), retry
    if (
      (response.status === 429 || response.status >= 500) &&
      retryCount < (config.maxRetries || DEFAULT_CONFIG.maxRetries)
    ) {
      const errorData = await response.json().catch(() => ({}));
      console.warn(`Groq API error (${response.status}), retry ${retryCount + 1}/${config.maxRetries}:`, errorData);
      
      // Exponential backoff: wait longer between each retry
      const waitTime = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s, etc.
      await sleep(waitTime);
      
      return makeRequestWithRetry(endpoint, apiKey, config, retryCount + 1);
    }

    throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      // If it's not a timeout or abort error, and we have retries left
      if (
        error.name !== 'AbortError' &&
        error.message.includes('fetch') &&
        retryCount < (config.maxRetries || DEFAULT_CONFIG.maxRetries)
      ) {
        console.warn(`Network error, retry ${retryCount + 1}/${config.maxRetries}:`, error.message);
        const waitTime = Math.pow(2, retryCount) * 1000;
        await sleep(waitTime);
        return makeRequestWithRetry(endpoint, apiKey, config, retryCount + 1);
      }
    }
    throw error;
  }
}

/**
 * Generate a response from Groq API
 * @param prompt - The prompt to send to the model
 * @param modelName - The model to use (defaults to llama-3.3-70b-versatile)
 * @param options - Additional options for generation
 * @returns The generated text response
 */
export async function generateResponse(
  prompt: string,
  modelName: string = GROQ_MODELS.LLAMA3_70B,
  options: GenerateResponseOptions = {}
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_GROQ_API_KEY environment variable is not set');
  }

  const {
    temperature = 0.7,
    maxTokens = 2048,
    topP = 0.9,
    systemMessage = 'You are a helpful assistant.',
  } = options;

  try {
    const response = await makeRequestWithRetry(
      '/chat/completions',
      apiKey,
      DEFAULT_CONFIG
    );

    const data: GroqResponse = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from Groq API');
    }

    const content = data.choices[0].message.content;
    return content || '';
  } catch (error) {
    console.error('Error generating response from Groq:', error);
    throw error;
  }
}

/**
 * Generate a completion with JSON output
 * Useful for structured responses
 */
export async function generateJSONResponse<T = any>(
  prompt: string,
  modelName: string = GROQ_MODELS.LLAMA3_70B,
  options: GenerateResponseOptions = {}
): Promise<T> {
  const systemMessage = `${options.systemMessage || 'You are a helpful assistant.'}

IMPORTANT: You must respond with valid JSON only. Do not include any text before or after the JSON. Do not include markdown code blocks. The response must be parseable by JSON.parse().`;

  const response = await generateResponse(
    `${systemMessage}\n\n${prompt}`,
    modelName,
    {
      ...options,
      systemMessage: undefined, // Already included above
      temperature: options.temperature || 0.3, // Lower temperature for more consistent JSON
    }
  );

  // Try to parse the response as JSON
  try {
    // Remove any potential markdown code blocks
    let cleanResponse = response.trim();
    if (cleanResponse.startsWith('```json')) {
      cleanResponse = cleanResponse.slice(7);
    }
    if (cleanResponse.startsWith('```')) {
      cleanResponse = cleanResponse.slice(3);
    }
    if (cleanResponse.endsWith('```')) {
      cleanResponse = cleanResponse.slice(0, -3);
    }
    cleanResponse = cleanResponse.trim();

    return JSON.parse(cleanResponse) as T;
  } catch (error) {
    console.error('Failed to parse JSON response:', error);
    console.error('Response content:', response);
    throw new Error('Failed to parse JSON response from Groq API');
  }
}

/**
 * Generate a response with streaming (not implemented in this version)
 * This is a placeholder for future streaming support
 */
export async function generateResponseStream(
  prompt: string,
  modelName: string = GROQ_MODELS.LLAMA3_70B,
  options: GenerateResponseOptions = {},
  onChunk: (chunk: string) => void
): Promise<string> {
  // Placeholder for streaming support
  // In a full implementation, this would handle server-sent events
  console.warn('Streaming not yet implemented. Falling back to regular generation.');
  return generateResponse(prompt, modelName, options);
}

/**
 * Health check for Groq API
 */
export async function checkGroqConnection(): Promise<boolean> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (!apiKey) {
      console.error('NEXT_PUBLIC_GROQ_API_KEY not set');
      return false;
    }

    const response = await fetch(`${DEFAULT_CONFIG.baseUrl}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Groq API health check failed:', error);
    return false;
  }
}

/**
 * Get available models from Groq
 */
export async function getAvailableModels(): Promise<string[]> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('NEXT_PUBLIC_GROQ_API_KEY not set');
    }

    const response = await fetch(`${DEFAULT_CONFIG.baseUrl}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data?.map((m: any) => m.id) || [];
  } catch (error) {
    console.error('Error fetching Groq models:', error);
    return Object.values(GROQ_MODELS) as string[];
  }
}
