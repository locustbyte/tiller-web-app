'use strict';

angular.module('chart.responsiveService', [])
    /*
     * Holds the user data collected within the app
     */
    .service('chart.responsiveService', ['$rootScope', '$window', '$timeout', function ($rootScope, $window, $timeout) {

        var chart = this;

        chart.breakpoints = {
            0: 480,
            1: 767,
            2: 991,
            3: 1199,
            4: 1600,
            5: 100000
        };

        chart.oldWidth = angular.element($window).width();

        chart.setCurrentBreakPoint = function(){

            var loop = true;

            angular.forEach(chart.breakpoints, function(value, key){

                if(loop && chart.oldWidth <= value)
                {
                    chart.breakpoint = parseInt(key);
                    loop = false;
                }
            });

        };

        chart.setCurrentBreakPoint();

        angular.element($window).on('resize', function(e){

            chart.maybeSendBroadcast(angular.element($window).width(), e);

        });

        chart.maybeSendBroadcast = function(width, e)
        {

            //e.stopPropagation();

            var limit = chart.breakpoints[chart.breakpoint],
                broadcast = false;

            //console.log('Responsive service pre-logic', chart, 'limit' , limit, 'broadcast', broadcast);

            if(width < chart.oldWidth)
            {
                if(chart.breakpoint !== 0)
                {
                    limit = chart.breakpoints[chart.breakpoint - 1];

                    if(width <= limit)
                    {
                        broadcast = true;
                        chart.breakpoint = chart.breakpoint - 1;
                    }
                }
            }
            else if(width > chart.oldWidth)
            {
                if(width >= limit)
                {
                    broadcast = true;
                    if(chart.breakpoint !== chart.breakpoints.length -1)
                    {
                        chart.breakpoint = chart.breakpoint + 1;
                    }
                }
            }

            chart.oldWidth = width;

            //console.log('Responsive service post-logic', chart, 'limit' , limit, 'broadcast', broadcast);

            if(broadcast)
            {
                $timeout(function(){
                    $rootScope.$broadcast('breakpoint.new', chart.breakpoint);
                }, 250);
            }
        };

    }]);