var app=angular.module("myapp",["ngRoute"]);
app.config(function($routeProvider){
    $routeProvider
    .when("/",{templateUrl: "trangchu.html",controller: "myCtrl"})
    .when("/gioithieu",{templateUrl: "gioithieu.html",controller: "myCtrl"})
    .when("/lienhe",{templateUrl: "lienhe.html",controller: "myCtrl"})
    .when("/khac",{templateUrl: "chitiet.html",controller: "myCtrl"},)
    .otherwise({templateUrl: "trangchu.html",controller: "myCtrl"})
})  
