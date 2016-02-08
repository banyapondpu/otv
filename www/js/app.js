var app = angular.module('myApp', ['ionic',  'ionic.contrib.ui.hscrollcards']);

var dev_id='442380923820509675849';
var url_api ='http://api.otv.co.th/api/index.php/v3/';
var secret_key='084b8c9ca250f4a0387044147960da14';
var app_id='3';
var version_id='1';

var sess_name;
var sess_id;

if(sess_name!=""){sess_name = window.localStorage['name'];}else{sess_name ="";}
if(sess_id!=""){sess_id =window.localStorage['id'];}else{sess_id="";}

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'views/login.html',
	  controller: 'loginController'
  })
  $stateProvider
    .state('history', {
      url: '/history/:user_id',
      templateUrl: 'views/history.html'
  })
  $stateProvider
    .state('main', {
      url: '/main/:user_id',
      templateUrl: 'views/main.html',
	  controller:'mainController'
  })
  $stateProvider
    .state('category', {
      url: '/category/:user_id/:id',
      templateUrl: 'views/category.html',
	  controller:'categoryController'
  })
  $stateProvider
    .state('content', {
      url: '/content/:user_id/:content_season_id',
      templateUrl: 'views/content.html',
	  controller:'contentController'
  })
  $stateProvider
    .state('episode', {
      url: '/episode/:user_id/:episode_id/:parts',
      templateUrl: 'views/ep.html',
	  controller:'episodeController'
  })
  $stateProvider
    .state('register', {
      url: '/register',
      templateUrl: 'views/register.html',
	  controller:'registerController'
  })
  $stateProvider
    .state('forgetpassword', {
      url: '/forgetpassword',
      templateUrl: 'views/forgetpassword.html',
	  controller:'forgetpasswordController'
  })
  $urlRouterProvider.otherwise('/login');
});
 

