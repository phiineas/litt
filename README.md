# Litt - A Simplified Git Implementation in JavaScript

Litt is a lightweight, simplified implementation of core Git functionalities using JavaScript. It supports essential Git commands such as initializing repositories, creating blobs, trees, commits, and listing tree objects.

## Features

- **Initialize a Git repository**
- **Create and manage blobs and trees**
- **Commit changes to the repository**
- **List tree objects and inspect blob contents**

## Commands

### `init`
Initializes a new Git repository by creating the necessary `.git` directory structure.

```bash
node app/main.js init
```

### `cat-file`
Displays the content of a blob object.

```bash
node app/main.js cat-file <flag> <hash>
```
- `<flag>`: The format for displaying the object. Common flags include -p for pretty print.
- `<hash>`: The SHA-1 hash of the object to display.

### `hash-object`
Creates a blob object from a file and returns its hash.

```bash
node app/main.js hash-object <flag> <filePath>
```
- `<flag>`: The format for the object (e.g., -w to write the object).
- `<filePath>`: The path to the file you want to hash.

### `ls-tree`
Lists the contents of a tree object.

```bash
node app/main.js ls-tree <flag> <hash>
```
- `<flag>`: The format for listing (e.g., -l for long format).
- `<hash>`: The SHA-1 hash of the tree object to list.

### `write-tree`
Writes the current working directory as a tree object and returns its hash.

```bash
node app/main.js write-tree
```

### `commit-tree`
Creates a commit object from a tree object and a parent commit hash.

```bash
node app/main.js commit-tree <tree> <commithash> <message>
```
- `<tree>`: The SHA-1 hash of the tree object to commit.
- `<commithash>`: The SHA-1 hash of the parent commit.
- `<message>`: The commit message.

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/phiineas/litt.git
```

2. Install the necessary dependencies
```bash
npm install
```

3. Run the Git command using Node.js
```bash
node app/main.js <command>
```