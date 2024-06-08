var app = angular.module("myapp", ["ngRoute"]);
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", { templateUrl: "asm/html/home.html", controller: "homeCtrl" })
        .when("/aboutus", { templateUrl: "asm/html/aboutus.html", controller: "myCtrl" })
        .when("/domestic", { templateUrl: "asm/html/domestic.html", controller: "domesticCtrl" })
        .when("/foreign", { templateUrl: "asm/html/foreign.html", controller: "foreignCtrl" })
        .when("/contact", { templateUrl: "asm/html/contact.html", controller: "myCtrl" })
        .when("/login", { templateUrl: "asm/html/login.html", controller: "logInCtrl" })
        .when("/signup", { templateUrl: "asm/html/signUp.html", controller: "signUpCtrl" })
        .when("/cart", { templateUrl: "asm/html/cart.html", controller: "cartCtrl" })
        .when("/detail/:id", { templateUrl: "asm/html/tour.html", controller: "homeCtrl" })
        .when("/account/:id", { templateUrl: "asm/html/account.html", controller: "accountCtrl" })
        .otherwise({ templateUrl: "asm/html/home.html", controller: "myCtrl" })
});

app.run(function ($rootScope) {
    $rootScope.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    $rootScope.user = JSON.parse(localStorage.getItem('user')) || null;
});

app.controller('accountCtrl', function ($scope, $rootScope, $window) {
    if (!$rootScope.cart) {
        $rootScope.cart = [];
    }

    $scope.logOut = function () {
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');

        $rootScope.isLoggedIn = false;
        $rootScope.user = null;

        $window.location.href = '#!/login';
    };

    $scope.changePassword = function () {
        $scope.oldPasswordIncorrect = false;
        console.log($scope.user.password)
        console.log($scope.password)


        if ($scope.user.password !== $scope.password) {
            $scope.oldPasswordIncorrect = true;
            return;
        }

        $scope.user.password = $scope.newPassword;
        localStorage.setItem('user', JSON.stringify($scope.user));
        alert('Đổi mật khẩu thành công');
    }
});

app.controller("homeCtrl", function ($scope, $rootScope, $routeParams, $http) {
    $scope.tours = [];
    $http.get("http://localhost:3000/tours").then(function (reponse) {
        $scope.tours = reponse.data;
        // console.log($scope.tours);
        $scope.detailPro = $scope.tours.find(item => item.id == $routeParams.id);
    });

    if (!$rootScope.cart) {
        $rootScope.cart = [];
    }

    $scope.addToCart = function (tour) {
        const existingItem = $rootScope.cart.find(item => item.id === tour.id);
        if (existingItem) {
            if (existingItem.orderQuantity >= existingItem.quantity) {
                existingItem.orderQuantity == existingItem.quantity;
            } else {
                existingItem.orderQuantity++;
            }
        } else {
            tour.orderQuantity = 1;
            $rootScope.cart.push(tour);
        }
        $rootScope.saveCart();

        alert('Đặt chuyến thành công');
    };
});

app.controller("cartCtrl", function ($scope, $rootScope, $routeParams, $http) {
    if (!$rootScope.cart) {
        $rootScope.cart = [];
    }

    $scope.cart = $rootScope.cart;

    $scope.loadCart = function () {
        const cart = localStorage.getItem('cart');
        if (cart) {
            $rootScope.cart = JSON.parse(cart);
        } else {
            $rootScope.cart = [];
        }
        $scope.updateTotal();
    };

    $rootScope.saveCart = function () {
        localStorage.setItem('cart', JSON.stringify($rootScope.cart));
    };

    $scope.updateTotal = function () {
        $scope.totalPrice = $rootScope.cart.reduce((sum, item) => sum + (item.price * item.orderQuantity), 0);
        $rootScope.saveCart();
    };

    $scope.updateTotal();

    $scope.removeFromCart = function (tour) {
        const index = $scope.cart.indexOf(tour);
        if (index > -1) {
            $scope.cart.splice(index, 1);
        }
        $scope.updateTotal();
    };

    // $scope.updateTotal = function (detailPro) {
    //     if (detailPro.orderQuantity > detailPro.quantity) {
    //         detailPro.orderQuantity = detailPro.quantity;
    //     } else if (detailPro.orderQuantity < 1) {
    //         detailPro.orderQuantity = 1;
    //     }
    //     $scope.totalPrice = $scope.cart.reduce((sum, item) => sum + (item.price * item.orderQuantity), 0);
    // };

    $scope.checkout = function () {
        $rootScope.cart.forEach(item => {
            let updatedTour = angular.copy(item);
            updatedTour.quantity -= item.orderQuantity;
            delete updatedTour.orderQuantity;

            $http.put(`http://localhost:3000/tours/${item.id}`, updatedTour)
                .then(function (response) {
                    console.log('Cập nhật thành công', response.data);
                }, function (error) {
                    console.error('Thanh toán thất bại, lỗi: ', error);
                });
        });

        alert('Thanh toán thành công!');
        $rootScope.cart = [];
        $scope.updateTotal();
    };
});

