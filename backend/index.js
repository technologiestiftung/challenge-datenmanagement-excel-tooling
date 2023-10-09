// @ts-check
import fastify from 'fastify';

const server = fastify();

server.get('/', async (_request, _reply) => ({hello: 'world'}));

server.listen({port: 8080}, (error, address) => {
	if (error) {
		console.error(error);
		throw error;
	}

	console.log(`Server listening on ${address}`);
});
