export async function createCommands() {
    const commands = [
        {
            name: "chat",
            description: "Start a chat with the bot",
            type: 1,
            integration_types: [1],
            contexts: [0, 1, 2],
            options: [{
                type: 3,
                name: "message",
                description: "The message to send to the AI",
                required: true,
            },{
                type: 3,
                name: "system_instruction",
                description: "The system instruction to use",
                required: false,
                autocomplete: true
            },{
                type: 3,
                name: "model",
                description: "The model to use for this request",
                required: false,
                autocomplete: true
            },{
                type: 11,
                name: "image",
                description: "An image to show with the prompt",
                required: false,
            },{
                type: 5,
                name: "ephemeral",
                description: "Whether to show the response or not",
                required: false,
            }]
        }
    ]

    await fetch(`${process.env["DISCORD_BASE_URL"]}/applications/${process.env["CLIENT_ID"]}/commands`, {
        method: "PUT",
        headers: {
            "Authorization": `Bot ${process.env["BOT_TOKEN"]}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(commands)
    }).then(res => res.json()).then(console.log)
}