angular.module('CtrlModule', ['ServiceModule','ionic'])

.controller('tabCtrl', function ($scope, $ionicModal, $ionicPopover, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function () {
            this.classList.toggle('active');
        });
    }

    // .fromTemplate() method
    var template = '<ion-popover-view>' +
                    '   <ion-header-bar>' +
                    '       <h1 class="title">天气小贴士</h1>' +
                    '   </ion-header-bar>' +
                    '   <ion-content class="padding">' +
                    '       我和微笑天气有一个约会' +
                    '   </ion-content>' +
                    '</ion-popover-view>';

    $scope.popover = $ionicPopover.fromTemplate(template, {
        scope: $scope
    });
    $scope.closePopover = function () {
        $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.popover.remove();
    });
})



.controller('homePageCtrl',function($scope,$location){

})

  .controller('commentCtrl',function($scope,$location){

  })


.controller('CitiesCtrl',function($scope, Cities) {
		console.log('CitiesCtrl')
		$scope.Cities = Cities.initCities();
		$scope.remove = function(chat) {
		    Cities.remove(chat);
		    Cities.saveData();
		};
})

.controller('weatherCtrl', function($scope,Cities,getWeatherData,$ionicSlideBoxDelegate,$http) {
		console.log('weatherCtrl')
		var timeData=new Date();
		var month=timeData.getMonth()+1;
		var weekday=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
		var toweekday=timeData.getDay();
		$scope.today=timeData.getFullYear()+'/'+month+'/'+timeData.getDate()+' '+weekday[toweekday];
		console.log($scope.today)
		$scope.currentDay=[];
		for(var i=0;i<5;i++){
		    $scope.currentDay.push(weekday[toweekday+8+i]);
		}
		$scope.$on('$ionicView.enter', function(e) {
		    $scope.Cities=Cities.initCities();
		    $ionicSlideBoxDelegate.update();
		});
})

.controller('tabsearchCtrl', function($scope,Cities,cityCollection,$ionicPopup) {
		console.log(1)
		$scope.collections=cityCollection.all();
		$scope.add=function (city) {
		    Cities.add(city);
		    Cities.saveData();
		};//添加并保存城市
		$scope.search=function (city) {
		    if(city==''||city==null)
		      return $ionicPopup.alert({
		        title:"注意/warning！",
		        template:'搜索城市不能为空！'
		      }) ;
		    else{
		      if(cityCollection.searchCity(city))
		      {
		        $scope.add(city);
		        return $ionicPopup.alert({
		          title:'成功/success！',
		        template:city+'添加成功！'
		        })
		      }
		      else return $ionicPopup.alert({
		        title:'失败/error！',
		        template:'没有结果显示！'
		      });
		    }
		};//搜索函数

		$scope.chosenCity='';
		$scope.choose=function (city) {
		    $scope.chosenCity=city;
		};//更新已选择的城市

		$scope.enter=function (pro) {
		    $scope.citys=pro.city;
		    var cityConfirm =$ionicPopup.show({
		      title:"选择城市",
		      scope:$scope,
		      template: '<ion-radio ng-repeat="c in citys" ng-click="choose(c,this)">{{c}}</ion-radio>',
		      buttons:[{
		        text: 'Cancel',
		        type: 'button-default',
		        onTap: function(e) {
		        }},{
		        text: 'OK',
		        type: 'button-positive',
		        onTap: function() {
		          if($scope.chosenCity==''){
		            $ionicPopup.alert({
		              title:"注意/warning！",
		              template:'城市不能为空！'
		            })
		          }else{
		            if(!Cities.check($scope.chosenCity)){
		              $scope.add($scope.chosenCity);
		              $ionicPopup.alert({
		                title:'成功/success！',
		                template:$scope.chosenCity+'添加成功！'
		              });
		              $scope.chosenCity='';
		            }else
		              {
		              $ionicPopup.alert({
		                title:'失败/error！',
		                template:'城市已经存在！！'
		              });
		              $scope.chosenCity='';
		            }

		            }
		          }

		      }]
		    }) ;
		};//城市展开函数

})

.controller('LeftCtrl',function($scope,$location,$ionicHistory){
//		console.log("you")
		$scope.index = function(){
			$location.url('/tab/homepage')
		};
    $scope.register = function(){
      $location.url('/register')
    };

    $scope.login = function(){
      $location.url('/login')
    };
    $scope.search = function(){
      $location.url('/search')
    };
    $scope.about = function(){
      $location.url('/about')
    };
})
  .controller('registerCtrl',['$scope', '$http', function($scope,$http, $ionicModal, $timeout,$location) {
    $scope.submitted = false;
    $scope.onSubmit = function () {
      if ($scope.myRegister.$valid){
        var param = {
          Username:  $scope.username,
          Stuid: $scope.stuid,
          Classid: $scope.classid,
          Pwd: $scope.pwd,
          rPwd: $scope.rpwd
        }
        $http.post('someurl',param)
          .success(function(data){
            console.log(':)');
          })
          .error(function(data){
            console.log(':(');
          });
      }else{
        $scope.submitted = true;
      }
    }
  }])
  .controller('loginCtrl',['$scope', '$http', function($scope, $http, $ionicModal, $timeout,$location){
    // $scope.formModel = {};
    $scope.submitted = false;
    $scope.onSubmit = function(){
      if ($scope.myLogin.$valid) {
        var param = {
          User: $scope.userid,
          Pwd: $scope.password
        }
        $http.post('someurl',param)
          .success(function(data){
            console.log(':)');
          })
          .error(function(data){
            console.log(':(');
          });

        console.log(param);
      }else{
        $scope.submitted = true;
      }
    }
  }]);


