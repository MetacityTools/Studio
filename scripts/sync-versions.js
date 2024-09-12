const { readFileSync, writeFileSync } = require("fs");
const path = require("path");

const sourcePackageJsonPath = path.join(__dirname, "../package.json");
const sourcePackageJson = JSON.parse(readFileSync(sourcePackageJsonPath, "utf-8"));

const studioPackageJsonPath = path.join(__dirname, "../studio/package.json");
const studioPackageLockJsonPath = path.join(__dirname, "../studio/package-lock.json");

const studioPackageJson = JSON.parse(readFileSync(studioPackageJsonPath, "utf-8"));
const studioPackageLockJson = JSON.parse(readFileSync(studioPackageLockJsonPath, "utf-8"));

console.log(`Studio:  ${studioPackageJson.version} --> ${sourcePackageJson.version}`);
studioPackageJson.version = sourcePackageJson.version;
studioPackageLockJson.version = sourcePackageJson.version;
studioPackageLockJson.packages[""].version = sourcePackageJson.version;
writeFileSync(studioPackageJsonPath, JSON.stringify(studioPackageJson, null, 2), "utf-8");
writeFileSync(studioPackageLockJsonPath, JSON.stringify(studioPackageLockJson, null, 2), "utf-8");
