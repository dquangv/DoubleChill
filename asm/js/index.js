var app = angular.module("myapp", ["ngRoute"]);
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", { templateUrl: "asm/html/home.html", controller: "homeCtrl" })
        .when("/aboutus", { templateUrl: "asm/html/aboutus.html", controller: "myCtrl" })
        .when("/domestic", { templateUrl: "asm/html/domestic.html", controller: "myCtrl" })
        .when("/foreign", { templateUrl: "asm/html/foreign.html", controller: "myCtrl" })
        .when("/contact", { templateUrl: "asm/html/contact.html", controller: "myCtrl" })
        .when("/login", { templateUrl: "asm/html/login.html", controller: "myCtrl" })
        .when("/signup", { templateUrl: "asm/html/signUp.html", controller: "myCtrl" })
        .when("/cart", { templateUrl: "asm/html/cart.html", controller: "myCtrl" })
        .otherwise({ templateUrl: "asm/html/home.html", controller: "myCtrl" })
});

app.controller("homeCtrl", function ($scope, $rootScope, $routeParams, $http) {
    $scope.tours = [];
    $http.get("http://localhost:3000/tours").then(function (reponse) {
        $scope.tours = reponse.data;
        console.log($scope.tours);
        $scope.detailPro = $scope.tours.find(item => item.id == $routeParams.id);
    });
});