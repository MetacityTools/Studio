import {useMediaQuery as $9bAXg$useMediaQuery} from "@react-spectrum/utils";

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
function $d8453c5ae7fac713$export$6343629ee1b29116(theme, defaultColorScheme) {
    let matchesDark = (0, $9bAXg$useMediaQuery)('(prefers-color-scheme: dark)');
    let matchesLight = (0, $9bAXg$useMediaQuery)('(prefers-color-scheme: light)');
    // importance OS > default > omitted
    if (theme.dark && matchesDark) return 'dark';
    if (theme.light && matchesLight) return 'light';
    if (theme.dark && defaultColorScheme === 'dark') return 'dark';
    if (theme.light && defaultColorScheme === 'light') return 'light';
    if (!theme.dark) return 'light';
    if (!theme.light) return 'dark';
    return 'light';
}
function $d8453c5ae7fac713$export$a8d2043b2d807f4d(theme) {
    let matchesFine = (0, $9bAXg$useMediaQuery)('(any-pointer: fine)');
    if (matchesFine && theme.medium) return 'medium';
    if (theme.large) return 'large';
    return 'medium';
}


export {$d8453c5ae7fac713$export$6343629ee1b29116 as useColorScheme, $d8453c5ae7fac713$export$a8d2043b2d807f4d as useScale};
//# sourceMappingURL=mediaQueries.module.js.map
