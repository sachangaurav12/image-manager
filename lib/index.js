// @flow

import express from 'express';
import axios from 'axios';
import sharp from 'sharp';
import Debug from 'debug';

const debug = Debug('app');

const app = express();

app.get('/', async (req, res) => {
  res.send('App is running');
});

app.get('/manager', async (req, res) => {
  try {
    const { imageUrl, quality = 80, width = 414 } = req.query;

    debug('fetching image from source');

    const { data: imageData } = await axios({
      method: 'get',
      url: imageUrl,
      responseType: 'stream',
    }).catch(() => res.status(404).send('not found'));

    debug('image fetched from source');

    return imageData
      .pipe(
        sharp()
          .webp({ quality: Number(quality) })
          .resize(Number(width)),
      )
      .pipe(res);
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on ${PORT}`);
});
