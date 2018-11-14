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