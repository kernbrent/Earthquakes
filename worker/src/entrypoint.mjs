import app from './worker.mjs';
export {TeamStore} from './store.mjs';
export default {
  async fetch(request,env) {
    const path=new URL(request.url).pathname;
    if(path.startsWith('/api/site-admin/')||/^\/data\/(calendar|roster|results)\.json$/.test(path)) {
      try {return await env.TEAM_STORE.get(env.TEAM_STORE.idFromName('team')).fetch(request);}
      catch {return Response.json({error:'The team portal is temporarily unavailable.'},{status:503,headers:{'Cache-Control':'no-store'}});}
    }
    return app.fetch(request,env);
  },
};
