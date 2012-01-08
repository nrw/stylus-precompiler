module.exports =
  after: "attachments"
  run: (root, path, settings, doc, callback) ->
    if settings["stylus"]["remove_from_attachments"]
      console.log "removing"
      for k of (doc._attachments or {})
        console.log "checking k: " + k
        delete doc._attachments[k]  if /\.styl$/.test(k)
    callback null, doc