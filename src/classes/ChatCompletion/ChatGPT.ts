import { ChatCompletionMessages, Config, OpenAIChatCompletionResponse, OpenAIModerationResponse } from "../../types"

export class ChatGPT {
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
        return !!data?.results[0]?.flagged
    }
    
    static async requestChatCompletion(messages: ChatCompletionMessages[], user_id: string, config: Config) {
        const openai_req = await fetch(`https://api.openai.com/v1/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env["OPENAI_TOKEN"]}`
            },
            body: JSON.stringify({
                model: config.completion_configuration!.model,
                messages,
                user: user_id,
                max_tokens: config.completion_configuration!.max_tokens
            })
        })

        const data: OpenAIChatCompletionResponse = await openai_req.json()

        if(!data?.id) throw new Error("Unable to generate response")
        
        return data
    }
}