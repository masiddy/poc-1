(function () {
    'use strict';
    
    angular
        .module('product.profile', [])
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
 
        $stateProvider
            .state('main.product.profile', {
                url: 'products/:slug',
                views: {
                    '@main': {
                        templateUrl: '../views/product/product.profile.html',
                        controller: 'ProductProfileCtrl as vm'
                    }
                }
            });
    }
    
})();
 