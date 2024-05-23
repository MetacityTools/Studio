export function errorHandler(action: Promise<void>) {
    return action.catch((e) => {
        console.error(e);
        setTimeout(() => {
            throw e;
        });
    });
}
