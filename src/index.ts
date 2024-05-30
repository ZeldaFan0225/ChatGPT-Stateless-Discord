import fastify from "fastify";
import { readFileSync, existsSync } from "fs";
import { Config } from "./types";
import { handlePostRequest } from "./handlers/handlePostRequest";
import { createCommands } from "./_misc/createCommands";
import { ChatGPT } from "./classes/Connectors/ChatGPT";
import { StabilityAI } from "./classes/Connectors/StabilityAI";
import { Dalle3 } from "./classes/Connectors/Dalle3";
import { TTS } from "./classes/Connectors/TTS";
//import { Pool } from "pg";

const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;

if (existsSync(`${process.cwd()}/.env`)) {
	for (const line of readFileSync(`${process.cwd()}/.env`, "utf8").split(
		/[\r\n]|\r\n/
	)) {
		let [, key, value] = line.match(RE_INI_KEY_VAL) || [];
		if (!key || !value) continue;

		process.env[key] = value?.trim();
	}
}

const config: Config = JSON.parse(readFileSync("./config.json").toString())
ChatGPT.config = config
StabilityAI.config = config
Dalle3.config = config
TTS.config = config

/*const connection = new Pool({
    user: process.env["DB_USERNAME"],
    host: process.env["DB_IP"],
    database: process.env["DB_NAME"],
    password: process.env["DB_PASSWORD"],
    port: Number(process.env["DB_PORT"]),
})

connection.query("CREATE TABLE IF NOT EXISTS chats (id SERIAL PRIMARY KEY, user_id VARCHAR(100) NOT NULL, messages JSON[] DEFAULT '{}', model VARCHAR(1000) NOT NULL, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP);").catch(console.error)'*/

startWebServer()

async function startWebServer() {
	const app = fastify({
		ignoreTrailingSlash: true,
		bodyLimit: 1024 * 64
	})

	app.post("/", (r, p) => handlePostRequest(r, p, config).catch(console.error))
    
    app.listen({port: Number(process.env["PORT"] || 3000), host: process.env["MODE"] === "dev" ? "localhost" : "0.0.0.0"}, (_err, address) => {
        console.log(`${app.printRoutes()}\n\nOnline at: ${address}`)
    })
}

createCommands()