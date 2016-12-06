angular.module('ui.tiller-inputs')
    .directive('tillerRadioOption', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'components/tiller-radio-option.html',
            scope: {
                id: "@",
                label: "@",
                name: "@",
                onSelected: "&",
                onUnselected: "&",
                checked: "@",
                allowUncheck: "=?"
            },
            link: function ($scope, $element) {
                //clean up root
                $element.removeAttr('id')
                    .removeAttr('label')
                    .removeAttr('name')
                    .removeAttr('on-selected')
                    .removeAttr('checked');

                var radioGroup = function () {
                    return $("." + $scope.name);
                }

                var radio = $element.find('input');

                if ($scope.checked === "true")
                    radio.attr("checked", true);

                radio.click(function (e) {
                    var allRadios = radioGroup();

                    if ($(this).is(':checked')) {
                        $.each(allRadios, function (ind, val) {
                            if (val.id != radio[0].id)
                                $(val).prop("checked", false);
                        });
                        if ($scope.onSelected)
                            $scope.onSelected();

                        $scope.$apply();
                    }
                    else if ($scope.allowUncheck === true) {
                        //do nothing i.e. allow event to propogate and radio to uncheck
                        if ($scope.onUnselected)
                            $scope.onUnselected();

                        $scope.$apply();
                    }
                    else {
                        e.preventDefault();
                        return false;
                    }
                });
            }
        };
    }]);

