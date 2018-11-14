(function () {
  'use strict';
//defined first module of application and gave name of app : myApp with required import modules  
  angular.module("myApp", ["ui.router",'ngSanitize'])

  //set up configuration
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
    .state('layout.home', {
      url: '/',
      templateUrl: '../views/dashboard.html',
      controller:'dashboard',
      controllerAs:'vm',
    })
    .state('layout.cart', {
      url: '/cart',
      templateUrl: '../views/cart.html',
      resolve: {
        auththenticate: ['$q','Authorization', function($q, Authorization) {
          if(Authorization.authorized != true) { 
            return $q.reject("AUTH_REQUIRED");
          }else $q.resolve();
        }]
      }
    })
    .state('layout.men', {
      url: '/product/men',
      templateUrl: '../views/product/product.list.html',
      controller:'ProductCtrl',
      controllerAs:'vm'
    })
    .state('layout.women', {
      url: '/product/women',
      templateUrl: '../views/product/product.list.html',
      controller:'ProductCtrl',
      controllerAs:'vm'
    })
    .state('layout.kids', {
      url: '/product/kids',
      templateUrl: '../views/product/product.list.html',
      controller:'ProductCtrl',
      controllerAs:'vm'
    })
    .state('login', {
      url: '/login',
      templateUrl: '../views/login.html',
      resolve: {
        auththenticate: ['$q','Authorization', function($q, Authorization) {
          if(Authorization.authorized == true) {
            return $q.reject("AUTHORIZED"); 
          }
        }]
      }
    })
    .state('register', {
      url: '/signup',
      templateUrl: '../views/register.html',
      resolve: {
        auththenticate: ['$q','Authorization', function($q, Authorization) {
          if(Authorization.authorized == true) {
            return $q.reject("AUTHORIZED"); 
          }
        }]
      }
    })
    .state('layout', {
      url: '',
      templateUrl: '../views/main.html',
      controller:'main',
      redirectTo:'layout.home',
    })
    .state('auth',{
      url:'auth',
      controller: function($scope, $state, Authorization) {
        Authorization.go('layout.home');
      },
    })
    .state('logout',{
      url:'logout',
      controller: function($scope, $state, Authorization) {
        Authorization.clear();
        $state.go('layout.home');
      },
    })
  })
  
  .run(function($rootScope, $state,  $transitions, Authorization) {
    $transitions.onError({}, function(transition) {        
      if(transition.$to().name === 'layout.cart' && transition.error().detail === 'AUTH_REQUIRED') {
        $state.go('login');
      }
      if(transition.$to().name === 'login' && transition.error().detail === 'AUTHORIZED') {
        $state.go('layout.home');
      }
      if(transition.$to().name === 'register' && transition.error().detail === 'AUTHORIZED') {
        $state.go('layout.home');
      }
    });
  
  })

  .service('Authorization', function($state) {

    this.authorized = false;
    localStorage["Authentication"] = false;
    this.memorizedState = null;
  
    var
    clear = function() {
      this.authorized = false;
      localStorage["Authentication"] =  this.authorized;
      this.memorizedState = null;
    },
  
    go = function(fallback) {
      this.authorized = true;
      localStorage["Authentication"] =  this.authorized;
      var targetState = this.memorizedState ? this.memorizedState : fallback;
      $state.go(targetState);
    };
  
    return {
      authorized: this.authorized,
      memorizedState: this.memorizedState,
      clear: clear,
      go: go
    };
  });
  
})();

(function () {
  'use strict'; 
  //defined service in myapp module: dashboard service with required packages(http) 
    angular.module('myApp')
            .service('dashboardService', function ($http) {
            var dashboardService = this;
            //set http request header 
            $http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

            //service method 
            dashboardService.getProductList = () => {
              //http get call.return type promise
                return $http.get('../../data/ListData.json');
            }

        }); 
})();


(function () {
  'use strict'; 
  //defined controller in myApp module with service import
  angular.module("myApp")
  .controller('main',function ($scope){
  console.log(localStorage["Authentication"]);
  $scope.isAuthentication = localStorage["Authentication"];
  })
  })();

