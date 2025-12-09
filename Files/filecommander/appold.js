const fs = require("fs/promises");
const path = require("path");

const filePath = path.join(__dirname, "command.txt");

(async () => {
    const CREATE_FILE="create a file";
    const DELETE_FILE="delete the file";
    const RENAME_FILE="rename the file";
    const ADD_TO_FILE="add to the file";

    const createFile=async(filePath)=>{
        try{
            const existingFileHandle=await fs.open(path,"r");
            existingFileHandle.close();

            return console.log(`The file ${filePath} already exists`);
        } catch (e) {
            const newFileHandle=await fs.open(filePath,"w");
            console.log(`The file ${filePath} has been created`)
            newFileHandle.close();
        }
    }

    const deleteFile=async(filePath)=>{
        try{
            await fs.unlink(filePath)
            console.log("The file has been deleted.")
        } catch(e) {
            if(e.code==="ENOENT"){
                console.log("No file at this path to remove.")
            } else {
                console.log("An error occurred:",e)
            }
        }
    }

    const renameFile=async(oldFilePath,newFilePath)=>{
        try{
            await fs.rename(oldFilePath,newFilePath)
            console.log("file renamed successfully.")
        } catch(e) {
            if(e.code==="ENOENT") {
                console.log("No file at this path to rename.")
            } else {
                console.log("An error occurred while removing the file:",e)
            }
        }
    }

    const addToFile=async(filePath,content)=>{
        try{
            await fs.open(filePath,"a")
            console.log("content added successfully.")
        } catch(e) {
            if(e.code==="ENOENT") {
                console.log("No file at this path to add content.")
            } else {
                console.log("An error occurred while adding content",e)
            }
        }
    }

    const commandFileHandler=await fs.open(filePath,'r');

    commandFileHandler.on("change",async()=>{
        // get the size of our file 
        const size=(await commandFileHandler.stat()).size; 
        // allocate our buffer with the size 
        const buff=Buffer.alloc(size);
        // the location at which we want to start filling our buffer 
        const offset=0; 
        // how mant byttes we want to read 
        const length=buff.byteLength; 
        // the position that we want to start reading the file from 
        const position=0;

        // we always want to read the whole content (from beginning) 
        await commandFileHandler.read(buff,offset,length,position);

        const command=buff.toString('utf-8')

        if(command.includes(CREATE_FILE)){
            const filePath=command.substring(CREATE_FILE.length+1)
            createFile(filePath)
        }

        if(command.includes(DELETE_FILE)){
            const filePath=command.substring(DELETE_FILE.length+1)
            deleteFile(filePath)
        }

        if(command.includes(RENAME_FILE)){
            const _idx=command.indexOf(" to ")
            const oldFilePath=command.substring(RENAME_FILE.length+1,_idx)
            const newFilePath=command.substring(_idx+4)
            renameFile(oldFilePath,newFilePath);
        }

        if(command.includes(ADD_TO_FILE)){
            const _idx=command.indexOf(" this content: ")
            const filePath=command.substring(ADD_TO_FILE.length+1,_idx);
            const content=command.substring(_idx+15);
            addToFile(filePath,content);
        }
    })

    const watcher=fs.watch(filePath);

    for await (const event of watcher){
        if(event.eventType==="change"){
            commandFileHandler.emit("change");
        }
    }
})();
