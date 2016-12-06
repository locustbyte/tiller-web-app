'use strict';

describe('chart.pastPerformanceService', function() {

    var chartPastPerformanceService;

    beforeEach(module('tillerWebApp'));

    beforeEach(inject(function ($injector) {
        chartPastPerformanceService = $injector.get('chart.pastPerformanceService');
    }));

    it('should have a setAspectRatio method', function() {
        expect(angular.isFunction(chartPastPerformanceService.setAspectRatio)).toBe(true);
    });

    it('should have a setIndiceValues method', function() {
        expect(angular.isFunction(chartPastPerformanceService.setIndiceValues)).toBe(true);
    });

});