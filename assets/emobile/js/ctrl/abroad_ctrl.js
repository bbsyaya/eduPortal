// 
// Here is how to define your module 
// has dependent on mobile-angular-ui
// 
var app = angular.module('emobile', [
  'ngRoute',
  'mobile-angular-ui',
  'ngCookies',
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
  $routeProvider.when('/',              {templateUrl: 'abroad.html', controller:'abroadController', reloadOnSearch: false});
  $routeProvider.when('/detail/:id',        {templateUrl: 'abroad_detail.html',controller:'detailController', reloadOnSearch: false});
  $routeProvider.when('/login',        {templateUrl: 'login.html',controller:'detailController', reloadOnSearch: false});
  $routeProvider.when('/register',        {templateUrl: 'register.html',controller:'detailController', reloadOnSearch: false});
});

app.controller('detailController', function($rootScope, $scope,$http,$routeParams,$cookieStore,$location){

	$scope.abroadId = $routeParams.id;

    for(var i=0;i<$rootScope.abroads.length;i++){
        if($rootScope.abroads[i].id == $routeParams.id){
            $scope.abroad = $rootScope.abroads[i];
            if($scope.abroad.enrollable==0){
                $("#enrollContainer").hide();
            }else if($scope.abroad.enrolled==true){
                $("#enrollContainer").html("已报名");
                $("#enrollContainer").unbind();
            }
            break;
        }
    }

  $scope.enroll = function(){
      //判断是否登录
    if(localStorage.getItem('login')=='true'){//进行报名操作
        $scope.user = JSON.parse(localStorage.getItem('user'));

      $http.get('http://182.92.129.8:8025/f/edu/abroad/enroll/save?userId='+$scope.user.id+'&abroadId='+$scope.abroadId).
          success(function(data, status, headers, config) {
            $scope.enroll_result = data;

            if($scope.enroll_result==true){
              //将我要报名的文字变成已报名
                swal("报名成功");
              $("#enrollContainer").html("已报名");
              $("#enrollContainer").unbind();
            }else{
              alert("报名失败");
            }

          }).
          error(function(data, status, headers, config) {
            alert("报名失败")
          });

    }else{//去登录
      $location.path("/login")
    }

  };

  $scope.login = function(){

    if($scope.loginName==undefined || $scope.loginName==""){
        swal("请输入用户名");
      return
    }

    if($scope.password==undefined || $scope.password==""){
        swal("请输入密码");
      return
    }

      $http.get('http://182.92.129.8:8025/f/edu/account/login?loginName='+$scope.loginName+'&password='+$scope.password).
          success(function(data, status, headers, config) {

              $("#loading").hide();
              $scope.login_rs = data;

              if($scope.login_rs.rs==true){
                  $("#loading").hide();
                  //存储用户信息
                  localStorage.setItem('login','true');
                  localStorage.setItem('guardian',JSON.stringify($scope.login_rs.guardian));
                  localStorage.setItem('user',JSON.stringify($scope.login_rs.euser));
                  window.history.back();

              }else{
                  $("#loading").hide();
                  swal("用户名或密码错误");
                  localStorage.setItem('login','false');
              }

          }).
          error(function(data, status, headers, config) {
              $("#loading").hide();
              swal("登录失败")
          });
  };

    $scope.register = function(){
        if($scope.userName == undefined||$scope.userName.trim()==""){
            alert("请输入用户名");
            return ;
        }
        if($scope.password == undefined||$scope.password.trim()==""){
            alert("请输入密码");
            return ;
        }
        if($scope.password2 == undefined||$scope.password2.trim()==""||$scope.password!=$scope.password2.trim()){
            alert("二次输入的密码不一致");
            return ;
        }
        //注册
        $http.post('http://182.92.129.8:8025/f/edu/account/register?loginName='+$scope.userName+'&password='+$scope.password, {userName:$scope.userName,password:$scope.password}).
            success(function(data, status, headers, config) {
                if(data.rs==true){
                    alert("注册成功");
                    window.history.go(-1);
                }else{
                    alert(data.msg);
                }

            }).
            error(function(data, status, headers, config) {
                alert("注册失败");
            });


    };

    $scope.deliberatelyTrustDangerousSnippet = function() {
	return $sce.trustAsHtml($scope.snippet);  
  };  
  
  $scope.back = function(){
    	window.history.go(-1);
    };

});

app.controller('abroadController', function($rootScope, $scope,$http){
    $("#loading").show();

	$http.get('http://182.92.129.8:8025/f/edu/abroad').
	  success(function(data, status, headers, config) {
            $rootScope.abroads = data;
            $("#loading").hide();

	    
  }).
  error(function(data, status, headers, config) {
            $("#loading").hide();
            swal("加载失败")
  });
  
  $scope.back = function(){
    	window.history.go(-1);
    };
  
});
