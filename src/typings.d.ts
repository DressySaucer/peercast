declare module "*vinput.node" {
    function keyPress(keyCode: string): undefined;
    function keyDown(keyCode: string): undefined;
    function keyUp(keyCode: string): undefined;
    function mouseMove(x: number, y: number): undefined;
    function mouseClick(x: number, y: number): undefined;
    function mouseDown(x: number, y: number): undefined;
    function mouseUp(x: number, y: number): undefined;
}
