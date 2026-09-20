"use strict";

const fs = require("fs");

const html = fs.readFileSync("index.html", "utf8");
const script = fs.readFileSync("script.js", "utf8");
const ids = [...html.matchAll(/\bid=["']([^"']+)/g)].map(match => match[1]);
const references = [...script.matchAll(/\$\(\s*["']([^"']+)/g)].map(match => match[1]);
const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
const missing = [...new Set(references)].filter(id => !ids.includes(id));
const audioDefinitions = [...script.matchAll(/^\s*([A-Za-z][\w]*)\s*:\s*["']music\//gm)].map(match => match[1]);
const audioReferences = [...script.matchAll(/AUDIO_FILES\.([A-Za-z]\w*)/g)].map(match => match[1]);
const undefinedAudio = [...new Set(audioReferences)].filter(key => !audioDefinitions.includes(key));

if (duplicates.length || missing.length || undefinedAudio.length) {
    console.error({ duplicates, missing, undefinedAudio });
    process.exit(1);
}

console.log(`PASS: ${ids.length} HTML ids, ${new Set(references).size} DOM references, ${audioDefinitions.length} audio mappings.`);
