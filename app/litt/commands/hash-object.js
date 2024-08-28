const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const zlib = require("zlib");

class CommandHashObject {
    constructor(flag, filePath) {
        this.flag = flag;
        this.filePath = filePath;
    }

    execute() {
        const filePath = path.resolve(this.filePath);

        if(!fs.existsSync(filePath)) {
            throw new Error(`Could not open ${this.filePath}`);
        }

        const fileContent = fs.readFileSync(filePath);

        const fileLength = fileContent.length;

        const header = `blob ${fileLength}\0`;
        const blob = Buffer.concat([Buffer.from(header), fileContent]);

        const hash = crypto.createHash("sha1").update(blob).digest("hex");

        if(this.flag && this.flag === "-w") {
            const folder = hash.slice(0, 2);
            const file = hash.slice(2);

            const folderPath = path.join(process.cwd(), ".git", "objects", folder);

            if(!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath);
            }

            const compressedContent = zlib.deflateSync(blob);
            fs.writeFileSync(path.join(folderPath, file), compressedContent);
        }

        process.stdout.write(hash);
    }
}

module.exports = CommandHashObject;

// ensure that the file exists
// read the file content
// create a blob object
// compress the content
// write the compressed content to the objects directory
// print the hash