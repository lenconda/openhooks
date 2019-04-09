var router = require('koa-router')();
var { execSync } = require('child_process');
var routersList = require('../routers.json');
var Routers = require('../../utils/routers');

var routers = new Routers(routersList);

router.get('/hooks/:id', (ctx, next) => {
  try {
    var route = routers.find(ctx.params.id);
    execSync(route.command);
    return { ok: true, message: 'ok' };
  } catch (e) {
    return { ok: false, message: e.toString() };
  }
})

module.exports = router;
