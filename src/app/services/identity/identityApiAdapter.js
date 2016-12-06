'use strict';

angular.module('tillerWebApp')
    .factory('identityApiAdapter', ['$http', '$q', '$localStorage', 'envService', '$rootScope', 'authService', function ($http, $q, $localStorage, envService, $rootScope, authService) {

        var serviceBase = envService.read("identityApiBaseUri");
        var identityApiAdapter = {};

        var _getUserByEmail = function (email) {
            //https://tilleridentityservice.azurewebsites.net/swagger/#!/Account/Account_GetUserByName
            return $http.get(serviceBase + '/api/account/getuser?id=' + email).then(function (response) {
                return response;
            });
        };
        var _createUser = function (userCreationModel) {
            return $http.post(serviceBase + '/api/account/createuser', userCreationModel).then(function (response) {
                return response;
            });
        };

        identityApiAdapter.getUserByEmail = _getUserByEmail;
        identityApiAdapter.createUser = _createUser;
        identityApiAdapter.login = authService.login;
        identityApiAdapter.isLoggedIn = function(){ 
            return authService.authentication.isAuth;
        }

        return identityApiAdapter;
    }]);