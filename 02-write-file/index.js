const fs = require('fs');
const path = require('path');
const readline = require('readline');
const process = require('process');

const textPath = path.join(__dirname, 'output.txt');

let stream = fs.createWriteStream(textPath, { flags: 'w', encoding: 'utf-8' });
const rl = readline.createInterface(process.stdin, process.stdout);

stream.on('write', (data) => {
  stream.write(data);
});
stream.on('error', (e) => {
  if (e.code == 'ENOENT') {
    console.log('Файл не найден');
  } else {
    console.error(e);
  }
});

console.log('Приветик моему виртуальному другу, введи сообщение:');
rl.on('line', (input) => {
  if (input === 'exit') { 
    process.exit();
  }
  else {
    stream.emit('write', `${input}\n`);
  }  
});

process.on('exit', () => {
  console.log('Пока!');
});