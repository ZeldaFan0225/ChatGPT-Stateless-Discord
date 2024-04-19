import fastify from "fastify";
import rate_limit from "@fastify/rate-limit"
import cors from "@fastify/cors"
import { readFileSync, existsSync } from "fs";
import { Config } from "./types";
import { createCommands } from "./_misc/createCommands";
import { handlePostRequest } from "./handlers/handlePostRequest";

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

startWebServer()

async function startWebServer() {
	const app = fastify({
		ignoreTrailingSlash: true,
		bodyLimit: 1024 * 64
	})
	
	await app.register(rate_limit, {
		timeWindow: '1 minute',
		max: 200,
	});
	
	await app.register(cors, {
		origin: process.env["MODE"] == "prod" ? process.env["DOMAIN"]! : '*',
	});

	app.post("/", (r, p) => handlePostRequest(r, p, config))
    
    app.listen({port: Number(process.env["PORT"] || 3000), host: process.env["MODE"] === "dev" ? "localhost" : "0.0.0.0"}, (_err, address) => {
        console.log(`${app.printRoutes()}\n\nOnline at: ${address}`)
    })
}

//createCommands()