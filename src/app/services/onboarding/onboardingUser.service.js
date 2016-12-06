'use strict';

angular.module('onboardingUserService', [])
    .service('onboardingUserService', ['$rootScope', 'identityApiAdapter', function ($rootScope, identityApiAdapter) {

    	this.getUserByEmail = identityApiAdapter.getUserByEmail;
    	this.createUser = identityApiAdapter.createUser;

    }]);