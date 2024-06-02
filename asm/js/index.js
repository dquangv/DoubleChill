var app = angular.module("myapp", ["ngRoute"]);
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", { templateUrl: "asm/html/home.html", controller: "homeCtrl" })
        .when("/aboutus", { templateUrl: "asm/html/aboutus.html", controller: "myCtrl" })
        .when("/domestic", { templateUrl: "asm/html/domestic.html", controller: "domesticCtrl" })
        .when("/foreign", { templateUrl: "asm/html/foreign.html", controller: "foreignCtrl" })
        .when("/contact", { templateUrl: "asm/html/contact.html", controller: "myCtrl" })
        .when("/login", { templateUrl: "asm/html/login.html", controller: "myCtrl" })
        .when("/signup", { templateUrl: "asm/html/signUp.html", controller: "myCtrl" })
        .when("/cart/:id", { templateUrl: "asm/html/cart.html", controller: "homeCtrl" })
        .otherwise({ templateUrl: "asm/html/home.html", controller: "myCtrl" })
});

app.controller("homeCtrl", function ($scope, $rootScope, $routeParams, $http) {
    $scope.tours = [];
    $http.get("http://localhost:3000/tours").then(function (reponse) {
        $scope.tours = reponse.data;
        // console.log($scope.tours);
        $scope.detailPro = $scope.tours.find(item => item.id == $routeParams.id);
    });

    $scope.searchTour = '';
    $scope.searchQuery = '';
    $scope.search = function() {
        $scope.searchTour = $scope.searchQuery;
        console.log($scope.searchTour);
    }
});

app.controller("domesticCtrl", function ($scope, $rootScope, $routeParams, $http) {
    $scope.tours = [];
    $http.get("http://localhost:3000/tours").then(function (reponse) {
        $scope.tours = reponse.data;
        $scope.detailPro = $scope.tours.find(item => item.id == $routeParams.id);
    });

    $scope.sortOrderFunc = function (tour) {
        switch ($scope.sortOrder) {
            case 'priceAsc':
                return Number(tour.price.replace(/,/g, ''));
            case 'priceDesc':
                return -Number(tour.price.replace(/,/g, ''));
            default:
                return 0;
        }
    };
});

app.controller("foreignCtrl", function ($scope, $rootScope, $routeParams, $http) {
    $scope.tours = [];
    $http.get("http://localhost:3000/tours").then(function (reponse) {
        $scope.tours = reponse.data;
        // console.log($scope.tours);
        $scope.detailPro = $scope.tours.find(item => item.id == $routeParams.id);
    });

    $scope.sortOrderFunc = function (tour) {
        switch ($scope.sortOrder) {
            case 'priceAsc':
                return Number(tour.price.replace(/,/g, ''));
            case 'priceDesc':
                return -Number(tour.price.replace(/,/g, ''));
            default:
                return 0;
        }
    };
});