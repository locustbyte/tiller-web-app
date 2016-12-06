'use strict';

describe('chart.assetAllocationService', function() {

    var chartAssetAllocationService;

    beforeEach(module('tillerWebApp'));

    beforeEach(inject(function ($injector) {
        chartAssetAllocationService = $injector.get('chart.assetAllocationService');
    }));

    it('should have a getAllocationSize method', function() {
        expect(angular.isFunction(chartAssetAllocationService.getAllocationSize)).toBe(true);
    });

});