'use strict';

describe('userService', function () {

    var userService,
        scope,
        localStorage,
        httpBackend,
        state;

    beforeEach(function () {

        module('tillerWebApp');
        module('stateMock');

        inject(
            function ($rootScope, $localStorage, _userService_, $httpBackend, $state) {
                localStorage = $localStorage;
                scope = $rootScope.$new();
                userService = _userService_;
                httpBackend = $httpBackend;
                state = $state;
            });
    });

    it('should have a getUserDataAsync method', function () {
        expect(angular.isFunction(userService.getUserDataAsync)).toBe(true);
    });

});