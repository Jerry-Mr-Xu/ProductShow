'use strict';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const getRouter = require('./url_controller/_manager');
const putRenderFn = require('./nunjucks_helper');
const putRestFn = require('./rest_helper').putRestFn;
const ModelManager = require('./model_controller/_manager');

// 是否正式发布
const isProduction = process.env.NODE_ENV === 'production';
const koa = new Koa();

(async () => {
    await ModelManager.sync();
})();

koa.use(async (context, next) => {
    // 打印日志
    let startTime = new Date().getTime();
    await next();
    console.log(`${context.request.method}: ${context.request.url} in ${new Date().getTime() - startTime}ms`);
});

if (!isProduction) {
    const getStaticFiles = require('./static/_manager');
    // 筛选静态文件
    koa.use(getStaticFiles());
}

koa.use(putRestFn());

koa.use(bodyParser());

koa.use(putRenderFn('views', {
    noCache: !isProduction,
    watch: !isProduction
}));

koa.use(getRouter().routes());

koa.listen(3000);