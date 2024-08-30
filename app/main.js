const fs = require("fs");
const path = require("path");
const LittClient = require("./litt/client");

const { CommandCatFile, CommandHashObject, CommandLsTree, CommandWriteTree } = require("./litt/commands");

// console.log("Logs from your program will appear here!");

const littClient = new LittClient();

const command = process.argv[2];

switch (command) {
  case "init":
    createGitDirectory();
    break;
  case "cat-file":
    handleCommandCatFile();
    break;
  case "hash-object":
    handleCommandHashObject();        
    break;
  case "ls-tree":
    handleCommandLsTree();
    break;
  case "write-tree":
    handleCommandWriteTree();
    break;
  default:
    throw new Error(`Unknown command ${command}`);
}

function handleCommandCatFile() {
    const flag = process.argv[3];
    const hash = process.argv[4];

    const command = new CommandCatFile(flag, hash);
    littClient.run(command);
    // console.log(`flag: ${flag}, hash: ${hash}`);
}

function handleCommandHashObject() {
    let flag = process.argv[3];
    let filePath = process.argv[4];

    if(!filePath) {
        filePath = flag;
        flag = undefined;
    }

    const command = new CommandHashObject(flag, filePath);
    littClient.run(command);
    // console.log(`flag: ${flag}, filePath: ${filePath}`);
}

function handleCommandLsTree() {
    let flag = process.argv[3];
    let hash = process.argv[4];

    if(!hash && flag === "--name-only") {
        return;
    }

    if(!hash) {
        hash = flag;
        flag = null;
    }

    const command = new CommandLsTree(flag, hash);
    littClient.run(command);
}

function handleCommandWriteTree() {
    const command = new CommandWriteTree();
    littClient.run(command);
}

function createGitDirectory() {
  fs.mkdirSync(path.join(process.cwd(), ".git"), { recursive: true });
  fs.mkdirSync(path.join(process.cwd(), ".git", "objects"), { recursive: true });
  fs.mkdirSync(path.join(process.cwd(), ".git", "refs"), { recursive: true });

  fs.writeFileSync(path.join(process.cwd(), ".git", "HEAD"), "ref: refs/heads/main\n");
  console.log("Initialized git directory");
}
