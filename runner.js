const http = require('http');
const zlib = require('zlib');

const path = require('path');
const exec = require('child_process').exec;
const port = 8080;

__dirname.split("/").pop();

// change "command.sh" to your own shell or command.
const script = 'COMPOSE_INTERACTIVE_NO_CLI=1 ' + path.join(process.cwd(), 'command.sh');

const requestHandler = (request, response) => {
    response.writeHead(200, {"Content-Type": "application/json"});
    response.writeHead(200, {"content-encoding": "gzip"});

    // exec(script, function callback(error, stdout, stderr) {
    exec(script, (error, stdout, stderr) => {
        const raw = JSON.stringify({error, stdout, stderr});
        const buff = Buffer.alloc(Buffer.byteLength(raw), raw, 'utf-8');
        zlib.gzip(buff, (_, result) => {
            response.end(result);
        });
    });
}

const server = http.createServer(requestHandler);
server.setTimeout(60 * 60 * 1000);  // an hour
server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happend ', err);
    }
    console.log('server is listening on ' + port);
})

