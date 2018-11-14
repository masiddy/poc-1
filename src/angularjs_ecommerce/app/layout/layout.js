(function () {
    'use strict';

    angular
    .module('layout')
    .config(config); 

    config.$inject = ['$stateProvider', 'StripeCheckoutProvider'];
        function config($stateProvider, StripeCheckoutProvider) {
    
            $stateProvider
                .state('myApp.layout', {
                    url: '',
                    templateUrl: '../views/product.list.html'
                });
        }
})();