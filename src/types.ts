export interface Config {
    completion_configuration?: {
        system?: string;
        model?: string,
        max_tokens?: number
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