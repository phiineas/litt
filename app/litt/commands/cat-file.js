const path = require("path");
const fs = require("fs");
const zlib = require("zlib");

class CommandCatFile {
    constructor(flag, hash) {
        this.flag = flag;
        this.hash = hash;
    }

    execute() {
        const flag = this.flag;
        const hash = this.hash;

        switch(flag) {
            case "-p": {
                const folder = hash.slice(0, 2);
                const file = hash.slice(2);

                const objectPath = path.join(process.cwd(), ".git", "objects", folder, file);

                if(!fs.existsSync(objectPath)) {
                    throw new Error(`Not a valid object name ${hash}`);
                }

                const fileContent = fs.readFileSync(objectPath);

                const decompressed = zlib.inflateSync(fileContent);

                const output = decompressed.toString().split("\x00")[1];

                process.stdout.write(output);
            }
            break;
        }
    }
}

module.exports = CommandCatFile;

// navigate to the .git/objects/hash[0..2] directory
// read the file with the name hash[3..40]
// decompress the file
// print the content