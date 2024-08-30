const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');

class CommandWriteTree {
    constructor() {

    }

    execute() {
        const treeFolderPath = path.join(process.cwd(), '.git', 'objects');
    
        function recursiveTreeTraversal(dir) {
            let tree = '';
            const files = fs.readdirSync(dir);

            files.forEach(file => {
                const filePath = path.join(dir, file);
                const stats = fs.statSync(filePath);

                if (stats.isDirectory()) {
                    const subTreeHash = recursiveTreeTraversal(filePath);
                    tree += `40000 ${file}\0${Buffer.from(subTreeHash, 'hex')}`;
                } else {
                    const fileContent = fs.readFileSync(filePath);
                    const fileHash = crypto.createHash('sha1').update(`blob ${fileContent.length}\0`).update(fileContent).digest('hex');
                    tree += `100644 ${file}\0${Buffer.from(fileHash, 'hex')}`;
                }
            });

            const treeHeader = `tree ${tree.length}\0`;
            const treeObject = treeHeader + tree;
            const hash = crypto.createHash('sha1').update(treeObject).digest('hex');
            const compressed = zlib.deflateSync(treeObject);
            fs.writeFileSync(path.join(treeFolderPath, hash.slice(0, 2), hash.slice(2)), compressed);

            return hash;
        }

        const sha = recursiveTreeTraversal(process.cwd());
        if (sha) {
            process.stdout.write(sha);
        } else {
            console.error("Error: SHA value is null or undefined.");
            process.exit(1);
        }
    }
}

module.exports = CommandWriteTree;

// recursively traverse the working directory
// if the object is a directory again traverse it recursively
// if the object is a file then create blob object, write hash and content to the object