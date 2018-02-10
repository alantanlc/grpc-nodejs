var PROTO_PATH = __dirname + '/helloworld.proto';

var grpc = require('grpc');
var http = require('http');
var util = require('util');
var formidable = require('formidable');
var fs = require('fs');
var hello_proto = grpc.load(PROTO_PATH).helloworld;

function main() {
	http.createServer(function(req, res) {
		if(req.url == '/sayHello') {
			// Get POST data
			var form = new formidable.IncomingForm();
			form.parse(req, function(err, fields) {
				// Invoke greeter_server sayHello
				var client = new hello_proto.Greeter('localhost:50051', grpc.credentials.createInsecure());
				client.sayHello({name: fields.name}, function(err, response) {
					res.write(response.message);
					res.end();
				});
			});
		} else {
			fs.readFile('index.html', function(err, data) {
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.write(data);
				res.end();
			})
		}
	}).listen(8080);
}

main();
