'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _sharp = require('sharp');

var _sharp2 = _interopRequireDefault(_sharp);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const debug = (0, _debug2.default)('app');

const app = (0, _express2.default)();

app.get('/', (() => {
  var _ref = _asyncToGenerator(function* (req, res) {
    res.send('App is running');
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
})());

app.get('/manager', (() => {
  var _ref2 = _asyncToGenerator(function* (req, res) {
    try {
      const { imageUrl, quality = 80, width = 414 } = req.query;

      debug('fetching image from source');

      const { data: imageData } = yield (0, _axios2.default)({
        method: 'get',
        url: imageUrl,
        responseType: 'stream'
      }).catch(function () {
        return res.status(404).send('not found');
      });

      debug('image fetched from source');

      return imageData.pipe((0, _sharp2.default)().webp({ quality: Number(quality) }).resize(Number(width))).pipe(res);
    } catch (e) {
      return res.status(500).send(e.message);
    }
  });

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
})());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on ${PORT}`);
});