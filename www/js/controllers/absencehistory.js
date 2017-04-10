
angular.module('hdrApp')
    .controller('AbsencehistoryController', function ($scope, hdrdb) {

        //$state.go($state.current, $stateParams, {reload: true, inherit: false});
        //$watch
        hdrdb.selectSessionsHistories()
        .then(function(res){
            $scope.sessionshistories=res;
        },function(err){
            $scope.sessionshistories=[];
            $scope.msg="لم يتم تسجيل أية حصة حتى الآن";
            console.log(err);
        });


    });
