'use strict';

describe('allocationsService', function() {

    var allocationsService, assetClass, allocationsData;

    assetClass = 'Eq';

    allocationsData = {
        "data": {
            "allocationsId": "f74bb511ffd24da9a59492c7fc744841",
            "sessionId": "63e34fe1-9452-4d29-80f4-c62d50b09450",
            "allocationsModels": [
                {
                    "securityId": 3,
                    "name": "test",
                    "isin": "GBE102AC0B6E",
                    "sedol": "BE102AC0",
                    "assetClass": "Eq",
                    "region": "Dev",
                    "sector": "Mix",
                    "weight": 0.19
                },
                {
                    "securityId": 4,
                    "name": "Test MB DATA - Updated",
                    "isin": "GB0298665B00",
                    "sedol": "B0298665",
                    "assetClass": "Eq",
                    "region": "EM",
                    "sector": "Mix",
                    "weight": 0.15
                },
                {
                    "securityId": 5,
                    "name": "MR No name",
                    "isin": "GBBACA555CFA",
                    "sedol": "BBACA555",
                    "assetClass": "Eq",
                    "region": "Dev",
                    "sector": "Mix",
                    "weight": 0.23
                },
                {
                    "securityId": 6,
                    "name": "take 3",
                    "isin": "GBF485562094",
                    "sedol": "BF485562",
                    "assetClass": "Eq",
                    "region": "Dev",
                    "sector": "Mix",
                    "weight": 0.22
                },
                {
                    "securityId": 7,
                    "name": "Martins Magic Beans",
                    "isin": "GB87E0C8A495",
                    "sedol": "B87E0C8A",
                    "assetClass": "Mix",
                    "region": "Dev",
                    "sector": "P&I",
                    "weight": 0.2
                }
            ]
        }
    };

    beforeEach(module('tillerWebApp'));

    beforeEach(inject(function (_allocationsService_) {
        allocationsService = _allocationsService_;
    }));

    it('should have a getAssetClassColour method', function() {
        expect(angular.isFunction(allocationsService.getAssetClassColour)).toBe(true);
    });

    it('getAssetClassColour method should return a value of #40DA9D with an assetclass of Eq', function() {
        var colour = allocationsService.getAssetClassColour('Eq');
        expect(colour).toEqual('#40DA9D');
    });

    it('should have a buildAllocationsData method', function() {
        expect(angular.isFunction(allocationsService.buildAllocationsData)).toBe(true);
    });

    it('buildAllocationsData method should return an array of objects each with a label (string) and it has children', function() {
        var data = allocationsService.buildAllocationsData(allocationsData);
        expect(typeof data[0].label).toEqual('string');
        expect(typeof data[0].children).toEqual('object');
    });

    it('buildAllocationsData method should return an array of objects each with children with a colour', function() {
        var data = allocationsService.buildAllocationsData(allocationsData);
        expect(typeof data[0].children[0].colour).toEqual('string');
    });

});