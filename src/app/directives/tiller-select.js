angular.module('ui.tiller-inputs')
    .directive('tillerSelect', ['$rootScope', '$timeout', function ($rootScope, $timeout) {

        //Close all on click anywhere
        $(document).click(function () {
            $('.tiller-drop-down').hide();
        });

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'components/tiller-select.html',
            scope: {
                id: "@",
                placeholder: "@",
                onOptionSelected: "=?",
                width: "@?",
                options: "=",
                selectedItem: "=?"
            },
            link: function ($scope, $element) {

                //clean up root
                $element.removeAttr('id')
                    .removeAttr('placeholder')
                    .removeAttr('options')
                    .removeAttr('width')
                    .removeAttr('selected-item')
                    .removeAttr('on-option-selected');

                var optionsBound = false;
                var select = $element.find('input');
                var listContainer = $element.find('.list-container');
                var list = $element.find('ul');
                var dropDown = $element.find('.tiller-drop-down');

                //width management
                var width = "100%";
                var userWidthSet = false;
                if ($scope.width !== "" && $scope.width != null) {
                    width = $scope.width + "px";
                    userWidthSet = true;
                }

                var listWidth = userWidthSet ? ($scope.width - 53) + "px" : (dropDown.parent().width()) - 53 + "px";
            
                $element.css("width", width);
                select.css("width", width);
                list.css("width", listWidth);
               
               // listContainer.css("width", "20px");
                dropDown.css("width", (dropDown.parent().width()) - 28 + "px");
                listContainer.scrollbar();

                //start with drop down hidden
                //but need to pre build it to prevent sluggish rendering of list
                dropDown.css("opacity", "0");
                $timeout(function () {
                    dropDown.css("opacity", "1");
                    dropDown.hide();
                }, 500);

                $element.click(function (e) {
                    //close others
                    $('.tiller-drop-down').hide();
                    dropDown.css("z-index", "1000");
                    dropDown.show();
                    e.stopPropagation();
                });

                $scope.bindOptions = function () {
                    var items = $element.find('li');

                    //Allows for late binding but we can still only bind once
                    if (items.length > 0 && optionsBound === false) {
                        items.click(function (e) {
                            $scope.selectedItem = $(this).data('item');
                            $scope.onOptionSelected($scope.selectedItem);
                            $scope.$apply();
                            e.preventDefault();
                            dropDown.hide();
                            dropDown.css("z-index", "0");
                            return false;
                        });
                        optionsBound = true;
                    }
                };

                //Attempt binding if we've got list items...
                $timeout(function () {
                    $scope.bindOptions();
                }, 0);
                //...or bind whenever list items are added
                $scope.$watch('options', function () {
                    $scope.bindOptions();
                });

                //set default selected item
                $.each($scope.options, function (ind, val) {
                    if (val.selected && val.selected === true) {
                        $scope.selectedItem = val;
                    }
                });

                //No default selected specified - then select the first
                if ($scope.selectedItem == null && ($scope.placeholder == null || $scope.placeholder === ""))
                    $scope.selectedItem = $scope.options[0];
            }
        };
    }]);

