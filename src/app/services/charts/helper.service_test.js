'use strict';

describe('chart.helperService', function() {

    var chartHelperService;

    beforeEach(module('tillerWebApp'));

    beforeEach(inject(function ($injector) {
        chartHelperService = $injector.get('chart.helperService');
    }));

    it('should have a wrapSVGText method', function() {
        expect(angular.isFunction(chartHelperService.wrapSVGText)).toBe(true);
    });

    it('should have a wrapSVGText method', function() {
        expect(angular.isFunction(chartHelperService.getTheD3TextWidth)).toBe(true);
    });

});