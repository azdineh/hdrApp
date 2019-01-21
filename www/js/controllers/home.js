angular.module('hdrApp')
    .controller('HomeController', function ($scope, $http, $state, $rootScope, $location,
        $timeout, $ionicScrollDelegate, $window, hdrFileSystem,
        $ionicPlatform, hdrdbx) {

        $scope.page = "home";
        /*       $rootScope.deviceWidth = $window.innerWidth;
                $rootScope.deviceHeight = $window.innerHeight; */

        $rootScope.classrooms_view = $window.localStorage['hdr.classrooms_view'] ? angular.fromJson($window.localStorage['hdr.classrooms_view']) : [];
        $rootScope.students_count_global = $window.localStorage['hdr.students_count_global'] ? angular.fromJson($window.localStorage['hdr.students_count_global']) : 0;
        $rootScope.daies = [];


        $rootScope.hideTab = false;
        // if($state.current.name==""

        window.addEventListener('keyboardDidShow', function (event) {
            /*       console.log("intial content height : " + $rootScope.session_alter_content_height);
                  console.log("keyboad height : " + event.keyboardHeight);
      
                  var contentHeight = document.getElementById('hdr-sessionalter-content').clientHeight;
                  console.log("current content height :" + contentHeight); */


            /*5) */

            //$rootScope.keyboraedShown = true;

            /*             $timeout(function () {
                            $location.hash("hdr-anchre1");
                            $ionicScrollDelegate.$getByHandle('mainScroll').anchorScroll(true);
                        }, 50) */


        });

        window.addEventListener('keyboardDidHide', function () {
            // $ionicScrollDelegate.scrollBottom();
            /*  var contentHeight = document.getElementById('hdr-sessionalter-content').clientHeight;
             console.log("current content height :" + contentHeight); */

            //document.getElementById('hdr-sessionalter-content').style.height = $rootScope.session_alter_content_height + "px";

            /**/

            /*             $ionicScrollDelegate.$getByHandle('mainScroll').resize();
                        // $ionicScrollDelegate.$getByHandle('mainScroll').resize();
                        $timeout(function () {
                            $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
                        }, 50) */

            //$rootScope.keyboraedShown = false;

        });

        window.addEventListener('keyboardWillShow', function () {

        });

        window.addEventListener('keyboardWillHide', function () {

        });

        /* $rootScope.today = moment().local('ar-ma').format('dddd Do MMMM YYYY'); */



        $scope.$on('$ionicView.enter', function () {
            $rootScope.today = Date.now();
        })
        /* 
                $rootScope.academy = $window.localStorage['hdr.academy'] ? angular.fromJson($window.localStorage['hdr.academy']) : {};
                $rootScope.rd = $window.localStorage['hdr.rd'] ? angular.fromJson($window.localStorage['hdr.rd']) : {};
                $rootScope.school = $window.localStorage['hdr.school'] ? angular.fromJson($window.localStorage['hdr.school']) : {};
                $rootScope.teacher = $window.localStorage['hdr.teacher'] ? angular.fromJson($window.localStorage['hdr.teacher']) : {}; */

        $rootScope.isDBThere = false;

        var wind;

        $scope.btnWind = function () {
            console.log(wind);
        }

        if (ionic.Platform.isWebView()) {
            $ionicPlatform.ready(function () {
                hdrdbx.openDB();
            });
        }
        else {// browser 

        }

        $scope.goToBlog = function () {
            cordova.InAppBrowser.open("http://7odoor.blogspot.com/", '_system');
        }








    });

angular.module('hdrFilters', [])
    .filter('hdrage', function (azdutils) {



        /**
         * calculate the age from a simple string format of the date
         * @param  {string} dateSimpleStringFormat this param present a date with format : dd/mm/yyyy
         * @return {string} the age, Example: if the age=16.7 return 16.5,
         * if the age= 16.3 rerun 16.
     *  */
        var calculateAge = function (dateSimpleStringFormat) {
            var age = 0;
            var birthdate = azdutils.dateTo_ISO8601(dateSimpleStringFormat);

            var ageDifMs = Date.now() - birthdate.getTime();
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            var ageYear = Math.abs(ageDate.getUTCFullYear() - 1970);
            var ageMonth = ageDate.getUTCMonth();

            if (ageMonth <= 6) {
                age = ageYear + " عام ";
            }
            else {
                age = ageYear + " عام ونصف";
            }
            return age;

        };

        return function (input) {
            if (input)
                return calculateAge(input);
            else
                return "العمر غير متوفر"
        };


    })
    .filter('hdrFullDate', function (azdutils, $filter) {
        return function (input) {

            if (input)
                return $filter('date')(azdutils.dateTo_ISO8601(input), 'fullDate');
            else
                return "تاريخ الأزدياد غير متوفر";
        }
    })
    .filter('hdrnumber', function () {
        return function (input) {
            var hdrnumber = '00';
            if (input <= 9) {
                hdrnumber = '0' + input;
            } else {
                hdrnumber = input;
            }
            return hdrnumber;
        }
    })
    .filter('hdrmassarnumber', function () {
        return function (input) {

            var str = new String(input);
            if (str.length > 5) {
                return input
            }
            else
                return "رقم مسار غير متوفر"
        }
    })
    .filter('hdrparity', function () {
        return function (input) {
            var hdrparity = '';
            if (input == 'odd') {
                hdrparity = 'فرديين';
            } else if (input == 'even') {
                hdrparity = 'زوجيين';
            }

            return hdrparity;
        }
    })
    .filter('hdrsession', function () {
        return function (input) {
            var sess = "";
            if (input == 1)
                sess = "حصة واحدة";
            if (input == 2)
                sess = "حصتين";
            if (input == 3)
                sess = "ثلاث حصص";
            if (input == 4)
                sess = "أريع حصص";
            if (input == 5)
                sess = "خمس حصص";
            if (input > 5)
                sess = input + " حصص";

            return sess;
        }
    });