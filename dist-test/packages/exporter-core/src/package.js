import archiver from "archiver";
import fs from "node:fs";
import { mkdirp } from "fs-extra";
import path from "node:path";
export async function zipDirectory(sourceDir, zipPath) {
    await mkdirp(path.dirname(zipPath));
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(zipPath);
        const archive = archiver("zip", { zlib: { level: 9 } });
        output.on("close", () => resolve());
        archive.on("error", reject);
        archive.pipe(output);
        archive.directory(sourceDir, false);
        archive.finalize().catch(reject);
    });
}
