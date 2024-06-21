var $fXWOI$react = require("react");


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "createDOMRef", () => $749a6c35064cd8c6$export$a5795cc979dfae80);
$parcel$export(module.exports, "createFocusableRef", () => $749a6c35064cd8c6$export$79d69eee6ae4b329);
$parcel$export(module.exports, "useDOMRef", () => $749a6c35064cd8c6$export$c2c55ef9111cafd8);
$parcel$export(module.exports, "useFocusableRef", () => $749a6c35064cd8c6$export$96a734597687c040);
$parcel$export(module.exports, "unwrapDOMRef", () => $749a6c35064cd8c6$export$c7e28c72a4823176);
$parcel$export(module.exports, "useUnwrapDOMRef", () => $749a6c35064cd8c6$export$1d5cc31d9d8df817);
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
function $749a6c35064cd8c6$export$a5795cc979dfae80(ref) {
    return {
        UNSAFE_getDOMNode () {
            return ref.current;
        }
    };
}
function $749a6c35064cd8c6$export$79d69eee6ae4b329(domRef, focusableRef = domRef) {
    return {
        ...$749a6c35064cd8c6$export$a5795cc979dfae80(domRef),
        focus () {
            if (focusableRef.current) focusableRef.current.focus();
        }
    };
}
function $749a6c35064cd8c6$export$c2c55ef9111cafd8(ref) {
    let domRef = (0, $fXWOI$react.useRef)(null);
    (0, $fXWOI$react.useImperativeHandle)(ref, ()=>$749a6c35064cd8c6$export$a5795cc979dfae80(domRef));
    return domRef;
}
function $749a6c35064cd8c6$export$96a734597687c040(ref, focusableRef) {
    let domRef = (0, $fXWOI$react.useRef)(null);
    (0, $fXWOI$react.useImperativeHandle)(ref, ()=>$749a6c35064cd8c6$export$79d69eee6ae4b329(domRef, focusableRef));
    return domRef;
}
function $749a6c35064cd8c6$export$c7e28c72a4823176(ref) {
    return {
        get current () {
            return ref.current && ref.current.UNSAFE_getDOMNode();
        }
    };
}
function $749a6c35064cd8c6$export$1d5cc31d9d8df817(ref) {
    return (0, $fXWOI$react.useMemo)(()=>$749a6c35064cd8c6$export$c7e28c72a4823176(ref), [
        ref
    ]);
}


//# sourceMappingURL=useDOMRef.main.js.map