// app.filter('sumByKey', function () {
//     return function (data, key) {
//         if (!angular.isArray(data) || !key) return 0;
//         return data.reduce((sum, item) => sum + parseFloat(item[key]) || 0, 0);
//     };
// });


app.controller("domesticCtrl", function ($scope, $rootScope, $routeParams, $http) {
    $scope.tours = [];
    $http.get("http://localhost:3000/tours").then(function (reponse) {
        $scope.tours = reponse.data;
        $scope.detailPro = $scope.tours.find(item => item.id == $routeParams.id);
        $scope.pageCount = Math.ceil($scope.tours.length / 16);
    });

    $scope.regions = ["Miền Bắc", "Miền Trung", "Miền Nam"];
    $scope.arranges = ["Giá tăng", "Giá giảm"];

    $scope.sortOrderFunc = function (tour) {
        switch ($scope.sortOrder) {
            case 'Giá tăng':
                return Number(tour.price.replace(/,/g, ''));
            case 'Giá giảm':
                return -Number(tour.price.replace(/,/g, ''));
            default:
                return 0;
        }
    };

    $scope.begin = 0;
    $scope.pageCount = Math.ceil($scope.tours.length / 8);

    $scope.first = function () {
        $scope.begin = 0;
    };

    $scope.previous = function () {
        if ($scope.begin > 0) {
            $scope.begin -= 8;
        }
    }

    $scope.next = function () {
        if ($scope.begin < ($scope.pageCount - 1) * 8) {
            $scope.begin += 8;
        }
    }

    $scope.second = function () {
        $scope.begin = 8;
    }

    $scope.third = function () {
        $scope.begin = 16;
    }

    if (!$rootScope.cart) {
        $rootScope.cart = [];
    }

    $scope.addToCart = function (tour) {
        const existingItem = $rootScope.cart.find(item => item.id === tour.id);
        if (existingItem) {
            if (existingItem.orderQuantity >= existingItem.quantity) {
                existingItem.orderQuantity == existingItem.quantity;
            } else {
                existingItem.orderQuantity++;
            }
        } else {
            tour.orderQuantity = 1;
            $rootScope.cart.push(tour);
        }
        $rootScope.saveCart();

        alert('Đặt chuyến thành công');
    };
});

app.controller("foreignCtrl", function ($scope, $rootScope, $routeParams, $http) {
    $scope.tours = [];
    $http.get("http://localhost:3000/tours").then(function (reponse) {
        $scope.tours = reponse.data;
        // console.log($scope.tours);
        $scope.detailPro = $scope.tours.find(item => item.id == $routeParams.id);
    });

    $scope.continents = ["Châu Âu", "Châu Á", "Khác"];
    $scope.arranges = ["Giá tăng", "Giá giảm"];

    $scope.sortOrderFunc = function (tour) {
        switch ($scope.sortOrder) {
            case 'Giá tăng':
                return Number(tour.price.replace(/,/g, ''));
            case 'Giá giảm':
                return -Number(tour.price.replace(/,/g, ''));
            default:
                return 0;
        }
    };

    if (!$rootScope.cart) {
        $rootScope.cart = [];
    }

    $scope.addToCart = function (tour) {
        const existingItem = $rootScope.cart.find(item => item.id === tour.id);
        if (existingItem) {
            if (existingItem.orderQuantity >= existingItem.quantity) {
                existingItem.orderQuantity == existingItem.quantity;
            } else {
                existingItem.orderQuantity++;
            }
        } else {
            tour.orderQuantity = 1;
            $rootScope.cart.push(tour);
        }
        $rootScope.saveCart();

        alert('Đặt chuyến thành công');
    };
});