(function () {
  'use strict'; 
  //defined controller in myApp module with service import
    angular.module("myApp")
            .controller('dashboard',function (dashboardService){
        var vm = this;

        //defined two-way binding  variable
        vm.ListData = [];
    
        //defined controller method 
        vm.getProduct = () => {
          //calling service method
          dashboardService.getProductList().then((res)=>{
              vm.ListData = res.data.objects;
          }).catch((err)=>{
              console.error(err);
          })
        }
    })
})();
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
 
(function () {
    'use strict'; 

    angular
        .module('main')
        .controller('AdminCtrl', UserCtrl);

    function UserCtrl($rootScope, $scope, $state, AuthService, Flash, $log) {
        var vm = this;
        
        vm.currentUser = $rootScope.globals.currentUser.metadata;
        
        vm.logout = logout;

        function logout() {
            function success(response) {
                $state.go('auth');

                $log.info(response);
            }

            function failed(response) {
                $log.error(response);
            }

            AuthService
                .clearCredentials()
                .then(success, failed);
        }

        $scope.state = $state;

    }
})();

(function () {
    'use strict';
    
    angular
        .module('admin', [
            'admin.products',
            'admin.orders'
        ])
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('admin', {
                url: '/admin/',
                abstract: true,
                templateUrl: '../views/admin/admin.html',
                // controller: 'AdminCtrl as admin',
                data: {
                    is_granted: ['ROLE_ADMIN']
                }
            });
    }

})();
 
(function () {
    'use strict'; 

    angular
        .module('main')
        .controller('AuthCtrl', AuthCtrl);

    function AuthCtrl(crAcl, $state, AuthService, Flash, $log) {
        var vm = this;              

        vm.login = login;
        
        vm.showRegisterForm = false;
        
        vm.loginForm = null;
        
        vm.credentials = {};
        vm.user = {};

        function login(credentials) {
            function success(response) {
                function success(response) {
                    if (response.data.status !== 'empty') {
                        var currentUser = response.data.objects[0];

                        crAcl.setRole(currentUser.metadata.role);
                        AuthService.setCredentials(currentUser);
                        $state.go('admin.products');
                    }
                    else
                        Flash.create('danger', 'Incorrect username or password');
                }

                function failed(response) {
                    $log.error(response);
                }

                if (response.data.status !== 'empty')
                    AuthService
                        .checkPassword(credentials)
                        .then(success, failed);
                else
                    Flash.create('danger', 'Incorrect username or password');

                $log.info(response);
            }

            function failed(response) {
                $log.error(response);
            }

            if (vm.loginForm.$valid)
                AuthService
                    .checkUsername(credentials)
                    .then(success, failed);
        }

    }
})();

