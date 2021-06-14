import { appSchema } from "@nozbe/watermelondb/Schema";

import { userSchema } from './UserSchema';

const schemas = appSchema({
	version: 1,
	tables: [
		userSchema
	]
});


export { schemas } ;
