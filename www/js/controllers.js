angular.module('CtrlModule', ['ServiceModule','ionic'])
  .controller('LeftCtrl',function($scope,$location,localstorage){
    //		console.log("you")

    $scope.abs = '1231231231';
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
    $scope.settingData = [];
    if( localstorage.getObject('ecjtu_auth').username != undefined ){
      console.log(localstorage.getObject('ecjtu_auth'));
      var userInfos = localstorage.getObject('ecjtu_auth');
      $scope.settingData.push({
        settingUser: userInfos.username
      });
      console.log( $scope.settingData);
      $scope.settingFn =  $scope.settingData;
    }else{
      $scope.settingData.push({
        settingUser: '您未登录请登录'
      });
      console.log($scope.settingData);
      $scope.settingFn =  $scope.settingData;
    }

  })

  .controller('tabCtrl', function ($scope, $ionicModal, $ionicPopover) {
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

  .controller('commentCtrl',function($scope,$http,$location,localstorage){
    $scope.shopPlace = function (num) {
      var tempplace = '';
      switch (num)
      {
        case 1:
          tempplace="南区第一食堂";
          break;
        case 2:
          tempplace="南区第二食堂";
          break;
        case 3:
          tempplace="南区第三食堂";
          break;
        case 4:
          tempplace="南区第四食堂";
          break;
        case 5:
          tempplace="北区第一食堂";
          break;
        case 6:
          tempplace="北区第二食堂";
          break;
        case 7:
          tempplace="北区第三食堂";
          break;
        case 8:
          tempplace="北区第四食堂";
          break;
      }
      return tempplace
    };
    $scope.commentData = [];
    var param = { 'uid' :localstorage.getObject('ecjtu_auth').uid};
    console.log(localstorage.getObject('ecjtu_auth').uid);
    $http({
      method: 'POST',
      url: 'http://localhost:8198/comment',
      headers:{
        'Content-Type' : 'application/x-www-form-urlencoded'
      },
      data:param
    }).then(function successCallback(res) {
      var tempCommentData = {};
      console.log(res);
      tempCommentData = res.data;
      for(var i = 0;i<tempCommentData.length;i++){
        $scope.commentData.push({
          commentImg:tempCommentData[i].images,
          commentStar:tempCommentData[i].cgrade,
          commentNickname:tempCommentData[i].g_nickname,
          commentShopPlace:$scope.shopPlace(tempCommentData[i].sf_id),
          commentText:tempCommentData[i].ccomment
        })
      }

      $scope.commentFn = $scope.commentData;
    }, function errorCallback(response) {

    })
  })

  .controller('settingCtrl',function($scope,localstorage,$location){
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

  .controller('detailCtrl', function($scope,$http,localstorage) {
      console.log('detailCtrl');
      $scope.detailData = [];
      var userid = localstorage.getObject('ecjtu_auth').uid,
      param = {'userid':userid};
      $http({
        method:'POST',
        url:'http://localhost:8198/getDetaillist',
        headers:{
          'Content-Type' : 'application/x-www-form-urlencoded'
        },
        data:param
      }).then(function success(res) {
        console.log(res.data);
        for(var i = 0;i<res.data.length;i++){
          $scope.detailData.push({
              'detailImg':res.data[i].images,
              'detailName':res.data[i].g_nickname,
              'detailgetCode':res.data[i].getcode,
              'detailprice':res.data[i].oprice
          })
        }
        console.log( $scope.detailData);
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

  .controller('registerCtrl',['$scope','$http','$timeout',function($scope,$http,$timeout) {
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
              console.log(res);
              if(res.data.registerStatus == 'error'){
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
    $scope.messFn = mess.messInit();
    console.log(mess)
  })

  .controller('evaluateCtrl',function ($scope,$rootScope,$http,$timeout,localstorage) {
    $scope.greensInfos = localstorage.getObject('evaluate');
    console.log($scope.greensInfos);
    var evauid =  localstorage.getObject('ecjtu_auth').uid;
    $scope.onSubmit = function(){
      console.log($scope.evaComment);

      console.log($rootScope.pointStar);
      console.log(evauid);
      console.log($scope.greensInfos.gid);
      var evaDate = new Date();
      if($scope.evaComment == undefined){
        $scope.evaComment = '没有评价信息';
        console.log($scope.evaComment);
      }
      var param = {
          'ccomment' : $scope.evaComment,
          'cgrade' : $rootScope.pointStar,
          'uid' : evauid,
          'gid': $scope.greensInfos.gid,
          'ctime':evaDate.getTime()
      };
      $http({
        method: 'POST',
        url: 'http://localhost:8198/evaluate',
        headers:{
          'Content-Type' : 'application/x-www-form-urlencoded'
        },
        data:param
      }).then(function successCallback(res) {
        console.log(res);
      }, function errorCallback(response) {

      })
    }
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

  .controller('detailsCtrl',function($scope,$location,$http,$stateParams,$ionicPopup,localstorage){
    var greensDetailsDataParam = {
      ParamId: $stateParams.id
    },
    detailData = [];
    $scope.greensDetailsData = [];
    $scope.buygid = 0;
    $scope.yzm = '';
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
      $scope.buygid = detailData.gid;
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
            $scope.yzm = res.data.getcodetemp;
            console.log(res.data.getcodetemp);
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
      }).then(function() {
          var confirmPopup = $ionicPopup.confirm({
            title: '取货码',
            template: '取货码为'+$scope.yzm+',点击跳转后到菜品评价页面',
            cancelText:'取消',
            okText:'确认'
          });
          confirmPopup.then(function(resp) {
            console.log(resp);
            if(resp) {
              console.log('You are sure');
              console.log('/evaluate/'+$scope.buygid);
              $location.url('/evaluate/'+$scope.buygid);
              // $location.url('/login');
              // localstorage.removeObject('evaluate');
              if(localstorage.getObject('evaluate')){
                localstorage.removeObject('evaluate');
              }
              localstorage.setObject('evaluate', {
                'gid': $scope.buygid,
                'gname': $scope.greensDetailsData[0].greensDetailsName,
                'gimg':  $scope.greensDetailsData[0].greensImg
              })
            } else {
              console.log('You are not sure');
            }
          });
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
  })
  /**
   * 评价星星选择控件
   */
  .directive("mystarselect", function ($rootScope) {
      $rootScope.pointStar = 0
      return {
          restrict: 'AE',
          replace: true,
          scope: {
            level: '='
          },
          template: '<div id="mystarselect"></div>',
          link: function (scope) {
            function star5(starid) {
              src = "img/";
              this.star_on_left = src + "star.png";
              this.star_off_left = src + "starBack.png";
              this.star_on_right = src + "star.png";
              this.star_off_right = src + "starBack.png";
              this.id = starid;
              this.point = 0;

              this.initial = starInitial;
              this.redraw = starRedraw;
              this.attach = starAttach;
              this.deattach = starDeAttach;
              this.doall = starDoall;
            }

            function starDoall(point) {
              this.initial();
              this.attach();
              this.redraw(point);
            }

            function starInitial() {
              var html = "<div style='float:left'>" +
                "<img class='zt-star-size'  id='star" + this.id + "_1' point='1' src='" + this.star_off_right + "'>&nbsp;";
              html += "<img class='zt-star-size' id='star" + this.id + "_2' point='2' src='" + this.star_off_right + "'>&nbsp;";
              html += "<img class='zt-star-size' id='star" + this.id + "_3' point='3' src='" + this.star_off_right + "'>&nbsp;";
              html += "<img class='zt-star-size' id='star" + this.id + "_4' point='4' src='" + this.star_off_right + "'>&nbsp;";
              html += "<img class='zt-star-size' id='star" + this.id + "_5' point='5' src='" + this.star_off_right + "'>" + "</div>";
              //document.write(html);
              document.getElementById("mystarselect").innerHTML = html;
            }

            function starAttach() {
              for (var i = 1; i < 6; i++) {
                document.getElementById("star" + this.id + "_" + i).style.cursor = "pointer";
                document.getElementById("star" + this.id + "_" + i).onmouseover = moveStarPoint;
                document.getElementById("star" + this.id + "_" + i).onmouseout = outStarPoint;
                document.getElementById("star" + this.id + "_" + i).starid = this.id;
                document.getElementById("star" + this.id + "_" + i).onclick = setStarPoint;
              }
            }

            function starDeAttach() {
              for (var i = 1; i < 6; i++) {
                document.getElementById("star" + this.id + "_" + i).style.cursor = "default";
                document.getElementById("star" + this.id + "_" + i).onmouseover = null;
                document.getElementById("star" + this.id + "_" + i).onmouseout = null;
                document.getElementById("star" + this.id + "_" + i).onclick = null;
              }
            }

            function starRedraw(point) {
              for (var i = 1; i < 6; i++) {
                if (i <= point)
                  if (parseInt(i / 2) * 2 == i)
                    document.getElementById("star" + this.id + "_" + i).src = this.star_on_right;
                  else
                    document.getElementById("star" + this.id + "_" + i).src = this.star_on_left;
                else if (parseInt(i / 2) * 2 == i)
                  document.getElementById("star" + this.id + "_" + i).src = this.star_off_right;
                else
                  document.getElementById("star" + this.id + "_" + i).src = this.star_off_left;
              }
            }

            function moveStarPoint(evt) {
              var pstar = evt ? evt.target : event.toElement;
              var point = pstar.getAttribute("point");
              var starobj = new star5(pstar.starid);
              starobj.redraw(point);
            }

            function outStarPoint(evt) {
              var pstar = evt ? evt.target : event.srcElement;
              var starobj = new star5(pstar.starid);
              starobj.redraw(0);
            }

            function setStarPoint(evt) {
              var pstar = evt ? evt.target : event.srcElement;
              var starobj = new star5(pstar.starid);
              starobj.deattach();
              var n = pstar.getAttribute("point");
              console.log("选择的等级:" + n);
              scope.level = n;
              starobj.doall(n);
              $rootScope.pointStar = n;
              console.log($rootScope.pointStar)
            }

            var star = new star5("point");
            star.doall(5);
          }
        };
  });

