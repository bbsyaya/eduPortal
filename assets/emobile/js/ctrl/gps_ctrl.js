// 
// Here is how to define your module 
// has dependent on mobile-angular-ui
// 
var app = angular.module('emobile', [
    'ngRoute',
    'mobile-angular-ui',
    'mobile-angular-ui.gestures'
]);

app.filter('trustHtml', function ($sce) {
    return function (input) {
        return $sce.trustAsHtml(input);
    }
});

app.config(function ($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'gps.html', controller: 'gpsController', reloadOnSearch: false});
    $routeProvider.when('/login', {templateUrl: 'login.html', controller: 'loginController', reloadOnSearch: false});
});

app.controller('gpsController', function ($rootScope, $scope, $http,$location) {

    //定位当前位置

    if (localStorage.getItem("login") == 'true') {//进行报名操作
        $scope.user = JSON.parse(localStorage.getItem('user'));

        $http.get('http://adminapp.online-openday.com/f/edu/gps?uid='+$scope.user.id).
            success(function (data, status, headers, config) {
                $scope.gpses = data;

            }).
            error(function (data, status, headers, config) {

            });
    }else{
        $location.path("/login")
    }

    $scope.back = function () {
        window.history.go(-1);
    };

    //定位
    $http.get('http://adminapp.online-openday.com/f/edu/gps/locate?uid='+$scope.user.id).
        success(function (data, status, headers, config) {
            $scope.gpsNow = data;
        }).
        error(function (data, status, headers, config) {
        });



    $scope.relocateGps = function(){
        alert(1);
        if (!navigator.geolocation) {
            alert('您的手机不支持');
         return;
        }
        navigator.geolocation.getCurrentPosition(function(position){
            alert(2);
            var currentLat = position.coords.latitude;
            var currentLon = position.coords.longitude;
            alert("currentLat="+currentLat+",currentLon="+currentLon);
        },function(error){
            alert(3);
            alert(error);
        }); //定位

        $("#relocateContainer").html('定位中...');
        var url = 'http://adminapp.online-openday.com/f/edu/gps/locate?uid='+$scope.user.id;

        $http.get(url).
            success(function (data, status, headers, config) {
                $scope.gpsNow = data;
                $("#relocateContainer").html('重新定位');
                alert('定位成功');
            }).
            error(function (data, status, headers, config) {
                $("#relocateContainer").html('重新定位');
                alert('定位失败');
            });
    };

});

app.controller('loginController', function ($rootScope, $scope, $http) {
    Cookies.json = true;
    $scope.login = function () {

        if ($scope.loginName == undefined || $scope.loginName == "") {
            alert("请输入用户名");
            return
        }

        if ($scope.password == undefined || $scope.password == "") {
            alert("请输入密码");
            return
        }

        $http.get('http://adminapp.online-openday.com/f/edu/account/login?loginName=' + $scope.loginName + '&password=' + $scope.password).
            success(function (data, status, headers, config) {
                $scope.login_rs = data;
                if ($scope.login_rs.rs == true) {
                    //存储用户信息
                    Cookies.set('login', true, {path: '/'});
                    //$cookieStore.put("login",true);
                    //$cookieStore.put("user",$scope.login_rs.euser);
                    Cookies.set('guardian', $scope.login_rs.guardian, {path: '/'});
                    Cookies.set('user', $scope.login_rs.euser, {path: '/'});
                    window.history.back();

                } else {
                    alert("用户名或密码错误");
                    Cookies.put("login", false);
                }

            }).
            error(function (data, status, headers, config) {
                alert("登录失败")
            });
    };
});

