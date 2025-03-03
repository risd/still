const _ = require('lodash')
const express = require('express')
const fs = require('fs')
const utils = require('./utils')
const data = require('./data')

const render = require('./render-template.js')
require('@risd/swig').setDefaults({ cache: false })

var app = express();

data.useCache(false);

function findHTML(file, path, cb) {
  file = file || 'index';
  fs.exists(path + file + '.html', function (exists) {
    if (!exists && (/index$/).test(file)) {
      cb('File not found: ' + path + file);
      return;
    }

    if (!exists) {
      findHTML(file + '/index', path, cb);
      return;
    }

    cb(null, file + '.html');
  });
}

function _render(res, path, tpl, encoding, status) {
  data.getData(path + tpl, encoding, function (err, data) {
    res.status(status).render(tpl, _.extend({ DEV: true }, data));
  });
}

exports.run = function (argv) {
  const path = argv._[0]
  const encoding = argv.encoding
  const port = argv.p

  app.use(express.logger('dev'));

  app.engine('.html', render);
  app.set('view engine', 'html');
  app.set('views', path);
  app.set('view cache', false);

  app.get('/*', function (req, res) {
    var view = _.first(req.params).replace(/\/$/, '');

    findHTML(view, path, function (err, tpl) {
      if (err) {
        fs.exists(path + view, function (exists) {
          if (!exists) {
            _render(res, path, argv.err, encoding, 404);
            return;
          }
          res.set({
            'Cache-Control': 'no-cache, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': new Date(0)
          }).sendfile(path + view);
        });
        return;
      }

      _render(res, path, tpl, encoding, 200);
    });
  });

  app.listen(port);
  utils.log('Server listening on port', port);
};
