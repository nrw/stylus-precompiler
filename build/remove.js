module.exports = {
  after: "attachments",
  run: function(root, path, settings, doc, callback) {
    var k;
    if (settings["stylus"]["remove_from_attachments"]) {
      for (k in doc._attachments || {}) {
        if (/\.styl$/.test(k)) {
          delete doc._attachments[k];
        }
      }
    }
    return callback(null, doc);
  }
};