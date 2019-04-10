var router = require('koa-router')();
var { execSync } = require('child_process');

router.get('/hooks/:id', (ctx, next) => {
  try {
    var Routers = require('../../utils/routers');
    var routers = new Routers(__dirname, '../routers.json');
    var route = routers.find(ctx.params.id);
    execSync(route.command);
    ctx.body = { ok: true, message: 'ok' };
  } catch (e) {
    ctx.throw(500, e.toString());
  }
});

module.exports = router;
