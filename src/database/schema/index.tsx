import { appSchema } from "@nozbe/watermelondb/Schema";

import { userSchema } from './UserSchema';
import { carSchema } from './CarSchema';

const schemas = appSchema({
	version: 4,
	tables: [
		userSchema,
		carSchema
	]
});


export { schemas } ;
