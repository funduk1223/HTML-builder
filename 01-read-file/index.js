const fs = require('fs'); 
const path = require('path'); 

const textPath = path.join(__dirname, 'text.txt'); 


let stream = new fs.ReadStream(textPath,  {flags: 'r', encoding: 'utf-8'});

stream.on('readable', ()=> {
  let data = stream.read();
  if (data !== null) {
    console.log(data);
  }
});

stream.on('error', (e)=> {
  if(e.code == 'ENOENT'){
    console.log('Файл не найден');
  }else{
    console.error(e);
  }
});