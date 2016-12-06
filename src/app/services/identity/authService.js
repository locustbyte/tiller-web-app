'use strict';

//todo: using $localStorage is a mistake. Should be using $SessionStorage or its session riding attacks ahoy...

angular.module('tillerWebApp')
    .factory('authService', ['$http', '$q', '$localStorage', 'envService', '$rootScope', function ($http, $q, $localStorage, envService, $rootScope) {

        var serviceBase = envService.read('identityApiBaseUri');
        var clientId = envService.read('clientId')
        var authServiceFactory = {};

        var _authentication = {
            isAuth: false,
            userName: "",
            useRefreshTokens: false
        };

        var _externalAuthData = {
            provider: "",
            userName: "",
            externalAccessToken: ""
        };

        var _saveRegistration = function (registration) {

            _logOut();

            return $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
                return response;
            });

        };

        var _login = function (loginData) {

            var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password + "&client_id=" + clientId;

            var deferred = $q.defer();

            $http.post(serviceBase + '/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                if (loginData.useRefreshTokens) {
                    $localStorage.authorizationData = { token: response.access_token, userName: loginData.userName, refreshToken: response.refresh_token, useRefreshTokens: true };
                }
                else {
                    $localStorage.authorizationData = { token: response.access_token, userName: loginData.userName, refreshToken: "", useRefreshTokens: false };
                }
                _authentication.isAuth = true;
                _authentication.userName = loginData.userName;
                _authentication.useRefreshTokens = loginData.useRefreshTokens;

                deferred.resolve(response);

                // broadcast user
                $rootScope.$broadcast("userLogin", loginData.userName);

            }).error(function (err, status) {
                _logOut();
                deferred.reject(err);
            });

            return deferred.promise;

        };

        var _currentAccessToken = function () {
            var authData = $localStorage.authorizationData;
            return authData.token;
        };

        var _logOut = function () {

            $localStorage.$reset('authorizationData');

            _authentication.isAuth = false;
            _authentication.userName = "";
            _authentication.useRefreshTokens = false;

            // broadcast user
            $rootScope.$broadcast("userLogin", "");
        };

        var _fillAuthData = function () {

            var authData = $localStorage.authorizationData;
            if (authData) {
                _authentication.isAuth = true;
                _authentication.userName = authData.userName;
                _authentication.useRefreshTokens = authData.useRefreshTokens;
            }

        };

        var _refreshToken = function () {
            var deferred = $q.defer();

            var authData = $localStorage.authorizationData;

            if (authData) {

                if (authData.useRefreshTokens) {

                    var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + ngAppSettings.clientId;

                    $localStorage.$reset('authorizationData');

                    $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                        $localStorage.authorizationData = { token: response.access_token, userName: response.userName, refreshToken: response.refresh_token, useRefreshTokens: true };

                        deferred.resolve(response);

                    }).error(function (err, status) {
                        _logOut();
                        deferred.reject(err);
                    });
                }
            }

            return deferred.promise;
        };

        var _obtainAccessToken = function (externalData) {

            var deferred = $q.defer();

            $http.get(serviceBase + 'api/account/ObtainLocalAccessToken', { params: { provider: externalData.provider, externalAccessToken: externalData.externalAccessToken } }).success(function (response) {

                $localStorage.authorizationData = { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false };

                _authentication.isAuth = true;
                _authentication.userName = response.userName;
                _authentication.useRefreshTokens = false;

                deferred.resolve(response);

            }).error(function (err, status) {
                _logOut();
                deferred.reject(err);
            });

            return deferred.promise;

        };

        var _registerExternal = function (registerExternalData) {

            var deferred = $q.defer();

            $http.post(serviceBase + 'api/account/registerexternal', registerExternalData).success(function (response) {

                $localStorage.authorizationData = { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false };

                _authentication.isAuth = true;
                _authentication.userName = response.userName;
                _authentication.useRefreshTokens = false;

                deferred.resolve(response);

            }).error(function (err, status) {
                _logOut();
                deferred.reject(err);
            });

            return deferred.promise;

        };

        authServiceFactory.saveRegistration = _saveRegistration;
        authServiceFactory.login = _login;
        authServiceFactory.logOut = _logOut;
        authServiceFactory.fillAuthData = _fillAuthData;
        authServiceFactory.authentication = _authentication;
        authServiceFactory.refreshToken = _refreshToken;
        authServiceFactory.currentAccessToken = _currentAccessToken;
        authServiceFactory.obtainAccessToken = _obtainAccessToken;
        authServiceFactory.externalAuthData = _externalAuthData;
        authServiceFactory.registerExternal = _registerExternal;

        _fillAuthData();

        return authServiceFactory;
    }]);