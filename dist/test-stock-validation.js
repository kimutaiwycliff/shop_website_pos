"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var stockValidation_1 = require("./stockValidation");
// Mock the POS item structure
var mockProduct = {
    id: '1',
    title: 'Test Product',
    price: 1000,
    sku: 'TEST-001',
    inStock: 5
};
var mockPOSItem = {
    id: 'item-1',
    product: mockProduct,
    quantity: 2,
    unitPrice: 1000,
    discount: 0,
    lineTotal: 2000
};
// Test cases
console.log('=== Stock Validation Tests ===');
// Test 1: Allow adding product when stock is available
console.log('\nTest 1: Allow adding product when stock is available');
var cart1 = [mockPOSItem];
var product1 = __assign(__assign({}, mockProduct), { inStock: 5 });
var result1 = (0, stockValidation_1.validateStockAvailability)(cart1, product1, 1);
console.log('Result:', result1);
console.log('Expected: isValid=true, message=null');
// Test 2: Prevent adding product when stock is exceeded
console.log('\nTest 2: Prevent adding product when stock is exceeded');
var cart2 = [__assign(__assign({}, mockPOSItem), { quantity: 5 })];
var product2 = __assign(__assign({}, mockProduct), { inStock: 5 });
var result2 = (0, stockValidation_1.validateStockAvailability)(cart2, product2, 1);
console.log('Result:', result2);
console.log('Expected: isValid=false, message about stock limit');
// Test 3: Prevent adding product when it is out of stock
console.log('\nTest 3: Prevent adding product when it is out of stock');
var cart3 = [];
var product3 = __assign(__assign({}, mockProduct), { inStock: 0 });
var result3 = (0, stockValidation_1.validateStockAvailability)(cart3, product3, 1);
console.log('Result:', result3);
console.log('Expected: isValid=false, out of stock message');
// Test 4: Validate quantity updates correctly
console.log('\nTest 4: Validate quantity updates correctly');
var cart4 = [__assign({}, mockPOSItem)];
var result4 = (0, stockValidation_1.validateQuantityUpdate)(cart4, 'item-1', 3);
console.log('Result:', result4);
console.log('Expected: isValid=true, message=null');
// Test 5: Prevent quantity updates that exceed stock
console.log('\nTest 5: Prevent quantity updates that exceed stock');
var cart5 = [__assign({}, mockPOSItem)];
var result5 = (0, stockValidation_1.validateQuantityUpdate)(cart5, 'item-1', 10);
console.log('Result:', result5);
console.log('Expected: isValid=false, stock limit message');
console.log('\n=== Tests Complete ===');
