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
  $routeProvider.when('/',              {templateUrl: 'sister.html', controller:'sisterController', reloadOnSearch: false});
  $routeProvider.when('/detail/:id',        {templateUrl: 'sister_detail.html',controller:'detailController', reloadOnSearch: false});
  $routeProvider.when('/msg/:id',        {templateUrl: 'sister_msg.html',controller:'msgController', reloadOnSearch: false});
	$routeProvider.when('/login',        {templateUrl: 'login.html',controller:'detailController', reloadOnSearch: false});
	$routeProvider.when('/register',        {templateUrl: 'register.html',controller:'detailController', reloadOnSearch: false});
});

app.controller('sisterController', function($rootScope, $scope,$http){

	//教师列表
	$http.get('http://adminapp.online-openday.com/f/edu/sister').
		success(function(data, status, headers, config) {
			$rootScope.sisters = data;
		}).
		error(function(data, status, headers, config) {
			alert("加载失败");
		});

	$rootScope.back = function(){
		window.history.go(-1);
	};
});

app.controller('detailController', function($rootScope, $scope,$http,$routeParams){

	for(var i=0;i<$rootScope.sisters.length;i++){
		if($rootScope.sisters[i].id == $routeParams.id){
			$scope.sister = $rootScope.sisters[i];
			break;
		}
	}

  $scope.deliberatelyTrustDangerousSnippet = function() {  
	return $sce.trustAsHtml($scope.snippet);  
  };  

});

app.controller('msgController', function($rootScope, $scope,$http,$location,$routeParams){

    $scope.user = JSON.parse(localStorage.getItem('user'));

	$scope.title="";
	$scope.content="";

	$scope.postMsg = function(){
		if($scope.title==""){
			alert("请输入标题");
			return;
		}
			
		if($scope.content==""){
			alert("请输入内容");
			return;
		}

		//提交请求

		//$http.get('/edu/f/edu/sister/msg?sisterId='+$routeParams.id+'&uid='+$scope.user.id+'&title='+$scope.title+'&msg='+$scope.content).
		$http.get('http://adminapp.online-openday.com/f/edu/question/save?euser.id='+$scope.user.id+'&msg='+$scope.content+'&title='+$scope.title).
	  	success(function(data, status, headers, config) {
			if(data==true){
				alert('提交成功');
				window.history.go(-1);
			}else{
				alert('提交失败');
			}
  		}).
	  error(function(data, status, headers, config) {
				alert('提交失败');
	  });
			
	};
	$scope.back = function(){
		window.history.go(-1);
	};


});