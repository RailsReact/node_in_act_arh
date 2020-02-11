const fs = require('fs');
const request = require('request');
const htmlparser = require('htmlparser');
const configFilename = './rss_feeds.txt';

// list exists
function checkForRSSFile(){
  fs.exists(configFilename, (exists) => {
    if(!exists)
      return next(new Error(`Missing RSS file: ${configFilename}`));
    next(null, configFilename);
  });
}
//read and parse the RSS list
function readRSSFile(configFilename){
  fs.readFile(configFilename, (err, feedList) => {
    if(err) return next(err);
    feedList = feedList
      .toString()
      .replace(/^\s+|\s+$/g, '')
      .split('\n');
    const random = Math.floor(Math.random()*feedList.length);
    next(null, feedList[random]);
  });
}
// request HTTP to receive data
function downloadRSSFeed(feedUrl){
  request({url: feedUrl}, (err, res, body) => {
    if(err) return next(err);
    if(res.statusCode !=200)
      return next(new Error('Abnormal response status code'));
    next(null, body);
  });
}
//parse RSS data to arrow
function parseRSSFeed(rss){
  const handler = new htmlparser.RssHandler();
  const parser = new htmlparser.Parser(handler);
  parser.parseComplete(rss);
  if(!handler.dom.items.length)
   return next(new Error('No RSS items found'));
  const item = handler.dom.items.shift();
  console.log(item.title);
  console.log(item.link);
}

// arrow the tasks
const tasks = [
  checkForRSSFile,
  readRSSFile,
  downloadRSSFeed,
  parseRSSFeed
]
//next behavor
function next(err, result){
  if(err) throw err;
  const currentTask = tasks.shift();
  if(currentTask){
    currentTask(result);
  }
}

//invokes 
next();
