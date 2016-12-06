'use strict';

describe('chart.securityPerformanceService', function() {

    var chartSecurityPerformanceService, securityData;

    securityData = [
        {
            "securityPerformanceId": 10946,
            "date": "2000-01-01T00:00:00",
            "totalReturn": -0.001806276812,
            "isin": "GBE102AC0B6E",
            "sedol": "BE102AC0",
            "currencyCode": "AED"
        },
        {
            "securityPerformanceId": 10947,
            "date": "2000-02-01T00:00:00",
            "totalReturn": -0.002926609635,
            "isin": "GBE102AC0B6E",
            "sedol": "BE102AC0",
            "currencyCode": "AED"
        }
    ];

    beforeEach(module('tillerWebApp'));

    beforeEach(inject(function ($injector) {
        chartSecurityPerformanceService = $injector.get('chart.securityPerformanceService');
    }));

    it('should have a setValues method', function() {
        expect(angular.isFunction(chartSecurityPerformanceService.setValues)).toBe(true);
    });

    it('getValues method should return an array with objects including a return value (number) and a date (object)', function() {

        var response = chartSecurityPerformanceService.getValues(securityData);
        expect(typeof response[0].date).toEqual('object');
        expect(typeof response[0].value).toEqual('number');

    });

});