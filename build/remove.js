module.exports = {
  after: "attachments",
  run: function(root, path, settings, doc, callback) {
    var k;
    if (settings["stylus"]["remove_from_attachments"]) {
      console.log("removing");
      for (k in doc._attachments || {}) {
        console.log("checking k: " + k);
        if (/\.styl$/.test(k)) {
          delete doc._attachments[k];
        }
      }
    }
    return callback(null, doc);
  }
};