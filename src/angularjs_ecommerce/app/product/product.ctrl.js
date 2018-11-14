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
