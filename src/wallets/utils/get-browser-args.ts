export function getBrowserArgs(extensionPath: string, slowMo: number) {
    const browserArgs = [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`];
    if (process.env.HEADLESS) {
        browserArgs.push("--headless=new");

        if (slowMo > 0) {
            console.warn("⚠️ Slow motion makes no sense in headless mode. It will be ignored!");
        }
    }

    return browserArgs;
}
