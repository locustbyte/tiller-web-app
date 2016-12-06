'use strict';

describe('discovery.charts.futurePerformanceCtrl', function() {

    beforeEach(module('tillerWebApp'));

    var $controller;

    beforeEach(inject(function(_$controller_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;

    }));


    describe('$scope', function(){

        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller('discovery.charts.futurePerformanceCtrl', { $scope: $scope });
        });

        it('should have a chartData key of medians which is an object', inject(function() {

            expect(typeof $scope.chartData.medians).toEqual('object');

        }));

        it('$scope.getClass should equal "animate-scale-up opacity opacity-1 z-index z-index-neutral" on it\'s own route', inject(function() {

            $scope.state = 'discovery.charts.futurePerformance';

            expect($scope.getClass()).toEqual('animate-scale-up opacity opacity-1 z-index z-index-neutral');

        }));

    });

});