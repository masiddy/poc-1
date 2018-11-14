(function () {
    'use strict';
    
    angular
        .module('product', [
            'product.profile'
        ])
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
 
        $stateProvider
            .state('main.product', {
                url: '?key&value',
                templateUrl: '../views/product/product.list.html',
                controller: 'ProductCtrl as vm'
            });
    }
})();
 