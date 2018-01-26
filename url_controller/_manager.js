'use strict';

const router = require('koa-router')();
const fs = require('fs');
const path = require('path');

let getRouter = () => {
    // 获取当前文件夹下的所有url文件名
    let urlFileNames = fs.readdirSync(__dirname).filter((fileName) => {
        return /^url_\w+.js$/.test(fileName);
    });

    urlFileNames.forEach(urlFileName => {
        // 遍历所有url文件并动态导入
        let urlArray = [];
        const url = require(path.join(__dirname, urlFileName));
        if (url instanceof Array) {
            urlArray = url.slice();
        } else {
            urlArray.push(url);
        }

        urlArray.forEach(urlObj => {
            // 根据请求方式的不同调用对应的函数
            switch (urlObj.method) {
                case 'get':
                case 'GET':
                    router.get(urlObj.url, urlObj.fn);
                    break;

                case 'post':
                case 'POST':
                    router.post(urlObj.url, urlObj.fn);
                    break;

                case 'put':
                case 'PUT':
                    router.put(urlObj.url, urlObj.fn);
                    break;

                case 'delete':
                case 'DELETE':
                    router.del(urlObj.url, urlObj.fn);
                    break;

                default:
                    console.error(`Invalid request method: ${urlObj.method}`);
                    break;
            }
        });
    });

    return router;
};

module.exports = getRouter;