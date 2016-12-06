
'use strict';

describe('Authentication API interaction', function () {

    var scope,
        localStorage,
        httpBackend,
        state,
        authRequestHandler,
        identityApiAdapter,
        envService,
        knownUser = readJSON("src/app/stubs/user/get_user_response_known.json"),
        loginResponseOK = readJSON("src/app/stubs/user/login_response_ok.json"),
        kownUserLoginData = {
            userName: "stubUser@authStub.com",
            password: "SomePassword01#"
        };

    beforeEach(function () {

        module('tillerWebApp');
        module('stateMock');

        inject(function ($rootScope, $localStorage, $httpBackend, $state, _identityApiAdapter_, _envService_) {
                localStorage = $localStorage;
                scope = $rootScope.$new();
                httpBackend = $httpBackend;
                state = $state;
                identityApiAdapter = _identityApiAdapter_;
                envService = _envService_;
        });

        var data = "grant_type=password&username=" + kownUserLoginData.userName + "&password=" + kownUserLoginData.password + "&client_id=" + envService.read("clientId");

        authRequestHandler = httpBackend.when('POST', envService.read("identityApiBaseUri") + '/token', data).respond(loginResponseOK);
    });

    it('should set authorizationData in local storage on login success', function () {
        var testAuthorizationData = function (u) {
            expect(localStorage.authorizationData).not.toEqual(null);
        };

        identityApiAdapter.login(kownUserLoginData).then(testAuthorizationData);
        httpBackend.flush();
    });

    it('should set a bearer token in authorizationData on login success', function () {
        var testAuthorizationData = function (u) {
            expect(localStorage.authorizationData.token).toBe(loginResponseOK.access_token);
        };

        identityApiAdapter.login(kownUserLoginData).then(testAuthorizationData);
        httpBackend.flush();
    });

    it('should set the username in authorizationData on login success', function () {
        var testAuthorizationData = function (u) {
            expect(localStorage.authorizationData.userName).toBe(kownUserLoginData.userName);
        };

        identityApiAdapter.login(kownUserLoginData).then(testAuthorizationData);
        httpBackend.flush();
    });

});