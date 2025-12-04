/* promise way of handling things */

const fs=require('fs/promises');

(async () => {
    try{
        await fs.copyFile('text.txt','copynewfile.txt')
        console.log('File copied successfully')
    } catch(err){
        console.log('Error',err)
    }
})();



/* this is using callback*/

const fs2=require('fs')

fs2.copyFile('text.txt','copynewfile2.txt',(err)=>{
    if (err) console.log('Error',err)
})


/* tis is using sync */

// const fs3=require('fs')

fs3.copyFileSync('text.txt','copynewfile3.txt')
