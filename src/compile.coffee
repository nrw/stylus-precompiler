module.exports =
  before: "modules"
  run: (root, path, settings, doc, callback) ->
    attachmentsPaths = settings["stylus"]?["compile"]

    # Check that the settings are valid
    unless attachmentsPaths?
      console.log "Stylus precompiler requires a 'compile' setting"
      return callback(null, doc)

    attachmentsPaths ?= []

    # Grab required libraries
    async = require("async")
    dirname = require("path").dirname
    utils = require("kanso-utils/utils")
    precompiler = require("kanso-precompiler-base")
    stylus = require('stylus')

    # Specify the regular expression patterns that identify Stylus files 
    file_pattern = /.*\.styl(us)?$/
    extension_pattern = /\.styl(us)?$/

    # Compile a Stylus file and attach it to the design document
    compileAttachment = (filename, callback) ->
      rel = utils.relpath(filename, path)
      console.log("Compiling attachment #{rel}")

      dir = dirname(filename)
      file = fs.readFileSync(filename, 'utf8')
      compile_settings = compress: settings["stylus"]["compress"]
      
      stylus(file, compile_settings).include(dir).render (err, css) ->
        throw err if err

        name = rel.replace(extension_pattern, ".css")
        precompiler.addAttachment(doc, name, name, css)
        callback(null, doc)

    # Extract the attachment paths from the settings
    attachments = precompiler.normalizePaths(attachmentsPaths, path)

    # Create continuations for the functions that process whole folders of attachments
    processAttachments = async.apply(precompiler.processPaths, attachments, file_pattern, compileAttachment)

    # Run the attachments in parallel then callback to Kanso to tell it we are done, passing the design document
    async.parallel [processAttachments], (err, results)->
      callback(err, doc)
