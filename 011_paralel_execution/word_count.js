const fs = require('fs');
const tasks = [];
const wordCounts = {};
const filesDir = './text'
let comletedTasks = 0;

//conclution of result
function checkIfComplete(){
  comletedTasks++;
  if(comletedTasks === tasks.length){
    for(let index in wordCounts){
      console.log(`${index}: ${wordCounts[index]}`);
    }
  }
}

function addWordCount(word){
  wordCounts[word] = (wordCounts[word]) ? wordCounts[word] +1 : 1;
}

//count words
function countWordsInText(text){
  const words = text
    .toString()
    .toLowerCase()
    .split(/\W+/)
    .sort();
  words
    .filter(word => word)
    .forEach(word => addWordCount(word));
}

// async invokes
fs.readdir(filesDir, (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    const task = (file => {
      return() => {
        fs.readFile(file, (err, text) => {
          if (err) throw err;
          countWordsInText(text);
          checkIfComplete();
        });
      };
    })(`${filesDir}/${file}`);
    tasks.push(task);
  });
  tasks.forEach(task => task());
});