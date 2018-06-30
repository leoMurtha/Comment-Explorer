if(process.env.NODE_ENV === 'production'){
    module.exports = 'mongodb://admin:041097ll@ds125021.mlab.com:25021/comex';
}else{
	module.exports = 'mongodb://admin:041097ll@ds125021.mlab.com:25021/comex';
}

/* DOCKER URI mongodb://mongo:27017/smartteach-dev 
   LOCALHOST URI mongodb://127.0.0.1:27017/smartteach-dev
*/