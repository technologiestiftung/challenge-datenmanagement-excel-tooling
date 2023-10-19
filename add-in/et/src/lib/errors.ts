export class UserError extends Error {
	constructor(message: string, type: 'no-session') {
		super(message);
		this.name = 'UserError';
		this.type = type;
	}
	name = 'UserError';
	type: 'no-session';
}