(function () {
    'use strict';

    angular
        .module('main')
        .service('AuthService', function ($http, 
                                          $cookieStore, 
                                          $q, 
                                          $rootScope, 
                                          URL, BUCKET_SLUG, READ_KEY, WRITE_KEY) {
            var authService = this;
            $http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

            authService.checkUsername = function (credentials) {
                return $http.get(URL + BUCKET_SLUG + '/object-type/users/search', {
                    params: {
                        metafield_key: 'email',
                        metafield_value_has: credentials.email,
                        limit: 1,
                        read_key: READ_KEY
                    }
                });
            };
            authService.checkPassword = function (credentials) {
                return $http.get(URL + BUCKET_SLUG + '/object-type/users/search', {
                    ignoreLoadingBar: true,
                    params: {
                        metafield_key: 'password',
                        metafield_value: credentials.password,
                        limit: 1,
                        read_key: READ_KEY
                    }
                });
            };
            authService.setCredentials = function (user) { 
                $rootScope.globals = {
                    currentUser: user
                };
                
                $cookieStore.put('globals', $rootScope.globals);
            };
            authService.clearCredentials = function () {
                var deferred = $q.defer();
                $cookieStore.remove('globals');

                if (!$cookieStore.get('globals')) {
                    $rootScope.globals = {};
                    deferred.resolve('Credentials clear success');
                } else {
                    deferred.reject('Can\'t clear credentials');
                }

                return deferred.promise;
            };
        });  
})();  
(function () {
    'use strict'; 

    angular
        .module('main')
        .controller('CartCtrl', CartCtrl);

    function CartCtrl(CartService, ProductService, $cookies, $http, Notification, STRIPE_KEY, $log, $state, StripeCheckout) {
        var vm = this;

        vm.addToCart = addToCart;
        vm.getCart = getCart;
        vm.hasInCart = hasInCart;
        vm.removeFromCart = removeFromCart;
        vm.completeOrder = completeOrder;
        vm.stripeCheckout = stripeCheckout;

        vm.cart = {};
        vm.cart.order = {};
        vm.products = [];
        vm.totalPrice = 0;
        vm.orderForm = null;

        var handler = StripeCheckout.configure({
            key: STRIPE_KEY,
            image: 'https://cosmicjs.com/images/logo.svg',
            locale: 'auto',
            token: function(token) {
            }
        });

        window.addEventListener('popstate', function() {
            handler.close();
        });
        
        function stripeCheckout(order) {
            if (vm.orderForm.$valid) {
                handler.open({
                    name: 'Ecommerce App',
                    description: vm.products.length + ' products',
                    amount: vm.totalPrice * 100
                }).then(function(result) {
                    console.log("Order complete!");
                    $http.post('/charge', {
                        stripeToken: result[0].id,
                        description: vm.products.length + ' products',
                        amount: vm.totalPrice * 100,
                        order: order
                    }).then(function () {
                        completeOrder(order);
                    });
                },function() {
                    console.log("Stripe Checkout closed without making a sale :(");
                });
            }
        }

        function addToCart(item) {
            function success(response) {
                Notification.success(response);
                getCart();

            }

            function failed(response) {
                Notification.error(response);
            }

            CartService
                .addToCart(item)
                .then(success, failed);

        }

        function completeOrder(order) {
            order.products = vm.products;

            function success(response) {
                $cookies.remove('cart');
                getCart();
                $state.go('main.cart.thankYou');
            }

            function failed(response) {
                Notification.error(response.data.message);
            }

            if (vm.orderForm.$valid)
                CartService
                    .completeOrder(order)
                    .then(success, failed);
        }

        function removeFromCart(_id) {
            function success(response) {
                Notification.success(response);
                getCart();
            }

            function failed(response) {
                Notification.error(response);
            }

            CartService
                .removeFromCart(_id)
                .then(success, failed);

        }

        function hasInCart(_id) {
            return CartService.hasInCart(_id);
        }

        function getCart() {
            function success(response) {
                vm.cart = response;
                getProducts();

                $log.info(response);
            }

            function failed(response) {
                $log.error(response);
            }

            CartService
                .getCart()
                .then(success, failed);

        }

        function getProducts() {
            function success(response) {
                $log.info(response);

                vm.products = [];
                vm.totalPrice = 0;

                for (var _id in vm.cart)
                    response.data.objects.forEach(function (item) {
                        if (item._id === _id) {
                            vm.products.push(item);
                            vm.totalPrice += item.metadata.price;
                        }
                    });

            }

            function failed(response) {
                $log.error(response);
            }

            ProductService
                .getProducts({})
                .then(success, failed);

        }



    }
})();

(function () {
    'use strict';
    
    angular
        .module('cart', [
            'cart.checkout'
        ])
        .config(config); 

    config.$inject = ['$stateProvider', 'StripeCheckoutProvider'];
    function config($stateProvider, StripeCheckoutProvider) {
 
        $stateProvider
            .state('main.cart', {
                url: 'cart',
                templateUrl: '../views/cart/cart.html'
            });
    }
})();
 
