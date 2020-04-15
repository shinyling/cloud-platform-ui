module.exports = {
    publicPath: './',
    assetsDir: 'static',
    productionSourceMap: false,
    // webpack配置 - 简单配置方式
    configureWebpack: {
        resolve: {
            alias: {
                // 别名
                vue$: "vue/dist/vue.esm.js"
            }
        }
    },
    devServer: {
        proxy: {
            '/api':{
                target:'http://localhost:8888',
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            }
        }
    }
}
