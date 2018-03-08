This sample _Datasaur_ module extends [`datasaur-indexed`](https://github.com/fin-hypergrid/datasaur-indexed). You don't need this module to perform filtering.

You do not need this module to do effective filtering; `datasaur-indexed` is sufficient. For an example, see [`fin-hypergrid-filter-demo`](https://github.com/fin-hypergrid/fin-hypergrid-filtering-demo).

This module adds two methods:

#### `setFilter` method

This module adds the convenience method [`setFilter(filter: string|object|function, options: object)`](https://github.com/fin-hypergrid/datasaur-filter/blob/master/index.js#L27-L62) method, which preps a predicate function and passes it to `datasaur-indexed`'s [`buildIndex`](https://github.com/fin-hypergrid/datasaur-indexed/blob/master/index.js#L79-L107) method.

`setFilter` has three overloads discerned by the type of its first parameter:

* `string` — A filter expression. The predicate function is created for you.
* `function` — A predicate function.
* `object` — A filtering API, with a predicate function in its `test` method.

This predicate function takes a data row object as its only parameter. This differs from `buildIndex`'s predicate, which takes a data row index, not an object. (See the [`apply`](#apply-method) method below.)

Additionally, `setFilter` accepts two options in its second parameter.

> **Note:** Both options utilize [`literalz`](https://npmjs.org/package/literalz) to temporarily hide the expression's string literals, the contents of which we specifically want to exclude from these operations.

##### `options.vars` : string[]
 A value of `[]` passes a data row object to [`predicated`](https://github.com/joneit/predicated) in its [`keys`](https://github.com/joneit/predicated#keys) option, which checks the expression for syntax and reference errors at setup time, rather than just letting the filter fail at `apply` time (see below).
 
 If your filter expression intentionally references external variables, list their names in the array.
 
 Omit to skip the check altogether.

##### `options.syntax` : string
The value is passed verbatim to `predicated`, which applies the named filter converter to the expression to convert the expression to JavaScript syntax.

There are two built-in converters:
   * `'javascript'` — No-op; just a pass-through function.
   * `'traditional'` — VB or SQL style syntax. See [src/SQL-to-JS.js](https://github.com/joneit/predicated/blob/master/converters/SQL-to-JS.js) for details.
   
#### `apply` method

The [`apply()`](https://github.com/fin-hypergrid/datasaur-filter/blob/master/index.js#L27-L62) method:
1. Creates a `buildIndex`-style predicate from the predicate given (or derived by) `setFilter`
2. Calls `buildIndex` with the new predicate.
