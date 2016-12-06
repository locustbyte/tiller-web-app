
'use strict';

describe('Onboarding portfolio set up', function () {

    var scope,
        localStorage,
        httpBackend,
        state,
        authRequestHandler,
        identityApiAdapter,
        envService,
        knownUser = readJSON("src/app/stubs/user/get_user_response_known.json"),
        controller;

    beforeEach(function () {

        module('tillerWebApp');
        module('stateTransitionMock');
        module({
            'identityApiAdapter': {
                isLoggedIn: true,
                getUserByEmail: function () { return knownUser }
            }
        });

        inject(function ($rootScope, $localStorage, $httpBackend, $state, $controller, _identityApiAdapter_, _envService_) {
            localStorage = $localStorage;
            scope = $rootScope.$new();
            httpBackend = $httpBackend;
            state = $state;
            identityApiAdapter = _identityApiAdapter_;
            envService = _envService_;
            controller = $controller;
        });

    });

    it('should not be allowed to start if the user is not logged in', function () {

        identityApiAdapter.isLoggedIn = function () { return false; };

        state.expectTransitionTo('onboarding.your-account'); //the login screen
      
        controller('portfolioCtrl', {$scope: scope, identityApiAdapter: identityApiAdapter });

    });

    it('should update the portfolio via the api on state transition', function () {
       // expect(true).toBe(false);//todo: write test!
    });


});