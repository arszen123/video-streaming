'use strict';
const app = require('./app');
const config = require('./config');

app.listen(config.get('APP_PORT'), function () {
    const port = this.address().port;
    console.log(`🚀 Application listening on http://localhost:${port}`)
})