(function () {
    'use strict';

    angular
        .module('main')
        .service('CartService', function ($http, 
                                          $cookieStore, 
                                          $q, 
                                          $rootScope,
                                          URL, BUCKET_SLUG, READ_KEY, WRITE_KEY) {
            var that = this;
            $http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
            
            that.addToCart = function (item) {
                var deferred = $q.defer();

                var cart = $cookieStore.get('cart');
                cart = cart ? cart : {};

                if (!(item._id in cart)) {
                    cart[item._id] = item._id;

                    $cookieStore.put('cart', cart);

                    deferred.resolve('Added to cart');
                } else {
                    deferred.reject('Error: Can\'t added to cart');
                }

                return deferred.promise;
            };

            that.getCart = function () {
                var deferred = $q.defer();
                var cart = $cookieStore.get('cart');

                if (cart) {
                    deferred.resolve(cart);
                } else {
                    deferred.reject('Error: Can\'t get cart');
                }

                return deferred.promise;
            };

            that.removeFromCart = function (_id) {
                var deferred = $q.defer();

                var cart = $cookieStore.get('cart');
                cart = cart ? cart : {};

                if (_id in cart) {
                    delete cart[_id];

                    $cookieStore.put('cart', cart);

                    deferred.resolve('Removed from cart');
                } else {
                    deferred.reject('Error: Can\'t remove from cart');
                }

                return deferred.promise;
            };

            that.hasInCart = function (_id) {
                var cart = $cookieStore.get('cart');
                cart = cart ? cart : {};

                return _id in cart;
            };

            that.completeOrder = function (order) {
                var products = [];

                order.products.forEach(function (item) {
                    products.push(item._id);
                });

                return $http.post(URL + BUCKET_SLUG + '/add-object/', {
                    write_key: WRITE_KEY,
                    title: order.firstName + ' ' + order.lastName,
                    type_slug: "orders",
                    metafields: [
                        {
                            key: "first_name",
                            type: "text",
                            value: order.firstName

                        },
                        {
                            key: "last_name",
                            type: "text",
                            value: order.lastName

                        },
                        {
                            key: "address",
                            type: "text",
                            value: order.address

                        },
                        {
                            key: "city",
                            type: "text",
                            value: order.city

                        },
                        {
                            key: "phone",
                            type: "text",
                            value: order.phone

                        },
                        {
                            key: "postal_code",
                            type: "text", 
                            value: order.postalCode

                        },
                        {
                            key: "email",
                            type: "text",
                            value: order.email
                        },
                        {
                            key: "products",
                            type: "objects",
                            object_type: "products",
                            value: products.join()
                        }
                    ]
                });
            };
        });  
})();  
angular.module("config", [])
.constant("BUCKET_SLUG", "d95fa870-d75f-11e8-9661-272fca804673")
.constant("MEDIA_URL", "https://api.cosmicjs.com/v1/undefined/media")
.constant("URL", "https://api.cosmicjs.com/v1/")
.constant("READ_KEY", "nGUQkzPfIVuJfPQT1ZxOHhRd4ZliKgCwRHvMMil1qdoiJ1qqI8")
.constant("WRITE_KEY", "8O5Td5hzqYkCiYlzkUdWwOjOYypTvGoX380g5Ojo8iYuwqrUDl")
.constant("STRIPE_KEY", "");

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
(function () {
    'use strict'; 

    angular
        .module('myApp')
        .controller('ProductCtrl', ProductCtrl);

    function ProductCtrl($stateParams, ProductService, $log) {
        var vm = this;
        
        
        //vm.getProducts = getProducts;
        //vm.removeProduct = removeProduct;

        vm.params = $stateParams;

        vm.categories = [];
        vm.brands = [];
        vm.case_sizes = [];
        vm.colors = [];
        
        vm.products = [];
        vm.getProduct = () => {
            //calling service method
            ProductService.getProductList().then((res)=>{
                console.log("call");
                vm.products = res.data.objects;
            }).catch((err)=>{
                console.error(err);
            })
          }
    }
})();

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
 
