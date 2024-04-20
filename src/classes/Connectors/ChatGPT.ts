import { ChatCompletionMessages, Config, ModelConfiguration, OpenAIChatCompletionResponse, OpenAIModerationResponse } from "../../types"
import GPT3Tokenizer from 'gpt3-tokenizer';

export class ChatGPT {
    static config: Config
    static #tokenizer = new GPT3Tokenizer({type: "gpt3"})

    static tokenizeString(text: string) {
        const encoded = this.#tokenizer.encode(text)
        return {
            count: encoded.bpe.length,
            tokens: encoded.bpe,
            text: encoded.text
        }
    }

    static async checkIfPromptGetsFlagged(message: string): Promise<boolean> {
        const openai_req = await fetch(`https://api.openai.com/v1/moderations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env["OPENAI_TOKEN"]}`
            },
            body: JSON.stringify({
                input: message
            })
        })

        const data: OpenAIModerationResponse = await openai_req.json()
        if(this.config.dev_config?.enabled && this.config.dev_config.debug_logs) console.log(data)
        return !!data?.results[0]?.flagged
    }
    
    static async requestChatCompletion(messages: ChatCompletionMessages[], model_config: ModelConfiguration, user_id: string) {
        if(this.config.dev_config?.enabled && this.config.dev_config.debug_logs) console.log(messages, model_config)
        const total_count = messages.map(m =>
            this.tokenizeString(
                typeof m.content === "string" ?
                    m.content :
                    m.content?.filter(c => "text" in c).map(c => (c as {text:string}).text ?? "").join("") || ""
            ).count + 5
        ).reduce((a, b) => a + b) + 2


        const openai_req = await fetch(`${model_config.base_url ?? "https://api.openai.com/v1"}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env[model_config.env_token_name || "OPENAI_TOKEN"]}`
            },
            body: JSON.stringify({
                model: model_config.model,
                messages,
                temperature: model_config?.defaults?.temperature,
                top_p: model_config?.defaults?.top_p,
                frequency_penalty: model_config?.defaults?.frequency_penalty,
                presence_penalty: model_config?.defaults?.presence_penalty,
                logit_bias: model_config?.defaults?.logit_bias,
                logprobs: model_config?.defaults?.logprobs,
                top_logprobs: model_config?.defaults?.top_logprobs,
                response_format: model_config.defaults?.response_format,
                seed: model_config?.defaults?.seed,
                stop: model_config?.defaults?.stop,
                max_tokens: model_config?.max_completion_tokens === -1 ? undefined : ((model_config?.max_model_tokens ?? 4096) - total_count),
                user: user_id
            })
        })

        const data: OpenAIChatCompletionResponse = await openai_req.json()
        if(this.config.dev_config?.enabled && this.config.dev_config.debug_logs) console.log(data)

        if(!data?.id) throw new Error("Unable to generate response")
        
        return data
    }
}