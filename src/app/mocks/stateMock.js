angular.module('stateMock', ['ui.router'])
    .config (function ($provide) {
    $provide.decorator ('$templateFactory', function ($delegate, $q) {
        $delegate.fromUrl = function (url, params) {
            if (angular.isFunction(url)) {
                url = url(params);
            }
            if (url === null) {
                return null;
            }

            var deferred = $q.defer();
            deferred.resolve (' ');
            return deferred.promise;
        };

        return $delegate;
    });
});