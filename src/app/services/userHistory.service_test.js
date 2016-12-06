'use strict';

describe('userHistoryService', function() {

    var userHistoryService;

    beforeEach(module('tillerWebApp'));

    beforeEach(inject(function ($injector) {
        userHistoryService = $injector.get('userHistoryService');
    }));

    it('should have a getDefaults method', function() {
        expect(angular.isFunction(userHistoryService.getDefaults)).toBe(true);
    });

    it('getDefaults method should return an object', function() {

        expect(typeof userHistoryService.getDefaults()).toEqual('object');
    });

    it('getDefaults investorLevel of tracker should be falsey', function() {

        expect(userHistoryService.getDefaults().investorLevels.tracker).toBeFalsy();
    });

});