(function () {
    'use strict';

    angular
        .module('myApp')
        .service('ProductService', function ($http) {

            $http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
            var ProductService = this;
            ProductService.getProductList = () => {
                //http get call.return type promise
                  return $http.get('../../data/ListData.json');
            }

            // this.getProducts = function (params) {
            //     if (!angular.equals({}, params))
            //         return $http.get(URL + BUCKET_SLUG + '/object-type/products/search', {
            //             params: {
            //                 metafield_key: params.key,
            //                 metafield_value_has: params.value,
            //                 limit: 100,
            //                 read_key: READ_KEY
            //             }
            //         });
            //     else
            //         return $http.get(URL + BUCKET_SLUG + '/object-type/products', {
            //             params: {
            //                 limit: 100,
            //                 read_key: READ_KEY
            //             }
            //         });
            // };
            // this.getProductsParams = function () {
            //     return $http.get(URL + BUCKET_SLUG + '/object-type/products', {
            //         params: {
            //             limit: 100,
            //             read_key: READ_KEY
            //         }
            //     });
            // };
            // this.getProductBySlug = function (slug) {
            //     return $http.get(URL + BUCKET_SLUG + '/object/' + slug, {
            //         params: {
            //             read_key: READ_KEY
            //         }
            //     });
            // };
            // this.updateProduct = function (event) {
            //     event.write_key = WRITE_KEY;

            //     return $http.put(URL + BUCKET_SLUG + '/edit-object', event);
            // };
            // this.removeProduct = function (slug) {
            //     return $http.delete(URL + BUCKET_SLUG + '/' + slug, {
            //         ignoreLoadingBar: true,
            //         headers: {
            //             'Content-Type': 'application/json'
            //         },
            //         data: {
            //             write_key: WRITE_KEY
            //         }
            //     });
            // };
            // this.createProduct = function (product) {
            //     product.write_key = WRITE_KEY;

            //     return $http.post(URL + BUCKET_SLUG + '/add-object', product);
            // };
            // this.upload = function (file) {
            //     var fd = new FormData();

            //     fd.append('media', file);
            //     fd.append('write_key', WRITE_KEY);

            //     var defer = $q.defer();

            //     var xhttp = new XMLHttpRequest();

            //     xhttp.upload.addEventListener("progress", function (e) {
            //         defer.notify(parseInt(e.loaded * 100 / e.total));
            //     });
            //     xhttp.upload.addEventListener("error", function (e) {
            //         defer.reject(e);
            //     });

            //     xhttp.onreadystatechange = function () {
            //         if (xhttp.readyState === 4) {
            //             defer.resolve(JSON.parse(xhttp.response)); //Outputs a DOMString by default
            //         }
            //     };

            //     xhttp.open("post", MEDIA_URL, true);

            //     xhttp.send(fd);

            //     return defer.promise;
            // }
        });
})();  
(function () {
    'use strict';

    angular
        .module('main')
        .service('UserService', function ($http, 
                                          $cookieStore, 
                                          $q, 
                                          $rootScope, 
                                          URL, BUCKET_SLUG, READ_KEY, WRITE_KEY) {
            $http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

            this.getCurrentUser = function (ignoreLoadingBar) {
                return $http.get(URL + BUCKET_SLUG + '/object/' + $rootScope.globals.currentUser.slug, {
                    ignoreLoadingBar: ignoreLoadingBar,
                    params: {
                        read_key: READ_KEY
                    }
                });
            };
            this.getUser = function (slug, ignoreLoadingBar) {
                return $http.get(URL + BUCKET_SLUG + '/object/' + slug, {
                    ignoreLoadingBar: ignoreLoadingBar,
                    params: {
                        read_key: READ_KEY
                    }
                });
            };
            this.updateUser = function (user) {
                user.write_key = WRITE_KEY;

                return $http.put(URL + BUCKET_SLUG + '/edit-object', user, {
                    ignoreLoadingBar: false
                });
            };

        });  
})();  
(function () {
    'use strict'; 

    angular
        .module('main')
        .controller('AdminOrdersCtrl', AdminOrdersCtrl);

    function AdminOrdersCtrl($rootScope, $scope, Notification, AdminOrdersService, Flash, $log) {
        var vm = this;

        vm.getOrders = getOrders; 
        vm.removeOrder = removeOrder;
        vm.totalPrice = totalPrice;

        vm.orders = [];

        function getOrders() {
            function success(response) {
                vm.orders = response.data.objects;

            }

            function failed(response) {
                $log.error(response);
            }

            AdminOrdersService
                .getOrders()
                .then(success, failed);
        }

        function removeOrder(slug) {
            function success(response) {
                getOrders();
                Notification.success(response.data.message);
            }

            function failed(response) {
                Notification.error(response.data.message);
            }

            AdminOrdersService
                .removeOrder(slug)
                .then(success, failed);
        }
        
        function totalPrice(products) {
            var total = 0;

            products.forEach(function (item) {
                total += item.metadata.price;
            });

            return total;
        }
    }
})();

