# stylus-precompiler

The stylus-precompiler allows you to author your stylesheets with the CSS superset of
[Stylus](http://learnboost.github.com/stylus/). It supports variables, mixins, and lots of other really useful stuff. The `.styl` and `.stylus` files will get compiled and \_attached to your 
couchapp on every build and can even be compressed.


### Install

Add `stylus-precompiler` to your dependencies section in `kanso.json`.

```javascript
  ...
  "dependencies": {
    "stylus-precompiler": null,
    ...
  }
```

> run `kanso install` to fetch the package


### Configure

To tell the precompiler which files to transform, add the section `stylus`,
and in a key called `compile`, list the files you want to process.

```javascript
  ...
  "stylus": {
    "compile": [ "css/style.styl", ... ]
  }
  ...
  "dependencies": {
    "stylus-precompiler": null,
    ...
  }

```

> Running `kanso push` will compile the file `css/style.styl` to 
`css/style.css` and upload it to `_attachments/css/style.css`.


### Compression

To enable compression of the output, add the `compress` flag and set it to `true`.

```javascript
  ...
  "stylus": {
    "compile": [ ... ],
    "compress": true
  }
```


### Removing original .styl and .stylus files

You can also remove any .styl files from attachments (if you placed them inside a
directory also added as static files), by adding the `remove_from_attachments`
property. This will remove all attachment with `.styl` and `.stylus` extensions!

```javascript
  ...
  "stylus": {
    "compile": [ ... ],
    "remove_from_attachments": true
  }
```