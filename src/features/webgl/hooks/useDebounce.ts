export const useDebouce = () => {
    return (fn: Function, time: number) => {
        let timeout: any;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                fn(...args);
            }, time);
        };
    };
};