(function () {
    'use strict';
    
    angular
        .module('admin.orders', [
            'admin.orders.preview'
        ])
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
 
        $stateProvider
            .state('admin.orders', {
                url: 'orders?key&value',
                templateUrl: '../views/admin/admin.orders.html',
                controller: 'AdminOrdersCtrl as vm',
                data: {
                    is_granted: ['ROLE_ADMIN']
                }
            });
        
        
    }
    
})();
 
(function () {
    'use strict';

    angular
        .module('main')
        .service('AdminOrdersService', function ($http,
                                          $cookieStore, 
                                          $q, 
                                          $rootScope,
                                          URL, BUCKET_SLUG, READ_KEY, WRITE_KEY, MEDIA_URL) {
            
            $http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

            this.getOrders = function () {
                return $http.get(URL + BUCKET_SLUG + '/object-type/orders', {
                    params: {
                        limit: 100,
                        read_key: READ_KEY
                    }
                });
            };
            this.getOrderBySlug = function (slug) {
                return $http.get(URL + BUCKET_SLUG + '/object/' + slug, {
                    params: {
                        read_key: READ_KEY
                    }
                });
            };

            this.updateEvent = function (event) {
                event.write_key = WRITE_KEY;

                return $http.put(URL + BUCKET_SLUG + '/edit-object', event);
            };
            this.removeOrder = function (slug) {
                return $http.delete(URL + BUCKET_SLUG + '/' + slug, {
                    ignoreLoadingBar: true,
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    data: {
                        write_key: WRITE_KEY
                    }
                });
            };
            this.createEvent = function (event) {
                event.write_key = WRITE_KEY;

                var beginDate = new Date(event.metafields[1].value);
                var endDate = new Date(event.metafields[2].value);

                event.metafields[1].value = beginDate.getFullYear() + '-' + (beginDate.getMonth() + 1) + '-' + beginDate.getDate();
                event.metafields[2].value = endDate.getFullYear() + '-' + (beginDate.getMonth() + 1) + '-' + endDate.getDate();

                event.slug = event.title;
                event.type_slug = 'events';

                event.metafields[4] = {
                    key: "user",
                    type: "object",
                    object_type: "users",
                    value: $rootScope.globals.currentUser._id
                };
                return $http.post(URL + BUCKET_SLUG + '/add-object', event);
            };
            this.upload = function (file) {
                var fd = new FormData(); 
                fd.append('media', file);
                fd.append('write_key', WRITE_KEY);

                var defer = $q.defer();

                var xhttp = new XMLHttpRequest();

                xhttp.upload.addEventListener("progress",function (e) {
                    defer.notify(parseInt(e.loaded * 100 / e.total));
                });
                xhttp.upload.addEventListener("error",function (e) {
                    defer.reject(e);
                });

                xhttp.onreadystatechange = function() {
                    if (xhttp.readyState === 4) {
                        defer.resolve(JSON.parse(xhttp.response)); //Outputs a DOMString by default
                    }
                };

                xhttp.open("post", MEDIA_URL, true);

                xhttp.send(fd);
                
                return defer.promise;
            }
        });
})();  
(function () {
    'use strict';
    
    angular
        .module('admin.products', [
            'admin.products.edit',
            'admin.products.add'
        ])
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
 
        $stateProvider
            .state('admin.products', {
                url: 'products?key&value',
                templateUrl: '../views/admin/admin.products.html',
                controller: 'ProductCtrl as vm',
                data: {
                    is_granted: ['ROLE_ADMIN']
                }
            });
    }
    
})();
 
