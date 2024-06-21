var $fkNaJ$reactariassr = require("@react-aria/ssr");


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "useIsMobileDevice", () => $e9c08f6fb6c823d1$export$736bf165441b18c7);
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
const $e9c08f6fb6c823d1$var$MOBILE_SCREEN_WIDTH = 700;
function $e9c08f6fb6c823d1$export$736bf165441b18c7() {
    let isSSR = (0, $fkNaJ$reactariassr.useIsSSR)();
    if (isSSR || typeof window === 'undefined') return false;
    return window.screen.width <= $e9c08f6fb6c823d1$var$MOBILE_SCREEN_WIDTH;
}


//# sourceMappingURL=useIsMobileDevice.main.js.map
