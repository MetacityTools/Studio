import $9wJsi$react, {useState as $9wJsi$useState, useEffect as $9wJsi$useEffect, useContext as $9wJsi$useContext} from "react";
import {useIsSSR as $9wJsi$useIsSSR} from "@react-aria/ssr";



const $1051245f87c5981d$var$Context = /*#__PURE__*/ (0, $9wJsi$react).createContext(null);
$1051245f87c5981d$var$Context.displayName = 'BreakpointContext';
function $1051245f87c5981d$export$8214320346cf5104(props) {
    let { children: children, matchedBreakpoints: matchedBreakpoints } = props;
    return /*#__PURE__*/ (0, $9wJsi$react).createElement($1051245f87c5981d$var$Context.Provider, {
        value: {
            matchedBreakpoints: matchedBreakpoints
        }
    }, children);
}
function $1051245f87c5981d$export$140ae7baa51cca23(breakpoints) {
    let entries = Object.entries(breakpoints).sort(([, valueA], [, valueB])=>valueB - valueA);
    let breakpointQueries = entries.map(([, value])=>`(min-width: ${value}px)`);
    let supportsMatchMedia = typeof window !== 'undefined' && typeof window.matchMedia === 'function';
    let getBreakpointHandler = ()=>{
        let matched = [];
        for(let i in breakpointQueries){
            let query = breakpointQueries[i];
            if (window.matchMedia(query).matches) matched.push(entries[i][0]);
        }
        matched.push('base');
        return matched;
    };
    let [breakpoint, setBreakpoint] = (0, $9wJsi$useState)(()=>supportsMatchMedia ? getBreakpointHandler() : [
            'base'
        ]);
    (0, $9wJsi$useEffect)(()=>{
        if (!supportsMatchMedia) return;
        let onResize = ()=>{
            const breakpointHandler = getBreakpointHandler();
            setBreakpoint((previousBreakpointHandler)=>{
                if (previousBreakpointHandler.length !== breakpointHandler.length || previousBreakpointHandler.some((breakpoint, idx)=>breakpoint !== breakpointHandler[idx])) return [
                    ...breakpointHandler
                ]; // Return a new array to force state change
                return previousBreakpointHandler;
            });
        };
        window.addEventListener('resize', onResize);
        return ()=>{
            window.removeEventListener('resize', onResize);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        supportsMatchMedia
    ]);
    // If in SSR, the media query should never match. Once the page hydrates,
    // this will update and the real value will be returned.
    let isSSR = (0, $9wJsi$useIsSSR)();
    return isSSR ? [
        'base'
    ] : breakpoint;
}
function $1051245f87c5981d$export$199d6754bdf4e1e3() {
    return (0, $9wJsi$useContext)($1051245f87c5981d$var$Context);
}


export {$1051245f87c5981d$export$8214320346cf5104 as BreakpointProvider, $1051245f87c5981d$export$140ae7baa51cca23 as useMatchedBreakpoints, $1051245f87c5981d$export$199d6754bdf4e1e3 as useBreakpoint};
//# sourceMappingURL=BreakpointProvider.module.js.map