(function () {
    'use strict';
    
    angular
        .module('cart.checkout', [])
        .config(config); 

    config.$inject = ['$stateProvider', 'StripeCheckoutProvider'];
    function config($stateProvider, StripeCheckoutProvider) {
 
        $stateProvider
            .state('main.cart.checkout', {
                url: '/checkout',
                views: {
                    '@main': {
                        templateUrl: '../views/cart/cart.checkout.html'
                    }
                }
            })
            .state('main.cart.thankYou', {
                url: '/thank-you',
                views: {
                    '@main': {
                        templateUrl: '../views/cart/cart.thank-you.html'
                    }
                }
            });
    }
})();
 
(function () {
    'use strict'; 

    angular
        .module('main')
        .controller('ProductProfileCtrl', ProductProfileCtrl);

    function ProductProfileCtrl(UserService, $stateParams, ProductService, Notification, $log, MEDIA_URL, $state) {
        var vm = this;

        vm.getProduct = getProduct;

        function getProduct() {
            function success(response) {
                $log.info(response);
                vm.product = response.data.object;
            }

            function failed(response) {
                $log.error(response);
            }

            ProductService
                .getProductBySlug($stateParams.slug)
                .then(success, failed);
        }

    }
})();

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
 
(function () {
    'use strict';
    
    angular
        .module('admin.orders.preview', [])
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('admin.orders.preview', {
                url: '/preview/:slug',
                data: {
                    is_granted: ['ROLE_ADMIN']
                },
                onEnter: [
                    'ngDialog',
                    'AdminOrdersService',
                    '$stateParams',
                    '$state',
                    '$log',
                    function (ngDialog, AdminOrdersService, $stateParams, $state, $log) {
                        getOrder($stateParams.slug);

                        function getOrder(slug) {
                            function success(response) {
                                openDialog(response.data.object);
                            }

                            function failed(response) {
                                $log.error(response);
                            }

                            AdminOrdersService
                                .getOrderBySlug(slug)
                                .then(success, failed);
                        }

                        function openDialog(data) {

                            var options = {
                                templateUrl: '../views/admin/admin.orders.preview.html',
                                data: data,
                                showClose: true
                            };

                            ngDialog.open(options).closePromise.finally(function () {
                                $state.go('admin.orders');
                            });
                        }
                    }]
            });
    }
})();
 
(function () {
    'use strict'; 

    angular
        .module('main')
        .controller('AdminProductsAdd', AdminProductsAdd);

    function AdminProductssAdd($state, ProductService, Notification, $log, $scope, MEDIA_URL, ngDialog) {
        var vm = this;

        vm.updateProduct = updateProduct;
        vm.upload = upload;

        vm.uploadProgress = [0, 0, 0];

        vm.event = {};
        vm.flow = {};

        vm.flowConfig = {
            target: MEDIA_URL,
            singleFile: false
        };

        function updateProduct(product) {
            function success(response) {
                $log.info(response);

                Notification.primary(
                    {
                        message: 'Saved',
                        delay: 800,
                        replaceMessage: true
                    }
                );

                $state.go('admin.products', null, {reload: true});
                ngDialog.close();
            }

            function failed(response) {
                $log.error(response);
            }


            if (vm.flow.files.length &&
                vm.uploadProgress[0] === 100 &&
                vm.uploadProgress[1] === 100 &&
                vm.uploadProgress[2] === 100)
                ProductService
                    .createProduct(product)
                    .then(success, failed);
            else
                ProductService
                    .createProduct(product)
                    .then(success, failed);
        }

        function upload() {
            vm.flow.files.forEach(function (item, i) {
                if (i < 3)
                    ProductService
                        .upload(item.file)
                        .then(function(response){

                            $scope.ngDialogData.metafields[11].children[i].value = response.media.name;

                        }, function(){
                            console.log('failed :(');
                        }, function(progress){
                            vm.uploadProgress[i] = progress;
                        });
            });

        }

    }
})();

