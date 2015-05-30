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
  $routeProvider.when('/',              {templateUrl: 'activity.html', controller:'ActivityController', reloadOnSearch: false});  
  $routeProvider.when('/detail/:id',        {templateUrl: 'activity_detail.html',controller:'detailController', reloadOnSearch: false});   
});

app.controller('detailController', function($rootScope, $scope,$http,$routeParams){
	$scope.activityId = $routeParams.id;

    for(var i=0;i<$rootScope.activitys.length;i++){
      if($rootScope.activitys[i].id==$routeParams.id){
        $scope.activity = $rootScope.activitys[i];
      }
    }

  $scope.deliberatelyTrustDangerousSnippet = function() {
	return $sce.trustAsHtml($scope.snippet);  
  };  
  
  $scope.back = function(){
    	window.history.go(-1);
    };

});

app.controller('ActivityController', function($rootScope, $scope,$http){
    $("#loading").show();
	$http.get('http://182.92.129.8:8025/f/edu/activity').
	  success(function(data, status, headers, config) {
          $rootScope.activitys = data;
            $("#loading").hide();
            setTimeout(function () {
                myScroll.refresh();
            }, 10);
	    
  }).
  error(function(data, status, headers, config) {
            $("#loading").hide();
            swal("加载失败");
  });
  
  $scope.back = function(){
    	window.history.go(-1);
    };

    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    var myScroll;
    $scope.$on('$viewContentLoaded', function() {
         myScroll = new IScroll('#wrapper', { mouseWheel: true, click: true });
    });

});
