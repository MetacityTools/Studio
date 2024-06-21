var $9bLOP$clsx = require("clsx");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "shouldKeepSpectrumClassNames", () => $e720495fead531ee$export$46d604dce8bf8724);
$parcel$export(module.exports, "keepSpectrumClassNames", () => $e720495fead531ee$export$f9d3bfd10703eb31);
$parcel$export(module.exports, "classNames", () => $e720495fead531ee$export$ce4ab0c55987d1ff);
/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ 
let $e720495fead531ee$export$46d604dce8bf8724 = false;
function $e720495fead531ee$export$f9d3bfd10703eb31() {
    $e720495fead531ee$export$46d604dce8bf8724 = true;
    console.warn("Legacy spectrum-prefixed class names enabled for backward compatibility. We recommend replacing instances of CSS overrides targeting spectrum selectors in your app with custom class names of your own, and disabling this flag.");
}
function $e720495fead531ee$export$ce4ab0c55987d1ff(cssModule, ...values) {
    let classes = [];
    for (let value of values){
        if (typeof value === 'object' && value) {
            let mapped = {};
            for(let key in value){
                if (cssModule[key]) mapped[cssModule[key]] = value[key];
                if ($e720495fead531ee$export$46d604dce8bf8724 || !cssModule[key]) mapped[key] = value[key];
            }
            classes.push(mapped);
        } else if (typeof value === 'string') {
            if (cssModule[value]) classes.push(cssModule[value]);
            if ($e720495fead531ee$export$46d604dce8bf8724 || !cssModule[value]) classes.push(value);
        } else classes.push(value);
    }
    return (0, ($parcel$interopDefault($9bLOP$clsx)))(...classes);
}


//# sourceMappingURL=classNames.main.js.map
