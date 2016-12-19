/* eslint-env commonjs */

'use strict';

var DataSourceIndexed = require('datasaur-indexed');

/**
 * @interface filterInterface
 */

/**
 * @name filterInterface#test
 * @method
 * @param {object} dataRow - Object representing a row in the grid containing all the fields listed in {@link DataSource#fields|fields}.
 * @returns {boolean}
 * * `true` - include in grid (row passes through filter)
 * * `false` - exclude from grid (row is blocked by filter)
 */

/**
 * @name controller
 * @implements filterInterface
 * @memberOf DataSourceGlobalFilter#
 */

/**
 * @constructor
 * @extends DataSourceIndexed
 */
var DataSourceGlobalFilter = DataSourceIndexed.extend('DataSourceGlobalFilter', {
    /**
     * @memberOf DataSourceGlobalFilter#
     */
    apply: function() {
        if (this.controller.test) {
            this.buildIndex(this.filterTest);
        } else {
            this.clearIndex();
        }
    },

    /**
     * @implements filterPredicate
     * @memberOf DataSourceGlobalFilter#
     */
    filterTest: function(r, rowObject) {
        return this.controller.test(rowObject);
    },

    /**
     *
     * @memberOf DataSourceGlobalFilter#
     * @returns {number}
     */
    getRowCount: function() {
        return this.controller.test ? this.index.length : this.dataSource.getRowCount();
    }
});

Object.defineProperty(DataSourceGlobalFilter.prototype, 'type', { value: 'filter' }); // read-only property

module.exports = DataSourceGlobalFilter;
