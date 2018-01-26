'use strict';

const path = require('path');
const mime = require('mime');
const fs = require('mz/fs');

function getStaticFiles() {
    return async (context, next) => {
        // 获取请求地址
        let requestUrl = context.request.path;
        // 获取本文件夹名
        let currentDirName = `\/${__dirname.split('\\').pop()}\/`;

        if (requestUrl.startsWith(currentDirName)) {
            // 如果是静态文件则读取静态文件
            // 首先获取完整文件路径
            let filePath = path.join(__dirname, requestUrl.substring(currentDirName.length));
            // 判断文件是否存在
            if (await fs.exists(filePath)) {
                // 异步读取文件
                context.response.type = mime.getType(filePath);
                context.response.body = await fs.readFile(filePath);
            } else {
                // 显示错误
                console.error(`Not find file: ${filePath}`);
                context.response.status = 404;
            }
        } else {
            await next();
        }
    }
}

module.exports = getStaticFiles;