app.controller("indexCtrl", function ($scope, $rootScope, $routeParams, $http) {
    $http.get("http://localhost:3000/users").then(function (reponse) {
        $scope.users = reponse.data;
    });

    $scope.search = function () {
        $rootScope.searchTour = $scope.searchQuery;
    }

    $rootScope.login = function (user) {
        user.name = $scope.name
        $rootScope.isLoggedIn = true;
        $rootScope.userName = $scope.name;
        console.log(user);
        console.log($rootScope.isLoggedIn);
    }
});


app.controller('signUpCtrl', function ($scope, $rootScope, $routeParams, $http) {
    $scope.users = [];
    $scope.emailExists = false;

    if (!$rootScope.cart) {
        $rootScope.cart = [];
    }

    $http.get("http://localhost:3000/users").then(function (reponse) {
        $scope.users = reponse.data;
    });

    $scope.emailAlreadyExists = function (email) {
        return $scope.users.some(function (user) {
            return user.email === email;
        });
    };

    $scope.submitForm = function (event) {
        event.preventDefault();

        if ($scope.emailAlreadyExists($scope.email)) {
            $scope.emailExists = true;
        } else {
            $scope.emailExists = false;
        }

        if ($scope.frmUser.$valid && !$scope.emailExists) {
            const newUser = {
                id: $scope.users.length + 1,
                name: $scope.name,
                email: $scope.email,
                password: $scope.password,
                gender: $scope.gender,
            };

            $scope.users.push(newUser);

            $http.post("http://localhost:3000/users", newUser)
                .then(function (response) {
                    $rootScope.isLoggedIn = true;
                    $rootScope.user = newUser;
                    localStorage.setItem('user', JSON.stringify(newUser));
                    localStorage.setItem('isLoggedIn', true);

                    alert('Đăng ký thành công');
                    $window.location.href = '#!/account/:id';
                }, function (error) {
                    alert('Đăng ký thất bại');
                });
        }
    };
});

app.controller('logInCtrl', function ($scope, $rootScope, $routeParams, $http, $window) {
    $scope.users = [];
    $scope.emailNotRegistered = false;
    $scope.incorrectPassword = false;
    $scope.emailEmpty = false;

    if (!$rootScope.cart) {
        $rootScope.cart = [];
    }

    $http.get("http://localhost:3000/users").then(function (reponse) {
        $scope.users = reponse.data;
    });


    $scope.submitForm = function (event) {
        event.preventDefault();

        $scope.emailEmpty = false;
        $scope.passwordEmpty = false;

        if ($scope.email === undefined) {
            $scope.emailEmpty = true;
        } else if ($scope.emailEmpty) {
            $scope.emailEmpty = false;
        }

        if ($scope.password === undefined) {
            $scope.passwordEmpty = true;
        } else if ($scope.passwordEmpty) {
            $scope.passwordEmpty = false
        }


        if ($scope.frmCus.$valid && !$scope.emailEmpty && !$scope.passwordEmpty) {
            const user = $scope.users.find(user => user.email === $scope.email);

            if (user) {
                if (user.password === $scope.password) {
                    $rootScope.isLoggedIn = true;
                    $rootScope.user = user;
                    localStorage.setItem('user', JSON.stringify(user));
                    localStorage.setItem('isLoggedIn', true);

                    alert('Đăng nhập thành công');
                    $window.location.href = '#!/account/:id';
                } else {
                    $scope.incorrectPassword = true;
                    $scope.emailNotRegistered = false;
                }
            } else {
                $scope.emailNotRegistered = true;
                $scope.incorrectPassword = false;
            }
        }

    };
});
