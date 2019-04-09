var Koa = require('koa');
var app = new Koa();
var json = require('koa-json');
var onerror = require('koa-onerror');
var bodyparser = require('koa-bodyparser');
var logger = require('koa-logger');

var route = require('./route');

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}));
app.use(json());
app.use(logger());

// logger
app.use(async function (ctx, next) {
  var start = new Date();
  await next();
  var ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
})

// routes
app.use(route.routes(), route.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
})

module.exports = app;
