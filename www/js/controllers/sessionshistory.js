
angular.module('hdrApp')
    .controller('SessionshistoryController', function ($scope, hdrdbx) {

        //$state.go($state.current, $stateParams, {reload: true, inherit: false});
        //$watch

        $scope.sessionshistories = [];

        $scope.$on('$ionicView.enter', function () {
            $scope.selectSessionsHistory();
        });

        
        
        
        $scope.selectSessionsHistory = function () {


            hdrdbx.selectRows('session', " 1=1 order by unix_time desc")
                .then(function (sessions_arr) {

                    hdrdbx.sessions_view_obj_arr = [];
                    //var start_index = hdrdbx.sessions_view_obj_arr.length > 0 ? hdrdbx.sessions_view_obj_arr.length - 1 : 0;
                    hdrdbx.selectSessionsView2(sessions_arr, 0, sessions_arr.length,
                        function () {
                            $scope.sessionshistories = hdrdbx.sessions_view_obj_arr;
                        });
                }, function (err) {
                    console.log(err);
                })
        }

    });
