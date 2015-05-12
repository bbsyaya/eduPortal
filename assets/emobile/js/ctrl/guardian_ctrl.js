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

// 
// You can configure ngRoute as always, but to take advantage of SharedState location
// feature (i.e. close sidebar on backbutton) you should setup 'reloadOnSearch: false' 
// in order to avoid unwanted routing.
// 
app.config(function($routeProvider) {
  $routeProvider.when('/',              {templateUrl: 'guardian.html', controller:'guardianController', reloadOnSearch: false});
  $routeProvider.when('/detail/:id',        {templateUrl: 'guardian_report_detail.html',controller:'detailController', reloadOnSearch: false});
  $routeProvider.when('/report',        {templateUrl: 'guardian_report.html',controller:'reportController', reloadOnSearch: false});
  $routeProvider.when('/login',        {templateUrl: 'login.html',controller:'guardianController', reloadOnSearch: false});
});

app.controller('detailController', function($rootScope, $scope,$http,$routeParams){

  for(var i=0;i<$rootScope.reports.length;i++){
    if($rootScope.reports[i].id==$routeParams.id){
      $scope.report = $rootScope.reports[i];
      break;
    }
  }

    $scope.deliberatelyTrustDangerousSnippet = function() {
	return $sce.trustAsHtml($scope.snippet);  
  };  
  
  $scope.back = function(){
    	window.history.go(-1);
    };

});


app.controller('guardianController', function($rootScope, $scope,$http,$location){
  //Cookies.json = true;
  //if(Cookies.get("login")==true){
  //
  //}else{
  //  $location.path("/login")
  //}
    $scope.user =   JSON.parse(localStorage.getItem('user'));
    $scope.guardian = JSON.parse(localStorage.getItem('guardian'));
    if($scope.guardian == undefined){
        alert('您没有监护人');
        return;
    }

  $scope.back = function(){
    	window.history.go(-1);
    };

  $scope.login = function(){

    if($scope.loginName==undefined || $scope.loginName==""){
      alert("请输入用户名");
      return
    }

    if($scope.password==undefined || $scope.password==""){
      alert("请输入密码");
      return
    }

    $http.get('http://adminapp.online-openday.com/f/edu/account/login?loginName='+$scope.loginName+'&password='+$scope.password).
        success(function(data, status, headers, config) {
          $scope.login_rs = data;
          if($scope.login_rs.rs==true){
            //存储用户信息
            Cookies.json = true;
            Cookies.set('login', true, { path: '/'});
            Cookies.set('user', $scope.login_rs.euser, { path: '/'});
            Cookies.set('guardian', $scope.login_rs.guardian, { path: '/'});

            window.history.back();

          }else{
            alert("用户名或密码错误");
            Cookies.put("login",false);
          }

        }).
        error(function(data, status, headers, config) {
          alert("登录失败")
        });
  };
});

app.controller('reportController', function($rootScope, $scope,$http,$location){

    $scope.user =   JSON.parse(localStorage.getItem('user'));
    $scope.guardian = JSON.parse(localStorage.getItem('guardian'));
    if($scope.guardian == undefined){
        alert('您没有监护人');
        return;
    }else{
        //读取报告列表
        $http.get('http://adminapp.online-openday.com/f/edu/reportGuardian?uid='+$scope.guardian.id).
            success(function(data, status, headers, config) {
                $rootScope.reports = data;

            }).
            error(function(data, status, headers, config) {
                alert("获取失败")
            });

    }


  $scope.back = function(){
    window.history.go(-1);
  };

  $scope.login = function(){

    if($scope.loginName==undefined || $scope.loginName==""){
      alert("请输入用户名");
      return
    }

    if($scope.password==undefined || $scope.password==""){
      alert("请输入密码");
      return
    }

    $http.get('http://adminapp.online-openday.com/f/edu/account/login?loginName='+$scope.loginName+'&password='+$scope.password).
        success(function(data, status, headers, config) {
          $scope.login_rs = data;
          if($scope.login_rs.rs==true){
            //存储用户信息
            Cookies.json = true;
            Cookies.set('login', true, { path: '/'});
            Cookies.set('user', $scope.login_rs.euser, { path: '/'});
            window.history.back();

          }else{
            alert("用户名或密码错误");
            Cookies.put("login",false);
          }

        }).
        error(function(data, status, headers, config) {
          alert("登录失败")
        });
  };

  $scope.login = function(){

    if($scope.loginName==undefined || $scope.loginName==""){
      alert("请输入用户名");
      return
    }

    if($scope.password==undefined || $scope.password==""){
      alert("请输入密码");
      return
    }

    $http.get('http://adminapp.online-openday.com/f/edu/account/login?loginName='+$scope.loginName+'&password='+$scope.password).
        success(function(data, status, headers, config) {
          $scope.login_rs = data;
          if($scope.login_rs.rs==true){
            //存储用户信息
            Cookies.json = true;
            Cookies.set('login', true, { path: '/'});
            Cookies.set('user', $scope.login_rs.euser, { path: '/'});
            Cookies.set('guardian', $scope.login_rs.guardian, { path: '/'});

            window.history.back();

          }else{
            alert("用户名或密码错误");
            Cookies.put("login",false);
          }

        }).
        error(function(data, status, headers, config) {
          alert("登录失败")
        });
  };
});
