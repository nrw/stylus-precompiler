async = require("async")
utils = require("kanso-utils/utils")
spawn = require("child_process").spawn
path = require("path")
modules = require("kanso-utils/modules")
attachments = require("kanso-utils/attachments")
stylus = require('stylus')

module.exports =
  run: (root, path, settings, doc, callback) ->
    return callback(null, doc)  unless settings["stylus"]
    return callback(null, doc)  if not settings["stylus"]["compile"]
    
    attach_paths = settings["stylus"]["compile"] or []
    attach_paths = [ attach_paths ] unless Array.isArray(attach_paths)
    
    apply_compile_attachments = async.apply(compile_attachments, doc, path, settings)

    async.parallel [
      async.apply(async.forEach, attach_paths, apply_compile_attachments)
    ], (err) -> callback err, doc

compile_attachments = (doc, path, settings, paths, callback) ->
  pattern = /.*\.styl$/i
  utils.find utils.abspath(paths, path), pattern, (err, data) ->
    return callback(err)  if err
    apply_compile_attachment = async.apply(compile_attachment, doc, path, settings)
    async.forEach data, apply_compile_attachment, callback

compile_attachment = (doc, path, settings, filename, callback) ->
  name = utils.relpath(filename, path).replace(/\.styl$/, ".css")
  compile_stylus path, filename, settings, (err, css) ->
    return callback(err)  if err
    attachments.add(doc, name, name, new Buffer(css).toString("base64"))
    callback()

compile_stylus = (project_path, filename, settings, callback) ->
  console.log "Compiling " + utils.relpath(filename, project_path)
  content = fs.readFileSync filename, 'utf8'
  result = ''
  stylus(content, compress: settings["stylus"]["compress"])
    .include(path.dirname(filename))
    .render((err, css) -> 
      throw err if err
      result = css
    )
  callback null, result
