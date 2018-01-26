'use strict';

const APIError = require('../rest_helper').APIError;

let products = [{
    id: 0,
    name: 'Product A',
    factory: "Factory A",
    price: 100
}, {
    id: 1,
    name: 'Product B',
    factory: 'Factory B',
    price: 200
}];
let testId = products.length;

let productsUrlArray = [{
    // 获取所有产品数据
    method: 'get',
    url: '/api/products',
    fn: async (context, next) => {
        console.log(`Get product list: length = ${products.length}`);
        // 从数据库中查找数据

        // 这里先暂时用假数据
        context.rest({
            products: products
        });
    }
}, {
    // 添加产品
    method: 'post',
    url: '/api/products',
    fn: async (context, next) => {
        let
            body = context.request.body,
            product = {
                id: testId,
                name: body.name,
                factory: body.factory,
                price: parseFloat(body.price)
            };

        // 测试用
        console.log(`Add product: ${JSON.stringify(product)}`);
        products.push(product);
        testId++;

        // 往数据库中添加产品

        // 暂时用假数据
        context.rest(product);
    }
}, {
    // 删除产品
    method: 'delete',
    url: '/api/products/:id',
    fn: async (context, next) => {
        console.log(`Delete product: id = ${context.params.id}`);
        // 从数据库中删除数据

        // 测试用
        let delIndex = -1;
        for (let i = 0; i < products.length; i++) {
            const p = products[i];
            if (p.id === parseInt(context.params.id)) {
                delIndex = i;
            }
        }
        if (delIndex >= 0) {
            context.rest(products[delIndex]);
            products.splice(delIndex, 1);
        } else {
            // 错误处理
            throw new APIError('delError', `Delete product: id = ${context.param.id}`);
        }
    }
}];

module.exports = productsUrlArray;