'use strict';

require('@google-cloud/debug-agent').start({
    allowExpressions: true,
    serviceContext: {enableCanary: true}
});

const app = require('./app');
const config = require('./config');

app.listen(config.get('PORT'), function () {
    const port = this.address().port;
    console.log(`🚀 Application listening on http://localhost:${port}`)
})