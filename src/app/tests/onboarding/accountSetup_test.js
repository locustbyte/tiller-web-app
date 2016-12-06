
'use strict';

describe('Onboarding account set up', function () {

    var scope,
        localStorage,
        httpBackend,
        state,
        authRequestHandler,
        onboardingUserService,
        envService,
        unknownUser = readJSON("src/app/stubs/user/get_user_response_unknown.json"),
        controller,
        q,
        deferred,
        identityApiAdapter,
        sessionStorage;

    beforeEach(function () {

        module('tillerWebApp');
        module('stateMock');

        inject(function ($rootScope, $localStorage, $sessionStorage, $httpBackend, $state, $controller, $q, _onboardingUserService_, _envService_, _identityApiAdapter_) {
            localStorage = $localStorage;
            scope = $rootScope.$new();
            httpBackend = $httpBackend;
            state = $state;
            onboardingUserService = _onboardingUserService_;
            envService = _envService_;
            controller = $controller;
            q = $q;
            identityApiAdapter = _identityApiAdapter_;
            sessionStorage = $sessionStorage;

            //deferred = q.defer();

            //spyOn(identityApiAdapter, 'getUserByEmail').and.returnValue(deferred.promise);

            $controller('onboardingCtrl', {
                $scope: scope,
                onboardingUserService: onboardingUserService
            });

            httpBackend.when('GET', envService.read("identityApiBaseUri") + '/api/account/getuser?id=someUnkown@user.com').respond(unknownUser);

        });
    });

    it('should prompt for password for recognised email address', function () {

        //we cant do this here with the current state mock. Plan is to build a seperate group of tests to check state transitions
       // state.expectTransitionTo('onboarding.your-account-hello-again'); 

        scope.user.email = "someUnkown@user.com";

        scope.submitEmail();

        httpBackend.flush();

        expect(sessionStorage.user).not.toEqual(null);
        expect(sessionStorage.user.email).toEqual("someUnkown@user.com");

    });

    //it('should start account set up for unrecognised email address', function () {
    //    expect(true).toBe(false);//todo: write test!
    //});

});