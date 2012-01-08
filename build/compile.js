var async, compile_attachment, compile_attachments, compile_stylus, modules, path, spawn, stylus, utils;
async = require("async");
utils = require("kanso-utils/utils");
spawn = require("child_process").spawn;
path = require("path");
modules = require("kanso-utils/modules");
stylus = require('stylus');
module.exports = {
  run: function(root, path, settings, doc, callback) {
    var apply_compile_attachments, attach_paths;
    if (!settings["stylus"]) {
      return callback(null, doc);
    }
    if (!settings["stylus"]["compile"]) {
      return callback(null, doc);
    }
    attach_paths = settings["stylus"]["compile"] || [];
    if (!Array.isArray(attach_paths)) {
      attach_paths = [attach_paths];
    }
    apply_compile_attachments = async.apply(compile_attachments, doc, path, settings);
    return async.parallel([async.apply(async.forEach, attach_paths, apply_compile_attachments)], function(err) {
      return callback(err, doc);
    });
  }
};
compile_attachments = function(doc, path, settings, paths, callback) {
  var pattern;
  pattern = /.*\.styl$/i;
  return utils.find(utils.abspath(paths, path), pattern, function(err, data) {
    var apply_compile_attachment;
    if (err) {
      return callback(err);
    }
    apply_compile_attachment = async.apply(compile_attachment, doc, path, settings);
    return async.forEach(data, apply_compile_attachment, callback);
  });
};
compile_attachment = function(doc, path, settings, filename, callback) {
  var name;
  name = utils.relpath(filename, path).replace(/\.styl$/, ".css");
  return compile_stylus(path, filename, settings, function(err, js) {
    if (err) {
      return callback(err);
    }
    doc._attachments[name] = {
      content_type: "application/javascript",
      data: new Buffer(js).toString("base64")
    };
    return callback();
  });
};
compile_stylus = function(project_path, filename, settings, callback) {
  var content, result;
  console.log("Compiling " + utils.relpath(filename, project_path));
  content = fs.readFileSync(filename, 'utf8');
  result = '';
  stylus(content, {
    compress: settings["stylus"]["compress"]
  }).include(path.dirname(filename)).render(function(err, css) {
    if (err) {
      throw err;
    }
    return result = css;
  });
  return callback(null, result);
};