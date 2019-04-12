var router = require('koa-router')();
var { execSync } = require('child_process');

router.get('/hooks/:id', (ctx, next) => {
  try {
    var Routers = require('../../utils/routers');
    var routers = new Routers(__dirname, '../routers.json');
    var Keys = require('../../utils/keys');
    var keys = new Keys(__dirname, '../keys.json');
    var route = routers.find(ctx.params.id);
    if (!route) {
      ctx.throw(404, 'Not match');
    } else {
      var key = ctx.request.headers['access-key'];
      if (route.auth && !keys.get().includes(key)) {
        ctx.throw(401, 'Access key not match');
        return;
      }
      ctx.body = { ok: true, message: execSync(route.command) };
    }
  } catch (e) {
    ctx.throw(500, e.toString());
  }
});

module.exports = router;
