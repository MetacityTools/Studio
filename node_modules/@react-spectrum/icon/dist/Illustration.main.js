var $fIMBi$reactariautils = require("@react-aria/utils");
var $fIMBi$react = require("react");
var $fIMBi$reactspectrumutils = require("@react-spectrum/utils");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "Illustration", () => $ebfd4d66f1999633$export$d43c2e2ca9b2c105);
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


function $ebfd4d66f1999633$export$d43c2e2ca9b2c105(props) {
    props = (0, $fIMBi$reactspectrumutils.useSlotProps)(props, 'illustration');
    let { children: children, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, 'aria-hidden': ariaHidden, ...otherProps } = props;
    let { styleProps: styleProps } = (0, $fIMBi$reactspectrumutils.useStyleProps)(otherProps);
    let hasLabel = ariaLabel || ariaLabelledby;
    if (!ariaHidden) ariaHidden = undefined;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($fIMBi$react))).cloneElement(children, {
        ...(0, $fIMBi$reactariautils.filterDOMProps)(otherProps),
        ...styleProps,
        focusable: 'false',
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledby,
        'aria-hidden': ariaHidden,
        role: hasLabel ? 'img' : undefined
    });
}


//# sourceMappingURL=Illustration.main.js.map
