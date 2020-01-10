const express=require('express');
const app=express();

app.get('/', (req,res) => {
	res.send('Hello espress!');
});

app.listen(3000, () => {
	console.log('Express web app on localhost:3000');
});

//npm start
