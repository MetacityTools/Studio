import {filterDOMProps as $2nyUy$filterDOMProps} from "@react-aria/utils";
import $2nyUy$react from "react";
import {useSlotProps as $2nyUy$useSlotProps, useStyleProps as $2nyUy$useStyleProps} from "@react-spectrum/utils";

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


function $88bb85359d3a4aed$export$d43c2e2ca9b2c105(props) {
    props = (0, $2nyUy$useSlotProps)(props, 'illustration');
    let { children: children, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, 'aria-hidden': ariaHidden, ...otherProps } = props;
    let { styleProps: styleProps } = (0, $2nyUy$useStyleProps)(otherProps);
    let hasLabel = ariaLabel || ariaLabelledby;
    if (!ariaHidden) ariaHidden = undefined;
    return /*#__PURE__*/ (0, $2nyUy$react).cloneElement(children, {
        ...(0, $2nyUy$filterDOMProps)(otherProps),
        ...styleProps,
        focusable: 'false',
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledby,
        'aria-hidden': ariaHidden,
        role: hasLabel ? 'img' : undefined
    });
}


export {$88bb85359d3a4aed$export$d43c2e2ca9b2c105 as Illustration};
//# sourceMappingURL=Illustration.module.js.map
