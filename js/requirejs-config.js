// 为requirejs 模块名做全局配置
// 此处配置与打包配置无关（官方解释）
// 打包配置，需要重写，写在了gruntfile.js中
// 请保持两处命名一致
// 此处只需要放置libs通用库和utils组件

/*global require,requirejs*/
var staticURL = '../../js/';
// var staticURL = './js/';
require.config({
    baseUrl: staticURL,
    paths: {
        'domReady': 'utils/domReady',
        'eventBind': 'utils/eventBind',
        'knife':'utils/knife'
    }
});
