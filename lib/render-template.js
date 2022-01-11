const swig = require('@risd/swig')
swig.setDefaults({ cache: false })

module.exports = templateRender

function templateRender (str, options, callback){
  swig.renderFile(str, options, callback)
}
