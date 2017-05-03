angular.module('CtrlModule', ['ServiceModule','ionic'])
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
    $scope.mess = function(){
      $location.url('/mess')
    };
  })

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
                      '       <h1 class="title">温馨提示</h1>' +
                      '   </ion-header-bar>' +
                      '   <ion-content class="padding">' +
                      '       五一期间今天食堂正常营业' +
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

  .controller('commentCtrl',function($scope,$location){

  })

  .controller('settingCtrl',function($scope,setting){
      $scope.settingFn = setting.settingInit();

    })

  .controller('orderCtrl',function($scope, order) {
      console.log('orderCtrl')
      $scope.order = order.initOrder();
      $scope.remove = function(chat) {
        order.remove(chat);
        order.saveData();
      };
  })

  .controller('detailCtrl', function($scope,order,getDetailData,$ionicSlideBoxDelegate,$http) {
      console.log('detailCtrl')
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
          $scope.order=order.initOrder();
          $ionicSlideBoxDelegate.update();
      });
  })

  .controller('searchCtrl', function($scope,order,cityCollection,$ionicPopup) {
      console.log(1);
      $scope.collections=cityCollection.all();
      $scope.add=function (city) {
        order.add(city);
        order.saveData();
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
                  if(!order.check($scope.chosenCity)){
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

  .controller('registerCtrl',['$scope', '$http', function($scope,$http, $ionicModal, $timeout,$location) {
      $scope.registerStaute = false;
      $scope.regisoterBingo = false;
      $scope.regisoterError = false;
      $scope.submitted = false;
      $scope.onSubmit = function () {
        if ($scope.myRegister.$valid){
          var param = {
                          Username:  $scope.username,
                          Stuid: $scope.stuid,
                          Classid: $scope.classid,
                          Pwd: $scope.pwd,
                          rPwd: $scope.rpwd
                      };
          $http({
            method:'POST',
            url:'http://localhost:8197/insertUserinfo',
            headers:{
              'Content-Type' : 'application/x-www-form-urlencoded'
            },
            data:param
          }).then(function success(res) {
              console.log('ok');
              console.log(param);
              console.log(res)
              if(res.data.registerStatus== 'error'){
                $scope.registerStaute = true;
              }else{
                $scope.regisoterBingo = true
              }
          },function (err) {
            console.log(err);
            $scope.regisoterError = true;
          })
        }else{
          $scope.submitted = true;
        }
      }
    }])

  .controller('loginCtrl',['$scope', '$http', function($scope, $http, $ionicModal, $timeout,$location){
      // $scope.formModel = {};
      $scope.loginBingo = false;
      $scope.loginError = false;
      $scope.submitted = false;
      $scope.onSubmit = function(){
        if ($scope.myLogin.$valid) {
          var param = {
            Stuid: $scope.userid,
            Pwd: $scope.password
          };
          $http({
            method:'POST',
            url:'http://localhost:8197/selectUserinfo',
            headers:{
              'Content-Type' : 'application/x-www-form-urlencoded'
            },
            data:param
          }).then(function success(res) {
            console.log('ok');
            console.log(res)
            if(res.data.loginStatus == 'error'){
              // $scope.registerStaute = true;
             $scope.loginError = true;
              console.log('login error')
            }else{
              console.log('login bingo');
              $scope.loginBingo = true;
            }
          },function (err) {
            console.log(err);
          });

          console.log(param);
        }else{
          $scope.submitted = true;
        }
      }
    }])

  .controller('homePageCtrl',function($scope,$location,homePage){
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
    $scope.mess = function(){
      $location.url('/mess')
    };

    $scope.homePageFn = homePage.homePageInit();
    console.log(homePage)

  })

  .controller('messCtrl',function($scope,$location,mess){
    $scope.mess = function(){
      //$location.url('/mess')
    };
    $scope.messFn = mess.messInit();
    console.log(mess)
  })

  .controller('shopCtrl',['$http','$scope','$rootScope','$location','$ionicPopup','$ionicHistory','$stateParams','shop',function($http,$scope,$rootScope,$location,$ionicPopup,$ionicHistory,$stateParams,shop){
    $rootScope.showHeader = false;
    //获取url参数:id
    console.log($stateParams.id);
    // $scope.shopFn = shop.shopInit();
    // $scope.test = function () {
      var shopDataParam = {
        ParamId: $stateParams.id
      };
      $scope.shopData = [
        /**
         * {shopImg:'img/logo.png',
         * shopName:'黄焖鸡米饭',
         * shopHref:'#/greens',
         *  shopDescription:'黄焖鸡蜜柑来自于'}
         */
      ];
      $http({
        method: 'POST',
        url: 'http://localhost:8198/shopData',
        headers:{
          'Content-Type' : 'application/x-www-form-urlencoded'
        },
        data:shopDataParam
      }).then(function successCallback(response) {
        console.log(response);
        var tmpshopData = {};
        console.log(response.data);
        tmpshopData = response.data;
        /**
         * s_description:"米饭店铺的描述"
         * s_image:"img/shop1.jpg"
         * s_nickname:"米饭店铺"
         * s_rest:""
         * sf_id:0
         * sid:1
         */
        for (var i = 0; i < tmpshopData.length; i++) {
          $scope.shopData.push({
            shopHref: '#/greens/'+tmpshopData[i].sid,
            shopName: tmpshopData[i].s_nickname,
            shopImg: tmpshopData[i].s_image,
            shopDescription: tmpshopData[i].s_description
          })
        }
      }, function errorCallback(response) {

      });
    // };
    // $scope.test();
    $scope.shopFn = $scope.shopData;
  }])

  .controller('greensCtrl',function($scope,$location,greens,$http,$stateParams){
    // console.log(greens.greensInit());
    // $scope.greensFn = greens.greensInit();
    var greensDataParam = {
      ParamId: $stateParams.id
    };
    $scope.greenData = [
      /*
       * {cgreensHref:'#/details',
       * greensImg:'img/banner1.jpg',
       * greensName:'鱼香肉丝',
       * greensDescription:'鱼香肉丝（英文名：Stir-fried Pork Strips in Fish Sauce）是一道特色传统名菜，以鱼香调味而得名，属川菜。相传',
       * greensPrice:'22'},
       */
    ];
    $http({
      method: 'POST',
      url: 'http://localhost:8198/greensData',
      data: greensDataParam,
      headers:{
        'Content-Type' : 'application/x-www-form-urlencoded'
      }
    }).then(function successCallback(response) {
      console.log(response);
      var tmpGreensData = {};
      console.log(response.data);
      tmpGreensData = response.data;
      for (var i = 0; i < tmpGreensData.length; i++) {
        $scope.greenData.push({
          greensHref: '#/details/'+tmpGreensData[i].gid,
          greensImg: tmpGreensData[i].images,
          greensName: tmpGreensData[i].g_nickname,
          greensDescription: tmpGreensData[i].g_desciption,
          greensPrice: tmpGreensData[i].price
        })
      }

    }, function errorCallback(response) {

    });
    $scope.greensFn = $scope.greenData;

  })

  .controller('detailsCtrl',function($scope,$location,$http,$stateParams){
    var greensDetailsDataParam = {
      ParamId: $stateParams.id
    };
    $scope.greensDetailsData = [];
    $http({
      method: 'POST',
      url: 'http://localhost:8198/greensDetailsData',
      data: greensDetailsDataParam,
      headers:{
        'Content-Type' : 'application/x-www-form-urlencoded'
      }
    }).then(function successCallback(response) {
      console.log(response);
      var tmpGreensData = {};
      console.log(response.data);
      tmpGreensData = response.data;
      for (var i = 0; i < tmpGreensData.length; i++) {
        $scope.greensDetailsData.push({
          greensImg: tmpGreensData[i].images,
          greensDetailsName: tmpGreensData[i].g_nickname,
          greensDetailsDescription: tmpGreensData[i].g_desciption,
          greensDetailsPrice: tmpGreensData[i].price
        })
      }
    }, function errorCallback(response) {
    });
    $scope.greenDetailsFn = $scope.greensDetailsData;
    console.log($scope.greenDetailsFn)
  })

  // 验证两次输入的密码是否相同的自定义验证
  .directive('pwdRepeat', function () {
    return {
      require: 'ngModel',
      link: function (scope, ele, attrs, ctrl) {
        ctrl.$validators.pwdRepeat = function (modelValue) {
          // 当值为空时，通过验证，因为有required
          if (ctrl.$isEmpty(modelValue)) {
            return true;
          }
          console.log(scope.pwd)
          return modelValue === scope.pwd ? true : false;
        }
      }
    }
  });

