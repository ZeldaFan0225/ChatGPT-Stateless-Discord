export class StabilityAI {
    static async generateImage(data: ImageGenerationRequest) {
        const formData = new FormData()
        formData.set("prompt", data.prompt)
        if (data.aspect_ratio) formData.set("aspect_ratio", data.aspect_ratio)
        if (data.model) formData.set("model", data.model)

        const res = await fetch(`https://api.stability.ai/v2beta/stable-image/generate/sd3`, {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": `Bearer ${process.env["STABILITY_AI_TOKEN"]}`,
                "Accept": "image/*"
            }
        })

        if(res.status !== 200) {
            console.log(`Failed with status: ${res.status}`)
            throw new Error("Unable to generate image")
        }

        return await res.blob();
    }
}

export interface ImageGenerationData {
    image: string;
    finish_reason: string;
    seed?: number;
}

export interface ImageGenerationRequest {
    prompt: string
    aspect_ratio?: string
    model?: string
}