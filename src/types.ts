export interface Config {
    whitelist_users: string[];
    default_model: string;
    default_system_instruction: string;
    dev_config?: {
        enabled?: boolean;
        debug_logs?: boolean;
    };
    selectable_system_instructions?: {
        name: string;
        system_instruction: string;
    }[];
    models?: Record<string, ModelConfiguration>;
}

export interface ModelConfiguration {
    model: string,
    base_url?: string,
    env_token_name?: string
    images?: {supported: false} | {supported: true, detail?: "high" | "low" | "auto"},
    max_completion_tokens?: number,
    max_model_tokens?: number,
    moderation?: {
        enabled?: boolean
    },
    defaults?: {
        frequency_penalty?: number,
        logit_bias?: Record<string, number>,
        logprobs?: boolean,
        top_logprobs?: number,
        presence_penalty?: number,
        response_format?: {type?: "text" | "json_object"},
        seed?: number,
        stop?: string | string[],
        temperature?: number,
        top_p?: number
    }
}


export interface OpenAIChatCompletionResponse {
    id: string,
    object: string,
    created: number,
    model: string,
    choices: {
        index: number,
        message: {
            role: "assistant" | "bot" | "user",
            content: string
        },
        finish_reason: string,
        logprobs?: {
            content: {
                token: string,
                logprob: number,
                bytes: string[],
                top_logprobs: {
                    token: string,
                    logprob: number,
                    bytes: string[],
                }[]
            }[]
        }
    }[],
    usage: {
        prompt_tokens: number,
        completion_tokens: number,
        total_tokens: number
    },
    system_fingerprint: string
}

export interface OpenAIModerationResponse {
    id: string,
    model: string,
    results: {
        categories: Record<string, boolean>,
        category_scores: Record<string, boolean>,
        flagged: boolean
    }[]
}

export type ChatCompletionMessages = ChatCompletionSystemMessage | ChatCompletionUserMessage | ChatCompletionAssistantMessage

export interface ChatCompletionBaseMessage {
    role: "assistant" | "system" | "user",
    name?: string,
}

export interface ChatCompletionSystemMessage extends ChatCompletionBaseMessage {
    role: "system",
    content: string
}

export interface ChatCompletionUserMessage extends ChatCompletionBaseMessage {
    role: "user",
    content: string | (
        {
            type: "text",
            text: string
        } | {
            type: "image_url",
            image_url: {
                url: string,
                detail: "low" | "high" | "auto"
            }
        }
    )[]
}

export interface ChatCompletionAssistantMessage extends ChatCompletionBaseMessage {
    role: "assistant",
    content?: string,
    tool_calls?: {
        id: string,
        type: "function",
        function: {
            name: string,
            arguments: string
        }
    }[]
}