const path = require("path");
const fs = require("fs");
const zlib = require("zlib");

class CommandLsTree {
    constructor(flag, hash) {
        this.flag = flag;
        this.hash = hash; 
    }

    execute() {
        const flag = this.flag;
        const hash = this.hash;

        const folder = hash.slice(0, 2);
        const file = hash.slice(2);

        const folderPath = path.join(process.cwd(), ".git", "objects", folder);
        const filePath = path.join(folderPath, file);

        if(!fs.existsSync(folderPath)) {
            throw new Error(`Not a valid object name ${hash}`);
        }

        if(!fs.existsSync(filePath)) {
            throw new Error(`Not a valid object name ${hash}`);
        }

        const fileContent = fs.readFileSync(filePath)
        
        const outputBuffer = zlib.inflateSync(fileContent);
        const output = outputBuffer.toString().split("\0");

        const treeContent = output.slice(1).filter((e) = e.includes(" "));
        const nameOnly = treeContent.map((e) => e.split(" ")[1]);

        nameOnly.forEach((name) => process.stdout.write(`${name}\n`));
    }
}

module.exports = CommandLsTree;

// navigate to the .git/objects/hash[0..2] directory
// read the file with the name hash[3..40]
// decompress the file
// print the content