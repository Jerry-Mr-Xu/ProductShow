'use strict';

module.exports = {
    APIError: function (code, message) {
        this.code = code || 'unknow error';
        this.message = message || '';
    },
    putRestFn: function () {
        let pathPrefix = '\/api\/';
        return async (context, next) => {
            let requestPath = context.request.path;
            if (requestPath.startsWith(pathPrefix)) {
                context.rest = (data) => {
                    context.response.type = 'application\/json';
                    context.response.body = data;
                }
                try {
                    await next();
                } catch (error) {
                    context.response.status = 400;
                    context.response.type = 'application\/json';
                    context.response.body = {
                        code: error.code || 'unknow error',
                        message: error.message || ''
                    }
                }
            } else {
                await next();
            }
        };
    }
};