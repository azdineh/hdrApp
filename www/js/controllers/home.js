angular.module('hdrApp')
    .controller('HomeController', function ($scope, $http, $rootScope, $window, hdrFileSystem, $ionicPlatform, hdrdbx) {

        $scope.page = "home";
        $rootScope.deviceWidth = $window.innerWidth;
        $rootScope.deviceHeight = $window.innerHeight;

        /* $rootScope.today = moment().local('ar-ma').format('dddd Do MMMM YYYY'); */

    

        $scope.$on('$ionicView.enter', function () {
            $rootScope.today = Date.now();
        })

        $rootScope.academy = $window.localStorage['hdr.academy'] ? angular.fromJson($window.localStorage['hdr.academy']) : {};
        $rootScope.rd = $window.localStorage['hdr.rd'] ? angular.fromJson($window.localStorage['hdr.rd']) : {};
        $rootScope.school = $window.localStorage['hdr.school'] ? angular.fromJson($window.localStorage['hdr.school']) : {};
        $rootScope.teacher = $window.localStorage['hdr.teacher'] ? angular.fromJson($window.localStorage['hdr.teacher']) : {};

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









    });

angular.module('hdrFilters', [])
    .filter('hdrage', function () {

        /**
        * return Date()
        * @param  {string} FrShortDateString string present french short date format like : dd/mm/yyyy
        * @return {Date}  Date object.
        */
        var parseShortDate = function (FrShortDateString) {
            console.log(FrShortDateString)
            var str = FrShortDateString.trim();
            var dd = parseInt(str.substr(0, 2));
            var mm = parseInt(str.substr(3, 2)) - 1; // JS counts months from 0 to 11;
            var yyyy = parseInt(str.substr(6, 4));

            return new Date(yyyy, mm, dd);
        };

        /**
         * calculate the age from a simple string format of the date
         * @param  {string} dateSimpleStringFormat this param present a date with format : dd/mm/yyyy
         * @return {string} the age, Example: if the age=16.7 return 16.5,
         * if the age= 16.3 rerun 16.
     *  */
        var calculateAge = function (dateSimpleStringFormat) {
            var age = 0;
            var birthdate = parseShortDate(dateSimpleStringFormat);

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
            return calculateAge(input);
        };


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