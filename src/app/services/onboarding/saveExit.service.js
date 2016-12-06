'use strict';

angular.module('saveExitService', [])
    .service('saveExitService', ['$http', '$q', '$rootScope', '$state', '$sessionStorage', 'identityApiAdapter', 'envService', 'PubSub', 'errorService', function ($http, $q, $rootScope, $state, $sessionStorage, identityApiAdapter, envService, PubSub, errorService) {

        $rootScope.previousState = 'onboarding.your-account-hello-again';

        $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
            $rootScope.previousState = from.name;
        });

    }]);