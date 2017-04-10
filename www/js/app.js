// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('hdrApp', ['ionic','hdrFilters','ngCordova'])

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js

    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.navBar.alignTitle('center');
    //$ionicConfigProvider.views.transition('none');    

    $stateProvider
        .state('prehome',{
            url:'/prehome',
            templateUrl :'views/prehome.html',
            controller :'PrehomeController'
        })
    // setup an abstract state for the tabs directive
        .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'views/tabs.html'
        })
        // Each tab has its own nav history stack:
        .state('tab.home', {
            url: '/home',
            views: {
                'tab-home': {
                    templateUrl: 'views/home/view.html',
                    controller: 'HomeController'
                }
            }
        }).state('tab.classrooms', {
            url: '/classrooms',
            views: {
                'tab-classrooms': {
                    templateUrl: 'views/classrooms/view.html',
                    controller: 'ClassroomsController'
                }
            }
        })
        .state('tab.classroom', {
            url: '/classrooms/classroom/:classroomid',
            views: {
                'tab-classrooms': {
                    templateUrl: 'views/classrooms/classroom/view.html',
                    controller: 'ClassroomController'
                }
            }
        })
        .state('tab.appeal', {
            url: '/classrooms/appeal/:classroomid',
            views: {
                'tab-classrooms': {
                    templateUrl: 'views/classrooms/appeal/view.html',
                    controller: 'AppealController'
                }
            }
        })
        .state('tab.absencehistory', {
            url: '/absencehistory',
            cache:false,
            views: {
                'tab-absencehistory': {
                    templateUrl: 'views/absencehistory/view.html',
                    controller: 'AbsencehistoryController'
                }
            }
        })

        .state('tab.user', {
            url: '/user',
            views: {
                'tab-user': {
                    templateUrl: 'views/user/view.html',
                    controller: 'UserController'
                }
            }
        });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/prehome');
})




.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        navigator.splashscreen.hide();
    });
});
