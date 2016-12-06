'use strict';

angular.module('tillerWebApp')
    .factory('authInterceptorService', ['$q', '$injector', '$location', '$localStorage', 'envService', '$base64', function ($q, $injector, $location, $localStorage, envService, $base64) {

        var authInterceptorServiceFactory = {};

        var _request = function (config) {

            config.headers = config.headers || {};

            var api_1 = envService.read('identityApiBaseUri');
            var api_2 = envService.read('apiUrl');

            var isApiCall = false;

            if (config.url.indexOf(api_1) != -1 || config.url.indexOf(api_2) != -1)
                isApiCall = true;

            var authData = $localStorage.authorizationData;
            if (authData) {

                /**
                 * If the environment uses basic auth then inject this into the Authorization header
                 */
                if(envService.read('basicAuth') && isApiCall === false)
                {
                    config.headers.Authorization = 'Basic ' + $base64.encode('guestuser:s3a5e01') + ';Bearer ' + authData.token;
                }
                else
                {
                    config.headers.Authorization = 'Bearer ' + authData.token;
                }
                //config.headers["Subscriber"] = "this is a test";
            }

            return config;
        }

        var _responseError = function (rejection) {
            if (rejection.status === 401) {
                var authService = $injector.get('authService');
                var authData = $localStorage.authorizationData;

                if (authData) {
                    if (authData.useRefreshTokens) {
                        $location.path('/refresh');
                        return $q.reject(rejection);
                    }
                }
                authService.logOut();
                var stateService = $injector.get('$state');
                stateService.go('login');
            }
            return $q.reject(rejection);
        }

        authInterceptorServiceFactory.request = _request;
        authInterceptorServiceFactory.responseError = _responseError;

        return authInterceptorServiceFactory;
    }]);