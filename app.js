var http=require('http');
var fs=require('fs');
var processid=process.pid;
var server=http.createServer(function(req,res){
	fs.readFile('./index.html',function(err,data){
		res.writeHead(200,{
			"Content-type":'text/html'
		});
		res.end(data,'utf-8');
	});
}).listen(9095,'192.168.1.17');
console.log('server is running'+processid);
var counter=0;
var io=require('socket.io').listen(server);
io.sockets.on('connection',function(socket){
	counter++;
	socket.emit('counter',{number:counter});
	socket.broadcast.emit('counter',{number:counter});
	socket.on('message',function(data){
		socket.broadcast.emit('push message',data);
	});
	socket.on('disconnect',function(){
		counter--;
		socket.emit('counter',{number:counter});
		socket.broadcast.emit('counter',{number:counter});
	});
});
