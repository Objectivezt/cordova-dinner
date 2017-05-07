angular.module('CtrlModule', ['ServiceModule','ionic'])
  .controller('LeftCtrl',function($scope,$location,localstorage,$ionicHistory){
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
    if(localstorage.getObject('ecjtu_auth').username != undefined){
      console.log(localstorage.getObject('ecjtu_auth'));
      var userInfos = localstorage.getObject('ecjtu_auth'),
        settingData = [];
      settingData.push({
        settingUser: userInfos.username,
      });
      console.log(settingData);
      $scope.settingFn = settingData;
    }
    else{
      var settingData = [];
      settingData.push({
        settingUser: '您未登录请登录'
      });
      console.log(settingData);
      $scope.settingFn = settingData;
    }

  })

  .controller('tabCtrl', function ($scope, $ionicModal, $ionicPopover,$location,$timeout) {
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

  .controller('settingCtrl',function($scope,localstorage,$location,setting){
      // $scope.settingFn = setting.settingInit();
    console.log(localstorage.getObject('ecjtu_auth').username);
      if(localstorage.getObject('ecjtu_auth').username != undefined){
         console.log(localstorage.getObject('ecjtu_auth'));
         var userInfos = localstorage.getObject('ecjtu_auth'),
             settingData = [];
             settingData.push({
               settingUser: userInfos.username,
               settingClass: userInfos.classid,
               settingGrade: userInfos.grade
             });
         console.log(settingData);
         $scope.settingFn = settingData;
      }else {
        $location.url('/login');
      }
    $scope.loginout = function(){
      localstorage.removeObject('ecjtu_auth');
      $location.url('/tab/homepage');
    };

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
      console.log('detailCtrl');
      // var timeData=new Date();
      // var month=timeData.getMonth()+1;
      // var weekday=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
      // var toweekday=timeData.getDay();
      // $scope.today=timeData.getFullYear()+'/'+month+'/'+timeData.getDate()+' '+weekday[toweekday];
      // console.log($scope.today)
      // $scope.currentDay=[];
      // for(var i=0;i<5;i++){
      //     $scope.currentDay.push(weekday[toweekday+8+i]);
      // }
      $scope.$on('$ionicView.enter', function(e) {
          $scope.order=order.initOrder();
          $ionicSlideBoxDelegate.update();
      });
  })

  .controller('searchCtrl', function($scope,$ionicPopup,$http,$location) {
      console.log('searchCtrl');
      var searchgid = '';
      $scope.getData = false;
      $scope.searchgreens = function (greensDetails) {
          $http({
            method:'POST',
            url:'http://localhost:8198/greensDetailsName',
            headers:{
              'Content-Type' : 'application/x-www-form-urlencoded'
            },
            data:{'ParamId':greensDetails}
          }).then(function success(res) {
            console.log('接口请求ok');
            console.log(res);
            if(res.data.gid){
              console.log(res.data.gid);
              searchgid = res.data.gid;
              $scope.getData = true;
            }
          },function (err) {
          }).then(function () {
            console.log($scope.getData);
            if ($scope.getData) {
              return $ionicPopup.alert({
                  title: '成功/success！',
                  template:'查询成功！'
                }).then(function() {
                  $location.url('/greens/'+ searchgid);
                });
            }else{
              $ionicPopup.alert({
                title: '失败/error！',
                template: '没有结果显示！'
              });
            }
           })
      };
      $scope.search = function (greensDetails) {
          // console.log($scope.getData);
          // console.log($scope.searchgreens(greensDetails));
          if( greensDetails == '' || greensDetails == null ){
            return $ionicPopup.alert({
              title:"注意/warning！",
              template:'搜索城市不能为空！'
            })
          } else {
            $scope.searchgreens(greensDetails);
          }
      };//搜索函数
  })

  .controller('registerCtrl',['$scope','$http','$timeout',function($scope,$http,$timeout,$interval,$ionicModal,$location) {
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
              console.log('接口请求ok');
              console.log(param);
              console.log(res)
              if(res.data.registerStatus== 'error'){
                $scope.registerStaute = true;
                $timeout(function(){
                  $scope.regisoterError = false;
                },1000);   //间隔2秒定时执行
              }else{
                $scope.regisoterBingo = true;
                $timeout(function(){
                  $scope.regisoterBingo = false;
                },1000);
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

  .controller('loginCtrl',['$scope','$http','$timeout','$location','localstorage',function($scope, $http,$timeout,$location,localstorage){
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

            if(res.data.loginStatus == 'error'){
              // $scope.registerStaute = true;
              console.log('login error');
              $scope.loginError = true;
              $timeout(function(){
                $scope.loginError = false;
              },1000);
            }else{
              console.log('login bingo');
              $scope.loginBingo = true;
              console.log(res.data);
              console.log(res.data.stuid);
              // localstorage.set('name', 'test');
              // console.log(localstorage.get('name'));
              localstorage.setObject('ecjtu_auth', {
                'uid':res.data.uid,
                'username': res.data.username,
                'stuid': res.data.stuid,
                'classid': res.data.classid,
                'grade': res.data.grade,
                'permission': res.data.permission
              });
              var infos = localstorage.getObject('ecjtu_auth');
              console.log(infos);
              $timeout(function(){
                $scope.loginBingo = false;
              },1000);
              $location.url('/tab/homepage')
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

  .controller('shopCtrl',['$http','$scope','$location','$stateParams',function($http,$scope,$location,$stateParams){
    // $rootScope.showHeader = false;
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

  .controller('greensCtrl',function($scope,$location,$http,$stateParams){
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

  .controller('detailsCtrl',function($scope,$location,$http,$stateParams,localstorage){
    var greensDetailsDataParam = {
      ParamId: $stateParams.id
    },
    detailData = [];
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
      detailData = response.data[0];
      console.log(detailData);
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
    // console.log($scope.greenDetailsFn);
    $scope.buy = function () {
      var getPerson = localstorage.getObject('ecjtu_auth');
      var buyDate = new Date();
      var buydid = 0;
      console.log(detailData.gid);
      console.log(getPerson.uid);
      console.log(buyDate.getTime());


      var buyParam = {
        'gid': detailData.gid,
        'gf_id':detailData.gf_id,
        'uid': getPerson.uid,
        'buydate':buyDate.getTime()
      };
      $http({
        url:'http://localhost:8198/greensbuy',
        method:'POST',
        data: buyParam,
        headers:{
          'Content-Type' : 'application/x-www-form-urlencoded'
        }}).then(function successCallback(res) {
          console.log(res);
          if(res.data.didObjnum){
            console.log(res);
            console.log(res.data.didObjnum);
            buydid = res.data.didObjnum;

          }
        }, function errorCallback(res) {
        }).then(function () {
          if (buydid != 0){
            $http({
              url:'http://localhost:8198/greensbuydata',
              method:'POST',
              data:{
                'buydid':buydid,
                'uid':getPerson.uid,
                'oprice': $scope.greensDetailsData[0].greensDetailsPrice,
                'gid': detailData.gid

              },
              headers:{
                'Content-Type' : 'application/x-www-form-urlencoded'
              }
            }).then(
              function successCallback(res) {
                console.log(res);
              }
            )
          }
      })



    }
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

