'use strict';

describe('chart.assetRegionService', function() {

    var chartAssetRegionService;

    beforeEach(module('tillerWebApp'));

    beforeEach(inject(function ($injector) {
        chartAssetRegionService = $injector.get('chart.assetRegionService');
    }));

    it('should have a getRegionColour method', function() {
        expect(angular.isFunction(chartAssetRegionService.getRegionColour)).toBe(true);
    });

});