(function () {
    'use strict';
    
    angular
        .module('admin.products.add', [])
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
 
        $stateProvider
            .state('admin.products.add', {
                url: '/add',
                onEnter: [
                'ngDialog',
                'ProductService',
                '$stateParams',
                '$state',
                '$log',
                function (ngDialog, ProductService, $stateParams, $state, $log) {
                    openDialog(ProductService.product);
                        
                    function openDialog(data) {
    
                        var options = {
                            templateUrl: '../views/admin/admin.products.edit.html',
                            data: data,
                            controller: 'AdminProductsAdd as vm',
                            showClose: true
                        };
    
                        ngDialog.open(options).closePromise.finally(function () {
                            $state.go('admin.products');
                        });
                    }
                }],
                data: {
                    is_granted: ['ROLE_ADMIN']
                }
            });
    }
    
})();
 
(function () {
    'use strict'; 

    angular
        .module('main')
        .controller('AdminProductsEdit', AdminProductsEdit);

    function AdminProductsEdit($state, ProductService, Notification, $log, $scope, MEDIA_URL, ngDialog) {
        var vm = this;

        vm.updateProduct = updateProduct;
        vm.cancelUpload = cancelUpload;
        vm.upload = upload;

        vm.dateBeginPicker = false;
        vm.dateEndPicker = false;
        vm.contentEditor = false;
        vm.uploadProgress = [0, 0, 0];

        vm.event = {};
        vm.flow = {};
        vm.background = {};

        vm.flowConfig = {
            target: MEDIA_URL,
            singleFile: false
        };

        function updateProduct(product) {
            function success(response) {
                $log.info(response);

                Notification.primary(
                    {
                        message: 'Saved',
                        delay: 800,
                        replaceMessage: true
                    }
                );

                $state.go('admin.products', null, {reload: true});
                ngDialog.close();
            }

            function failed(response) {
                $log.error(response);
            }


            if (vm.flow.files.length &&
                vm.uploadProgress[0] === 100 &&
                vm.uploadProgress[1] === 100 &&
                vm.uploadProgress[2] === 100)
                ProductService
                    .updateProduct(product)
                    .then(success, failed);
            else
                ProductService
                    .updateProduct(product)
                    .then(success, failed);
        }

        function cancelUpload() {
            vm.flow.cancel();
            vm.background = {
                'background-image': 'url(' + (vm.event.metafields[0].value ? vm.event.metafields[0].url : DEFAULT_EVENT_IMAGE) + ')'
            };
        }

        $scope.$product('vm.flow.files[0].file.name', function () {
            if (!vm.flow.files[0]) {
                return ;
            }
            var fileReader = new FileReader();
            fileReader.readAsDataURL(vm.flow.files[0].file);
            fileReader.onload = function (event) {
                $scope.$apply(function () {
                    vm.image = {
                        'background-image': 'url(' + event.target.result + ')'
                    };
                });
            };
        });

        function upload() {
            vm.flow.files.forEach(function (item, i) {
                if (i < 3)
                    ProductService
                        .upload(item.file)
                        .then(function(response){

                            $scope.ngDialogData.metafields[11].children[i].value = response.media.name;

                        }, function(){
                            console.log('failed :(');
                        }, function(progress){
                            vm.uploadProgress[i] = progress;
                        });
            });

        }

    }
})();

(function () {
    'use strict';
    
    angular
        .module('admin.products.edit', [])
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
 
        $stateProvider
            .state('admin.products.edit', {
                url: '/edit/:slug',
                onEnter: [
                'ngDialog',
                'ProductService',
                '$stateParams',
                '$state',
                '$log',
                function (ngDialog, ProductService, $stateParams, $state, $log) {
                    getProduct($stateParams.slug);
    
                    function getProduct(slug) {
                        function success(response) {
                            openDialog(response.data.object);
                        }
    
                        function failed(response) {
                            $log.error(response);
                        }
 
                        ProductService
                            .getProductBySlug(slug)
                            .then(success, failed);
                    }
    
                    function openDialog(data) {
    
                        var options = {
                            templateUrl: '../views/admin/admin.products.edit.html',
                            data: data,
                            controller: 'AdminProductsEdit as vm',
                            showClose: true
                        };
    
                        ngDialog.open(options).closePromise.finally(function () {
                            $state.go('admin.products');
                        });
                    }
                }],
                data: {
                    is_granted: ['ROLE_ADMIN']
                }
            });
    }
    
})();
 