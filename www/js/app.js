angular.module('myApp', ['ionic','CtrlModule'])
.run(function($rootScope,$ionicPlatform,$templateCache) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
  $rootScope.$on('$routeChangeStart', function(event, next, current) {
    if (typeof(current) !== 'undefined'){
      $templateCache.remove(current.templateUrl);
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
  // 全平台兼容
    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('standard');
    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('left');
    $ionicConfigProvider.platform.ios.backButton.previousTitleText(' ').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText(' ').icon('ion-android-arrow-back');
    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');
  $stateProvider
   .state('tab', {
    url: '/tab',
    views:{
      'index_nav_view':{
          abstract: true,
          templateUrl: 'templates/tabs.html'
        }
    }
  })

  .state('tab.homePage', {
    url: '/homePage',
    views: {
      'tab-homePage': {
        templateUrl: 'templates/tab-homePage.html',
        controller: 'homePageCtrl'
      }
    }
  })

  // .state('tab.order', {
  //     url: '/order',
  //     views: {
  //       'tab-order': {
  //         templateUrl: 'templates/tab-order.html',
  //         controller: 'orderCtrl'
  //       }
  //     }
  //   })
    .state('tab.order', {
      cache: false,
      url: '/order',
      views: {
        'tab-order': {
          templateUrl: 'templates/mess.html',
          controller: 'messCtrl'
        }
      }
    })
    // .state('mess', {
    //   cache: false,
    //   url: '/mess',
    //   views: {
    //     'index_nav_view': {
    //       templateUrl: 'templates/mess.html',
    //       controller: 'messCtrl'
    //     }
    //   }
    // })
  .state('tab.detail', {
    url: '/detail',
    views: {
      'tab-detail': {
        templateUrl: 'templates/tab-detail.html',
        controller: 'detailCtrl'
      }
    }
  })


  .state('tab.comment', {
    url: '/comment',
    views: {
      'tab-comment': {
        templateUrl: 'templates/tab-comment.html',
        controller:'commentCtrl'
      }
    }
  })
    .state('tab.setting', {
      url: '/setting',
      views: {
        'tab-setting': {
          templateUrl: 'templates/tab-setting.html',
          controller: 'settingCtrl'
        }
      }
    })



  .state('login',{
    url:'/login',
    views:{
      "index_nav_view":{
          templateUrl:'templates/login.html',
          controller: 'loginCtrl'
      }
    }
  })

  .state('register',{
    url:'/register',
    views:{
      "index_nav_view":{
        templateUrl:'templates/register.html',
        controller: 'registerCtrl'
      }
    }
  })


  .state('search', {
    url: '/search',
    views: {
      'index_nav_view': {
        templateUrl: 'templates/search.html',
        controller: 'searchCtrl'
      }
    }
  })

  // .state('mess', {
  //     cache: false,
  //     url: '/mess',
  //     views: {
  //       'index_nav_view': {
  //         templateUrl: 'templates/mess.html',
  //         controller: 'messCtrl'
  //       }
  //     }
  //  })

    .state('shop', {
      cache: false,
      url: '/shop/:id',
      views: {
        'index_nav_view': {
          templateUrl: 'templates/shop.html',
          controller: 'shopCtrl'
        }
      }
    })

    // .state('AnalysisDetails',{
    //   url:'/AnalysisDetails/:id',
    //   cache: false,
    //   templateUrl:'template/AnalysisDetails.html',
    //   controller:'AnalysisDetailsCtrl'
    // })


    .state('greens', {
      url: '/greens/:id',
      views: {
        'index_nav_view': {
          templateUrl: 'templates/greens.html',
          cache: false,
          controller: 'greensCtrl'
        }
      }
    })

    .state('details', {
      url: '/details/:id',
      views: {
        'index_nav_view': {
          templateUrl: 'templates/details.html',
          controller: 'detailsCtrl'
        }
      }
    })
  $ionicConfigProvider.views.maxCache(0);
  $urlRouterProvider.otherwise('/tab/homePage')
});
