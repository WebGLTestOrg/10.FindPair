pc.Application.prototype.resizeCanvas = function (width, height) {
    if (!this._allowResize) return;
    if (this.xr && this.xr.session) return;
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    if (this._fillMode === pc.FILLMODE_KEEP_ASPECT) {
        var r = this.graphicsDevice.canvas.width / this.graphicsDevice.canvas.height;
        var winR = windowWidth / windowHeight;

        if (r > winR) {
            width = windowWidth;
            height = width / r;
        } else {
            height = windowHeight;
            width = height * r;
        }
    } else if (this._fillMode === pc.FILLMODE_FILL_WINDOW) {
        //width = windowWidth;
        //height = windowHeight;
    }

    this.graphicsDevice.canvas.style.width = width + 'px';
    this.graphicsDevice.canvas.style.height = height + 'px';

    if (this._resolutionMode === pc.RESOLUTION_AUTO) {
        this.setCanvasResolution(pc.RESOLUTION_AUTO);
    }

    return {
        width: width,
        height: height
    };
};