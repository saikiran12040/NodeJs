const fs = require("fs/promises");
const fss = require("fs"); // <-- normal fs for watch()
const path = require("path");

const filePath = path.join(__dirname, "command.txt");

(async () => {
  const CREATE_FILE = "create a file";
  const DELETE_FILE = "delete the file";
  const RENAME_FILE = "rename the file";
  const ADD_TO_FILE = "add to the file";

  const createFile = async (file) => {
    try {
      await fs.access(file);
      console.log(`The file ${file} already exists`);
    } catch {
      await fs.writeFile(file, "");
      console.log(`The file ${file} has been created`);
    }
  };

  const deleteFile = async (file) => {
    try {
      await fs.unlink(file);
      console.log("The file has been deleted.");
    } catch (e) {
      console.log("No file at this path to remove.", file);
    }
  };

  const renameFile = async (oldFile, newFile) => {
    try {
      await fs.rename(oldFile, newFile);
      console.log("File renamed successfully.");
    } catch (e) {
      console.log(oldFile, newFile);
      console.log("No file at this path to rename.");
    }
  };

  let previousContent = "";
  const addToFile = async (file, content) => {
    if (previousContent === content) {
      return;
    }
    try {
      await fs.appendFile(file, content);
      previousContent = content;
      console.log("Content added successfully.");
    } catch (e) {
      console.log("No file at this path to add content.");
    }
  };

  // ------------------------------------------------
  // WATCHER (CORRECT WAY)
  // ------------------------------------------------

  const watcher = fss.watch(filePath);
  
  let timer=null;

  
  watcher.on("change", async () => {
    // Read whole file
    if(timer) clearTimeout(timer);

    timer=setTimeout(async()=>{
        if (command.includes(CREATE_FILE)) {
      const file = path.join(
        __dirname,
        command.substring(CREATE_FILE.length + 1).trim()
      );
      createFile(file);
    }

    if (command.includes(DELETE_FILE)) {
      const file = path.join(
        __dirname,
        command.substring(DELETE_FILE.length + 1).trim()
      );
      deleteFile(file);
    }

    if (command.includes(RENAME_FILE)) {
      const _idx = command.indexOf(" to ");
      const oldFile = path.join(
        __dirname,
        command.substring(RENAME_FILE.length + 1, _idx).trim()
      );

      const newFile = path.join(__dirname, command.substring(_idx + 4).trim());
      renameFile(oldFile, newFile);
    }

    if (command.includes(ADD_TO_FILE)) {
      const _idx = command.indexOf(" this content: ");
      const file = path.join(
        __dirname,
        command.substring(ADD_TO_FILE.length + 1, _idx).trim()
      );
      const content = command.substring(_idx + 15);
      addToFile(file, content);
    }
    },50)
    const command = await fs.readFile(filePath, "utf-8");

    
  });
})();
