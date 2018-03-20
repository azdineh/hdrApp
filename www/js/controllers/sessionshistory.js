
angular.module('hdrApp')
    .controller('SessionshistoryController', function ($scope, hdrdbx, $ionicScrollDelegate) {

        //$state.go($state.current, $stateParams, {reload: true, inherit: false});
        //$watch

        $scope.daies = [];
        $scope.lastday = false;

        $scope.$on('$ionicView.enter', function () {
            if (ionic.Platform.isWebView()) {

                $scope.selectSessionsHistory(0);

            } else {

                $scope.daies = [
                    {
                        date: '1254876321545454',
                        sessions_view: [
                            {
                                session: {
                                    id: '',
                                    unix_time: '9876543210',
                                    title: '10-11',
                                    students_count: 50,
                                    parity: 'odd',
                                    observation: "حصة امتحان"

                                },
                                classroom: {
                                    title: 'TCS-3'
                                },
                                students: [
                                    {
                                        full_name: 'الرياحي منير',
                                        queuing_number: '15'
                                    },
                                    {
                                        full_name: 'كوثر الغيابة',
                                        queuing_number: '19'
                                    },
                                    {
                                        full_name: 'كمال الأجسام',
                                        queuing_number: '33'
                                    }
                                ]
                            },
                            {
                                session: {
                                    id: '',
                                    unix_time: '9876543210',
                                    title: '10-11',
                                    students_count: 50,
                                    parity: 'even',
                                    observation: "حصة امتحان"

                                },
                                classroom: {
                                    title: 'TCS-3'
                                },
                                students: [
                                    {
                                        full_name: 'الرياحي منير',
                                        queuing_number: '15'
                                    },
                                    {
                                        full_name: 'كوثر الغيابة',
                                        queuing_number: '19'
                                    },
                                    {
                                        full_name: 'كمال الأجسام',
                                        queuing_number: '33'
                                    }
                                ]
                            }
                        ]
                    }
                    ,
                    {
                        date: '125487878845454',
                        sessions_view: [
                            {
                                session: {
                                    id: '',
                                    unix_time: '9876543210',
                                    title: '10-11',
                                    students_count: 50,
                                    parity: 'all',
                                    observation: "حصة امتحان"

                                },
                                classroom: {
                                    title: 'TCS-3'
                                },
                                students: [
                                    {
                                        full_name: 'الرياحي منير',
                                        queuing_number: '15'
                                    },
                                    {
                                        full_name: 'كوثر الغيابة',
                                        queuing_number: '19'
                                    },
                                    {
                                        full_name: 'كمال الأجسام',
                                        queuing_number: '33'
                                    }
                                ]
                            }
                        ]
                    }

                ];

            }
        });




        $scope.selectSessionsHistory = function (offset) {

            var subquery = "select date(substr(unix_time,1,length(unix_time)-3), 'unixepoch') as sdate from session group by sdate order by sdate desc limit 3 offset " + offset;

            hdrdbx.selectRows('session', "date(substr(unix_time,1,length(unix_time)-3), 'unixepoch') in ( " + subquery + " ) order by unix_time desc")
                .then(function (sessions_arr) {

                    hdrdbx.daies_arr = [];
                    //var start_index = hdrdbx.sessions_view_obj_arr.length > 0 ? hdrdbx.sessions_view_obj_arr.length - 1 : 0;
                    hdrdbx.selectSessionsView2(sessions_arr, 0, sessions_arr.length,
                        function () {
                            if (offset == 0)
                                $scope.daies = hdrdbx.daies_arr;
                            else {
                                $scope.daies = $scope.daies.concat(hdrdbx.daies_arr);
                            }

                            hdrdbx.selectDaies()
                                .then(function (daies) {
                                    if (daies.length == $scope.daies.length) {
                                        $scope.lastday = true;
                                    }
                                    else {
                                        $scope.lastday = false;
                                    }
                                }, function (err) {
                                    console.log(err);
                                })


                        });
                }, function (err) {
                    console.log(err);
                })
        }

        $scope.more = function () {

            $scope.offsetStep += 3;
            $scope.selectSessionsHistory($scope.offsetStep);

        }

        $scope.offsetStep = 0;

        $scope.onSessiondbTap = function () {
            alert('dfdsfsd');
        }
    });
