angular.module('myApp', ['ionic','CtrlModule'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
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

  .state('tab.order', {
      url: '/order',
      views: {
        'tab-order': {
          templateUrl: 'templates/tab-order.html',
          controller: 'orderCtrl'
        }
      }
    })

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
  .state('tab.search', {
    url: '/tab-search',
    views: {
      'tab-search': {
        templateUrl: 'templates/tab-search.html',
        controller: 'tabsearchCtrl'
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
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('mess', {
      url: '/mess',
      views: {
        'index_nav_view': {
          templateUrl: 'templates/mess.html',
          controller: 'messCtrl'
        }
      }
   })

    .state('shop', {
      url: '/shop',
      views: {
        'index_nav_view': {
          templateUrl: 'templates/shop.html',
          controller: 'shopCtrl'
        }
      }
    })

    .state('greens', {
      url: '/greens',
      views: {
        'index_nav_view': {
          templateUrl: 'templates/greens.html',
          controller: 'greensCtrl'
        }
      }
    })

    .state('details', {
      url: '/details',
      views: {
        'index_nav_view': {
          templateUrl: 'templates/details.html',
          controller: 'detailsCtrl'
        }
      }
    })



  $urlRouterProvider.otherwise('/tab/homePage')
});
