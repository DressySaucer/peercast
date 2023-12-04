export interface VInputAPI {
    keyUp: (keyCode: string) => undefined;
    keyDown: (keyCode: string) => undefined;
    keyPress: (keyCode: string) => undefined;
    mouseMove: (x: number, y: number) => undefined;
    mouseUp: (x: number, y: number) => undefined;
    mouseDown: (x: number, y: number) => undefined;
    mouseClick: (x: number, y: number) => undefined;
}

declare global {
    interface Window {
        vinput: VInputAPI;
    }
}