app.controller('loginController',['$scope','$stateParams','$http','$state','$ionicPopup',function($scope,$stateParams,$http,$state,$ionicPopup){
	$scope.loginData = {};
	$scope.doLogin = function() {
    console.log('Response', $scope.loginData);
      var request = $http({
                method: "post",
                url: ""+url_api+"/login",
                data: "email="+$scope.loginData.email+"&password="+$scope.loginData.password+"&app_id="+app_id+"&app_version="+version_id+"",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            request.success(function (data) {
               $scope.status_code = data.status;
               $scope.profile = data.profile;
				if($scope.status_code==1){
				   window.localStorage['name'] = $scope.profile.display_name;
				   window.localStorage['id'] = $scope.profile.user_id;
				   window.localStorage['email'] = $scope.profile.email;
                   $state.go('history', {user_id: $scope.profile.user_id});
               }else{
				   $scope.showAlertFail();
			   }
           });
	
			$scope.showAlertFail = function() {
			   var alertPopup = $ionicPopup.alert({
				 title: 'Fail!',
				 template: 'Invalid Username and Password '
			   });
			};
	};
}]);

app.controller('registerController',['$scope','$stateParams','$http','$state','$ionicPopup',function($scope,$stateParams,$http,$state,$ionicPopup){
	$scope.loginData = {};
	$scope.registerUer = function() {
    console.log('Response', $scope.loginData);
      var request = $http({
                method: "post",
                url: "http://api.otv.co.th/api/index.php/v3/register",
                data: "dev_code="+dev_id+
                "&dev_key="+secret_key+
                "&app_id="+app_id+
                "&app_version="+version_id+
                "&email="+$scope.loginData.email+
                "&password="+$scope.loginData.pwd+
                "&first_name="+$scope.loginData.first_name+
                "&last_name="+$scope.loginData.last_name+
                "&birth_date="+$scope.loginData.birth_date+
                "&sex="+$scope.loginData.birth_date+""
                ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            request.success(function (data) {
              $scope.status_code = data.status;
               if($scope.status_code==1){
				$state.go('login');
               }else{$scope.showAlertFail(); }
           });
		   $scope.showAlertFail = function() {
			   var alertPopup = $ionicPopup.alert({
				 title: 'Fail!',
				 template: 'Invalid Username and Password '
			   });
			};
	};
}]);

app.controller('forgetpasswordController',['$scope','$stateParams','$http','$state','$ionicPopup',function($scope,$stateParams,$http,$state,$ionicPopup){
	$scope.loginData = {};
	$scope.forgetLogin = function() {
	console.log('URL', ""+url_api+"forgotpasswd?dev_code="+dev_id+"&dev_key="+secret_key+"&app_id="+app_id+"&app_version=1&email="+$scope.loginData.email+"");
    $http.get(""+url_api+"forgotpasswd?dev_code="+dev_id+"&dev_key="+secret_key+"&app_id="+app_id+"&app_version="+$scope.loginData.email+"")
		.success(function (response) {
			$scope.data = response;
			console.log('URL',$scope.data);
			if($scope.data=="300"){
				$scope.showAlertSuccess();
			}else{
				$scope.showAlertFail();
			}
		});
	};
	
	$scope.showAlertFail = function() {
	   var alertPopup = $ionicPopup.alert({
		 title: 'Fail!',
		 template: 'Invalid Username and Password '
	   });
	};

	$scope.showAlertSuccess = function() {
		   var alertPopup = $ionicPopup.alert({
			 title: 'Success!',
			 template: 'รหัสผ่านถูกส่งไปยังอีเมลของคุณล้ว'
		   });
		   $scope.modal.hide();
	};
}]);

app.controller('episodeController', function($scope, $ionicSideMenuDelegate, $http, $stateParams,$sce) {
		$scope.user_id = $stateParams.user_id;
		$scope.parts = $stateParams.parts;
		$scope.episode_id = $stateParams.episode_id;
		var request = $http({
                method: "post",
                url: ""+url_api+"Episode/oplay/",
                data: "dev_code="+dev_id+
                "&dev_key="+secret_key+
                "&app_id="+app_id+
                "&app_version="+version_id+
                "&ep_id="+$scope.episode_id+""
                ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        request.success(function (data) {
              $scope.episode_detail = data.episode_detail;
			  $scope.part_items = data.episode_detail.part_items;
			  var stream = ""+$scope.part_items[$scope.parts].stream_url+"";
			  $scope.mySplitResult = stream.split('"');
              $scope.trustSrcurl = function(data) 
				{
					return $sce.trustAsResourceUrl(data);
				}
			  });
	
});

app.controller('historyController', function($scope, $ionicSideMenuDelegate, $http, $stateParams) {
		$scope.showName = sess_name;
		$scope.showID = $stateParams.user_id;
		$http.get(""+url_api+"Favorite/get?app_id="+app_id+"&user_id="+sess_id+"")
		.success(function (response) {
			$scope.had_seen = response.contents;
		});
});

app.controller('categoryController', function($scope, $ionicSideMenuDelegate, $http, $stateParams) {
		$scope.showName = sess_name;
		$scope.user_id = $stateParams.user_id;
		$scope.cateID = $stateParams.id;
		$http.get(""+url_api+"Lists/index/"+dev_id+"/"+secret_key+"/"+app_id+"/"+version_id+"/"+$scope.cateID+"")
		.success(function (response) {
			$scope.data = response;
			$scope.lists = response.items;
		});
		$http.get(""+url_api+"Category/index/"+app_id+"/"+version_id+"/")
		  .success(function (response) {
				$scope.categories = response.items;
		});
		$scope.openMenu = function () {
			$ionicSideMenuDelegate.toggleLeft();
		};
		   
		$scope.greaterThan = function(fieldName){
				  return function(item){
					return item[fieldName] > $scope.selected.score;
				  }
		}
});

app.controller('contentController', function($scope, $ionicSideMenuDelegate, $http, $stateParams) {
		$scope.showName = sess_name;
		$scope.user_id = $stateParams.user_id;
		$scope.content_season_id = $stateParams.content_season_id;
		$http.get(""+url_api+"Episodelist/index/"+dev_id+"/"+secret_key+"/"+app_id+"/"+version_id+"/"+$scope.content_season_id+"")
		.success(function (response) {
			$scope.data = response;
			$scope.relate_content = response.relate_content;
			$scope.episode_list = response.episode_list;
		});
		$http.get(""+url_api+"Category/index/"+app_id+"/"+version_id+"/")
		  .success(function (response) {
				$scope.categories = response.items;
		});
		$scope.openMenu = function () {
			$ionicSideMenuDelegate.toggleLeft();
		};
		   
		$scope.greaterThan = function(fieldName){
				  return function(item){
					return item[fieldName] > $scope.selected.score;
				  }
		}
});

app.controller('mainController', function($scope, $ionicSideMenuDelegate, $http, $stateParams) {
	$scope.quantity = 5;
	$scope.contents = [];
	$scope.user_id = sess_id;
	if($stateParams.user_id > 0){
		$scope.dataMember = '<div style="padding-top:10px; padding-left:5px;">สวัสดี: '+sess_name+'</div>';
	}else{
		$scope.dataMember = '<a href="#/login">Tab to Login</a>';
	}
		
	$scope.openMenu = function () {
			$ionicSideMenuDelegate.toggleLeft();
	};
	   
	$scope.greaterThan = function(fieldName){
			  return function(item){
				return item[fieldName] > $scope.selected.score;
			  }
	}  
	$http.get(""+url_api+"bannerglobal?app_id="+app_id+"&category_id=3&limit=5")
	  .success(function (response) {
			$scope.item_banner = response.item;
	});

	$http.get(""+url_api+"Hilight/index/"+app_id+"/"+version_id+"/")
	  .success(function (response) {
			$scope.hilight_items = response.items;
	});
	
	$http.get(""+url_api+"Category/index/"+app_id+"/"+version_id+"/")
	  .success(function (response) {
			$scope.categories = response.items;
	});
});

