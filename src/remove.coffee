module.exports =
  after: "attachments"
  run: (root, path, settings, doc, callback) ->
    if settings["stylus"]["remove_from_attachments"]
      for k of (doc._attachments or {})
        delete doc._attachments[k]  if /\.styl$/.test(k)
    callback null, doc