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
