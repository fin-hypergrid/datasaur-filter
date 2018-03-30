/* eslint-env commonjs */

'use strict';

var DatasaurIndexed = require('datasaur-indexed');
var compile = require('predicated').compile;

/**
 * @interface filterInterface
 */

/**
 * @name filterInterface#test
 * @method
 * @param {object} dataRow - Object representing a row in the grid containing all the column names included in {@link Datasaur#getSchema|getSchema()}.
 * @returns {boolean}
 * * `true` - include in grid (row passes through filter)
 * * `false` - exclude from grid (row is blocked by filter)
 */

/**
 * @constructor
 * @extends DatasaurIndexed
 */
var DatasaurFilter = DatasaurIndexed.extend('DatasaurFilter', {

    /**
     * @param {object|function|string} [filter] - Falsy means remove filter.
     * @param {object} [options]
     * @param {string} [options.syntax='javascript'] - Also accepts 'traditional' (VB/SQL-like)
     * @param {string[]} [vars] - Check expression and throw error if it has variables not in schema or `vars`. If omitted or falsy, no checking is performed.
     * @memberOf DatasaurFilter#
     */
    setFilter: function(filter, options) {
        if (!filter) {
            filter = undefined;
        }

        switch (typeof filter) {
            case 'object':
                this._filter = filter;
                break;

            case 'function':
                this._filter = { test: filter };
                break;

            case 'string':
                options = options && {
                    syntax: options.syntax,
                    keys: options.vars && this.getSchema().map(name).concat(options.vars)
                };
                this._filter = { test: compile(filter, options) };
                break;

            default:
                this._filter = undefined;
        }

        this.apply();
    },

    /**
     * @memberOf DatasaurFilter#
     */
    apply: function() {
        var predicate,
            filter = this._filter;

        if (filter) {
            predicate = function(y) {
                return filter.test(this.getRow(y));
            }
        }

        this.buildIndex(predicate);
    }

});

function name(fld) {
    return fld.name;
}

module.exports = DatasaurFilter;
