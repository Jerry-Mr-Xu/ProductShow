'use strict';

let mainUrlObj = {
    method: 'get',
    url: '/products',
    fn: async (context, next) => {
        context.render("main.html");
    }
};

module.exports = mainUrlObj;