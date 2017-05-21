angular.module('ServiceModule',[])

  .service('homePage',function (homePageData) {
    var hotGreens = [];
    return{
      homePageInit : function () {
        hotGreens = homePageData.all();
        return hotGreens
      }
    }
  })
  .service('setting',function (settingData) {
    var setting = [];
    return{
      settingInit : function () {
        console.log(setting)
        setting = settingData.all();
        return setting
      }
    }
  })
  .service('mess',function(messData){
    var mess = [];
    console.log(mess);
    console.log(messData.all());
    return {
      messInit : function(){
        console.log(mess);
        mess = messData.all();
        return mess;
      }
    }
  })//获取食堂列表messData数据
  .factory('homePageData',function ($http) {
    var greenData = [
      /*
       * {cgreensHref:'#/details',
       * greensImg:'img/banner1.jpg',
       * greensName:'鱼香肉丝',
       * greensDescription:'鱼香肉丝（英文名：Stir-fried Pork Strips in Fish Sauce）是一道特色传统名菜，以鱼香调味而得名，属川菜。相传',
       * greensPrice:'22'},
       */
    ];
    $http({
      method: 'GET',
      url: 'http://localhost:8198/greensDataIndex'
    }).then(function successCallback(response) {
      console.log(response);
      var tmpGreensData = {};
      console.log(response.data);
      tmpGreensData = response.data;
      for (var i = 0; i < tmpGreensData.length; i++) {
        greenData.push({
          greensHref: '#/details/'+tmpGreensData[i].gid,
          greensImg: tmpGreensData[i].images,
          greensName: tmpGreensData[i].g_nickname,
          greensDescription: tmpGreensData[i].g_desciption,
          greensPrice: tmpGreensData[i].price
        })
      }
    }, function errorCallback(response) {});
    return{
      all: function () {
        return greenData;
      }
    }
  })
  .factory('messData',function($http){
    var messData = [
      // {
      //   messPerson:'管理员',
      //   messPersonImg:'img/logo.png',
      //   messName:'南区一食堂',
      //   messIntroduce:'南区1食堂的描述',
      //   messImg:'img/banner_1.jpg ',
      //   messHref:'#/shop?id=001',
      //   messHrefDescription:' '
      // },
    ];
    $http({
      method: 'GET',
      url: 'http://localhost:8198/messData'
    }).then(function successCallback(res) {
      console.log(res);
      var tmpmessData = {};
      console.log(res.data);
      tmpmessData = res.data;
      for (var i = 0; i < tmpmessData.length; i++) {
        messData.push({
          messPerson: '工作人员'+tmpmessData[i].mid,
          messHref: '#/shop/'+tmpmessData[i].mid,
          messName: tmpmessData[i].m_nickname,
          messPersonImg: tmpmessData[i].m_image,
          messHrefDescription: tmpmessData[i].m_description,
          messImg: tmpmessData[i].m_image
        })
      }
    }, function errorCallback(res) {

    });
    return {
      all : function(){
        console.log(messData);
        return messData;
      }
    }
  })
  .factory('settingData',function ($http) {
      var settingData = [];
      $http({
        method:'GET',
        url:'http://localhost:8198/setting'
      }).then(function  successCallback(res) {
        var tmpsettingData = {};
        tmpsettingData = res.data;
        console.log(tmpsettingData);
        for(var i = 0; i< tmpsettingData.length; i++){
          settingData.push({
            settingUser: tmpsettingData[i].username,
            settingClass: tmpsettingData[i].classid,
            settingGrade: tmpsettingData[i].grade
          })
        }

      });
    return {
      all : function(){
        return settingData;
      }
    }
  })
  .factory('localstorage',['$window',function ($window) {
    return{
      set:function (key,value) {
        $window.localStorage[key] = value;
      },
      get:function (key,defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      setObject:function(key, value){
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject:function (key) {
        return JSON.parse($window.localStorage[key] || '{}');
      },
      removeObject:function(key){
        return $window.localStorage.removeItem(key);
      },
      clearLocalStorage:function(){
        return $window.localStorage.clear();
      }
    }
  }])//创建localStorage模型
  .factory('host',function () {
    return {
      localNet: 'http://127.0.0.1'
      // localNet: 'http://120.24.244.81'
      // localNet: 'http://192.168.1.1'
    }
  });



