const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const zlib = require("zlib");

class CommandCommitTree {
    constructor(tree, commithash, message) {
        this.tree = tree;
        this.commithash = commithash;
        this.message = message;
    }

    execute() {
        const commitContent = Buffer.concat([
            Buffer.from(`tree ${this.tree}\n`),
            Buffer.from(`parent ${this.commithash}\n`),
            Buffer.from(`author phiineas <geek.jainil18@gmail.com> ${Date.now()} +0000\n`),
            Buffer.from(`committer phiineas <geek.jainil18@gmail.com> ${Date.now()} +0000\n\n`),
            Buffer.from(`${this.message}\n`)
        ]); 

        const commitHeader = `commit ${commitContent.length}\0`;
        const data = Buffer.concat([Buffer.from(commitHeader), commitContent]);

        const hash = crypto.createHash("sha1").update(data).digest("hex");

        const folder = hash.slice(0, 2);
        const file = hash.slice(2);

        const commitPath = path.join(process.cwd(), ".git", "objects", folder);

        if(!fs.existsSync(commitPath)) {
            fs.mkdirSync(commitPath);
        }

        const compressed = zlib.deflateSync(data);
        fs.writeFileSync(path.join(commitPath, file), compressed);

        process.stdout.write(hash);
    }
}

module.exports = CommandCommitTree;