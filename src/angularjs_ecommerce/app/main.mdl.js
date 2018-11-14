(function () {
    'use strict';
    
    angular
        .module('main2', [
           
            'ngRoute',
           
        ]).config(function ($routeProvider) {
            $routeProvider
              .when('/', {
                templateUrl: '../views/dashboard.html'
              })
              .when('/login', {
                templateUrl: '../views/login.html'
              })
              .when('/logout', {
                controller: 'logoutController'
              })
              .when('/register', {
                templateUrl: '../views/register.html'
              })
              .when('/cart', {
                templateUrl: '../views/cart.html'
              })
              .otherwise({
                redirectTo: '/'
              });
          });

    // config.$inject = ['$stateProvider', '$urlRouterProvider', 'cfpLoadingBarProvider', 'NotificationProvider', 'StripeCheckoutProvider', 'STRIPE_KEY'];
    // function config($stateProvider, $urlRouterProvider, cfpLoadingBarProvider, NotificationProvider, StripeCheckoutProvider, STRIPE_KEY) {
    //     cfpLoadingBarProvider.includeSpinner = false;

    //     StripeCheckoutProvider.defaults({
    //         key: STRIPE_KEY
    //     });

    //     NotificationProvider.setOptions({
    //         startTop: 25,
    //         startRight: 25,
    //         verticalSpacing: 20,
    //         horizontalSpacing: 20,
    //         positionX: 'right',
    //         positionY: 'bottom'
    //     });

    //     $urlRouterProvider.otherwise(function ($injector) {
    //         var $state = $injector.get("$state");
    //         var $location = $injector.get("$location");
    //         var crAcl = $injector.get("crAcl");

    //         var state = "";
            
    //         switch (crAcl.getRole()) {
    //             case 'ROLE_ADMIN':
    //                 state = 'admin.products';
    //                 break;
    //             default : state = 'main.product';
    //         }

    //         if (state) $state.go(state);
    //         else $location.path('/');
    //     });
 
    //     $stateProvider
    //         .state('main', {
    //             url: '/',
    //             abstract: true,
    //             templateUrl: '../views/main.html',
    //             controller: 'CartCtrl as cart',
    //             resolve: {
    //                 // checkout.js isn't fetched until this is resolved.
    //                 stripe: StripeCheckoutProvider.load
    //             },
    //             data: {
    //                 is_granted: ['ROLE_GUEST']
    //             }
    //         })
    //         .state('blog', {
    //             url: '/blog',
    //             templateUrl: '../blog.html'
    //         })
    //         .state('auth', {
    //             url: '/login',
    //             templateUrl: '../views/auth/login.html',
    //             controller: 'AuthCtrl as auth',
    //             onEnter: ['AuthService', 'crAcl', function(AuthService, crAcl) {
    //                 AuthService.clearCredentials();
    //                 crAcl.setRole();
    //             }],
    //             data: {
    //                 is_granted: ['ROLE_GUEST']
    //             }
    //         });
    // } 

    // run.$inject = ['$rootScope', '$cookieStore', '$state', 'crAcl'];
    // function run($rootScope, $cookieStore, $state, crAcl) {
    //     // keep user logged in after page refresh
    //     $rootScope.globals = $cookieStore.get('globals') || {};

    //     crAcl
    //         .setInheritanceRoles({
    //             'ROLE_ADMIN': ['ROLE_ADMIN', 'ROLE_GUEST'],
    //             'ROLE_GUEST': ['ROLE_GUEST']
    //         });

    //     crAcl
    //         .setRedirect('main.product');

    //     if ($rootScope.globals.currentUser) {
    //         crAcl.setRole($rootScope.globals.currentUser.metadata.role);
    //         // $state.go('admin.products');
    //     }
    //     else {
    //         crAcl.setRole();
    //     }

    // }

})();
 