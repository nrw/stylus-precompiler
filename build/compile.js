(function() {
  module.exports = {
    before: "modules",
    run: function(root, path, settings, doc, callback) {
      var async, attachments, attachmentsPaths, compileAttachment, extension_pattern, file_pattern, precompiler, processAttachments, stylus, utils, _ref;
      attachmentsPaths = (_ref = settings["stylus"]) != null ? _ref["compile"] : void 0;
      if (attachmentsPaths == null) {
        console.log("Stylus precompiler requires a 'compile' setting");
        return callback(null, doc);
      }
      if (attachmentsPaths == null) {
        attachmentsPaths = [];
      }
      async = require("async");
      path = require("path");
      utils = require("kanso-utils/utils");
      precompiler = require("kanso-precompiler-base");
      stylus = require('stylus');
      file_pattern = /.*\.styl(us)?$/;
      extension_pattern = /\.styl(us)?$/;
      compileAttachment = function(filename, callback) {
        var compile_settings, dir, file, rel;
        rel = utils.relpath(filename, path);
        console.log("Compiling attachment " + rel);
        dir = path.dirname(filename);
        file = fs.readFileSync(filename, 'utf8');
        compile_settings = {
          compress: settings["stylus"]["compress"]
        };
        return stylus(file, compile_settings).include(dir).render(function(err, css) {
          var name;
          if (err) {
            throw err;
          }
          name = rel.replace(extension_pattern, ".css");
          precompiler.addAttachment(doc, name, filename, css);
          return callback(null, doc);
        });
      };
      attachments = precompiler.normalizePaths(attachmentsPaths, path);
      processAttachments = async.apply(precompiler.processPaths, attachments, file_pattern, compileAttachment);
      return async.parallel([processAttachments], function(err, results) {
        return callback(err, doc);
      });
    }
  };
}).call(this);
