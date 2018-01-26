'use strict';

const APIError = require('../rest_helper').APIError;
const ModelManager = require('../model_controller/_manager');
const Product = ModelManager.getModel('product');

let productsUrlArray = [{
    // 获取所有产品数据
    method: 'get',
    url: '/api/products',
    fn: async (context, next) => {
        // 从数据库中查找数据
        let products = await Product.findAll();

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
                name: body.name,
                factory: body.factory,
                price: parseFloat(body.price)
            };

        // 往数据库中添加产品
        let result = await Product.create(product);
        console.log(`Add product: ${JSON.stringify(product)} result: ${result}`);
        context.rest(result);
    }
}, {
    // 删除产品
    method: 'delete',
    url: '/api/products/:id',
    fn: async (context, next) => {
        console.log(`Delete product: id = ${context.params.id}`);
        // 从数据库中删除数据
        let delProduct = await Product.findOne({
            where: {
                id: context.params.id
            }
        });
        if (delProduct) {
            let result = await delProduct.destroy();
            console.log(`Delete product: id = ${context.params.id} result: ${result}`);
            context.rest(result);
        } else {
            // 错误处理
            throw new APIError('delError', `Delete product: id = ${context.param.id}`);
        }
    }
}];

module.exports = productsUrlArray;