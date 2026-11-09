import app from './worker.mjs';
import {sqliteDatabase,migrate} from './sqlite-database.mjs';
import {schema} from './schema.mjs';
export class TeamStore {
  constructor(ctx,env) {migrate(ctx.storage,schema);this.env={...env,DB:sqliteDatabase(ctx.storage)};}
  async fetch(request) {return app.fetch(request,this.env);}
}
