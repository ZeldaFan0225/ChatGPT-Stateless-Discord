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
                name: "prompt",
                description: "The Prompt",
                required: true,
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