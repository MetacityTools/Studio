var $OaNl0$react = require("react");
var $OaNl0$reactariassr = require("@react-aria/ssr");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "BreakpointProvider", () => $893a66ba513f4a66$export$8214320346cf5104);
$parcel$export(module.exports, "useMatchedBreakpoints", () => $893a66ba513f4a66$export$140ae7baa51cca23);
$parcel$export(module.exports, "useBreakpoint", () => $893a66ba513f4a66$export$199d6754bdf4e1e3);


const $893a66ba513f4a66$var$Context = /*#__PURE__*/ (0, ($parcel$interopDefault($OaNl0$react))).createContext(null);
$893a66ba513f4a66$var$Context.displayName = 'BreakpointContext';
function $893a66ba513f4a66$export$8214320346cf5104(props) {
    let { children: children, matchedBreakpoints: matchedBreakpoints } = props;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($OaNl0$react))).createElement($893a66ba513f4a66$var$Context.Provider, {
        value: {
            matchedBreakpoints: matchedBreakpoints
        }
    }, children);
}
function $893a66ba513f4a66$export$140ae7baa51cca23(breakpoints) {
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
    let [breakpoint, setBreakpoint] = (0, $OaNl0$react.useState)(()=>supportsMatchMedia ? getBreakpointHandler() : [
            'base'
        ]);
    (0, $OaNl0$react.useEffect)(()=>{
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
    let isSSR = (0, $OaNl0$reactariassr.useIsSSR)();
    return isSSR ? [
        'base'
    ] : breakpoint;
}
function $893a66ba513f4a66$export$199d6754bdf4e1e3() {
    return (0, $OaNl0$react.useContext)($893a66ba513f4a66$var$Context);
}


//# sourceMappingURL=BreakpointProvider.main.js.map
