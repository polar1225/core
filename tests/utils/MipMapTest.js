var BitmapImage2D = require("awayjs-core/lib/data/BitmapImage2D");
var Matrix = require("awayjs-core/lib/geom/Matrix");
var Rectangle = require("awayjs-core/lib/geom/Rectangle");
var URLLoader = require("awayjs-core/lib/net/URLLoader");
var URLLoaderDataFormat = require("awayjs-core/lib/net/URLLoaderDataFormat");
var URLRequest = require("awayjs-core/lib/net/URLRequest");
var Event = require("awayjs-core/lib/events/Event");
var ParserUtils = require("awayjs-core/lib/parsers/ParserUtils");
var ImageUtils = require("awayjs-core/lib/utils/ImageUtils");
var MipMapTest = (function () {
    function MipMapTest() {
        //---------------------------------------
        // Load a PNG
        var _this = this;
        this._rect = new Rectangle();
        this._matrix = new Matrix();
        var mipUrlRequest = new URLRequest('assets/1024x1024.png');
        this.mipLoader = new URLLoader();
        this.mipLoader.dataFormat = URLLoaderDataFormat.BLOB;
        this.mipLoader.load(mipUrlRequest);
        this.mipLoader.addEventListener(Event.COMPLETE, function (event) { return _this.mipImgLoaded(event); });
        document.onmousedown = function (e) { return _this.onMouseDown(e); };
    }
    MipMapTest.prototype.mipImgLoaded = function (event) {
        var _this = this;
        var loader = event.target;
        var image = ParserUtils.blobToImage(loader.data);
        image.onload = function (event) { return _this.onImageLoad(event); };
    };
    MipMapTest.prototype.onImageLoad = function (event) {
        var image = event.target;
        alert('Each click will generate a level of MipMap');
        this.sourceBitmap = new BitmapImage2D(1024, 1024, true, 0xff0000);
        this.sourceBitmap.draw(image);
        this.sourceBitmap.getCanvas().style.position = 'absolute';
        this.sourceBitmap.getCanvas().style.left = '0px';
        this.sourceBitmap.getCanvas().style.top = '1030px';
        //document.body.appendChild( this.sourceBitmap.canvas );
        this.mipMap = new BitmapImage2D(1024, 1024, true, 0xff0000);
        this.mipMap.getCanvas().style.position = 'absolute';
        this.mipMap.getCanvas().style.left = '0px';
        this.mipMap.getCanvas().style.top = '0px';
        document.body.appendChild(this.mipMap.getCanvas());
        this._rect.width = this.sourceBitmap.width;
        this._rect.height = this.sourceBitmap.height;
        this.w = this.sourceBitmap.width;
        this.h = this.sourceBitmap.height;
    };
    MipMapTest.prototype.onMouseDown = function (e) {
        this.generateMipMap(this.sourceBitmap, this.mipMap);
    };
    MipMapTest.prototype.generateMipMap = function (source, mipmap, alpha, side) {
        if (mipmap === void 0) { mipmap = null; }
        if (alpha === void 0) { alpha = false; }
        if (side === void 0) { side = -1; }
        var c = this.w;
        var i;
        console['time']('MipMap' + c);
        if ((this.w >= 1) || (this.h >= 1)) {
            if (alpha)
                mipmap.fillRect(this._rect, 0);
            this._matrix.a = this._rect.width / source.width;
            this._matrix.d = this._rect.height / source.height;
            mipmap.width = this.w;
            mipmap.height = this.h;
            mipmap.copyPixels(source, source.rect, new Rectangle(0, 0, this.w, this.h));
            this.w >>= 1;
            this.h >>= 1;
            this._rect.width = this.w > 1 ? this.w : 1;
            this._rect.height = this.h > 1 ? this.h : 1;
        }
        console.log('ImageUtils.isBitmapImage2DValid: ', ImageUtils.isImage2DValid(mipmap));
        console['timeEnd']('MipMap' + c);
    };
    return MipMapTest;
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzL01pcE1hcFRlc3QudHMiXSwibmFtZXMiOlsiTWlwTWFwVGVzdCIsIk1pcE1hcFRlc3QuY29uc3RydWN0b3IiLCJNaXBNYXBUZXN0Lm1pcEltZ0xvYWRlZCIsIk1pcE1hcFRlc3Qub25JbWFnZUxvYWQiLCJNaXBNYXBUZXN0Lm9uTW91c2VEb3duIiwiTWlwTWFwVGVzdC5nZW5lcmF0ZU1pcE1hcCJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxhQUFhLFdBQVksb0NBQW9DLENBQUMsQ0FBQztBQUN0RSxJQUFPLE1BQU0sV0FBYyw2QkFBNkIsQ0FBQyxDQUFDO0FBQzFELElBQU8sU0FBUyxXQUFhLGdDQUFnQyxDQUFDLENBQUM7QUFDL0QsSUFBTyxTQUFTLFdBQWEsK0JBQStCLENBQUMsQ0FBQztBQUM5RCxJQUFPLG1CQUFtQixXQUFXLHlDQUF5QyxDQUFDLENBQUM7QUFDaEYsSUFBTyxVQUFVLFdBQWEsZ0NBQWdDLENBQUMsQ0FBQztBQUNoRSxJQUFPLEtBQUssV0FBYyw4QkFBOEIsQ0FBQyxDQUFDO0FBQzFELElBQU8sV0FBVyxXQUFhLHFDQUFxQyxDQUFDLENBQUM7QUFDdEUsSUFBTyxVQUFVLFdBQWEsa0NBQWtDLENBQUMsQ0FBQztBQUVsRSxJQUFNLFVBQVU7SUFXZkEsU0FYS0EsVUFBVUE7UUFhZEMseUNBQXlDQTtRQUN6Q0EsYUFBYUE7UUFkZkEsaUJBZ0dDQTtRQTFGUUEsVUFBS0EsR0FBeUJBLElBQUlBLFNBQVNBLEVBQUVBLENBQUNBO1FBQzlDQSxZQUFPQSxHQUFvQkEsSUFBSUEsTUFBTUEsRUFBRUEsQ0FBQ0E7UUFTL0NBLElBQUlBLGFBQWFBLEdBQUdBLElBQUlBLFVBQVVBLENBQUVBLHNCQUFzQkEsQ0FBQ0EsQ0FBQ0E7UUFDNURBLElBQUlBLENBQUNBLFNBQVNBLEdBQUlBLElBQUlBLFNBQVNBLEVBQUVBLENBQUNBO1FBQ2xDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxVQUFVQSxHQUFHQSxtQkFBbUJBLENBQUNBLElBQUlBLENBQUNBO1FBQ3JEQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFFQSxhQUFhQSxDQUFFQSxDQUFDQTtRQUNyQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsZ0JBQWdCQSxDQUFFQSxLQUFLQSxDQUFDQSxRQUFRQSxFQUFHQSxVQUFDQSxLQUFXQSxJQUFLQSxPQUFBQSxLQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxLQUFLQSxDQUFDQSxFQUF4QkEsQ0FBd0JBLENBQUVBLENBQUNBO1FBRTlGQSxRQUFRQSxDQUFDQSxXQUFXQSxHQUFHQSxVQUFFQSxDQUFDQSxJQUFNQSxPQUFBQSxLQUFJQSxDQUFDQSxXQUFXQSxDQUFFQSxDQUFDQSxDQUFFQSxFQUFyQkEsQ0FBcUJBLENBQUNBO0lBQ3ZEQSxDQUFDQTtJQUVPRCxpQ0FBWUEsR0FBcEJBLFVBQXFCQSxLQUFXQTtRQUFoQ0UsaUJBS0NBO1FBSEFBLElBQUlBLE1BQU1BLEdBQW9DQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUMzREEsSUFBSUEsS0FBS0EsR0FBc0JBLFdBQVdBLENBQUNBLFdBQVdBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1FBQ3BFQSxLQUFLQSxDQUFDQSxNQUFNQSxHQUFHQSxVQUFFQSxLQUFLQSxJQUFNQSxPQUFBQSxLQUFJQSxDQUFDQSxXQUFXQSxDQUFFQSxLQUFLQSxDQUFFQSxFQUF6QkEsQ0FBeUJBLENBQUNBO0lBQ3ZEQSxDQUFDQTtJQUVPRixnQ0FBV0EsR0FBbkJBLFVBQXFCQSxLQUFLQTtRQUV6QkcsSUFBSUEsS0FBS0EsR0FBeUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBO1FBQy9EQSxLQUFLQSxDQUFFQSw0Q0FBNENBLENBQUNBLENBQUNBO1FBRXJEQSxJQUFJQSxDQUFDQSxZQUFZQSxHQUEwQkEsSUFBSUEsYUFBYUEsQ0FBRUEsSUFBSUEsRUFBR0EsSUFBSUEsRUFBR0EsSUFBSUEsRUFBR0EsUUFBUUEsQ0FBRUEsQ0FBQ0E7UUFDOUZBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1FBQzlCQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxTQUFTQSxFQUFFQSxDQUFDQSxLQUFLQSxDQUFDQSxRQUFRQSxHQUFJQSxVQUFVQSxDQUFDQTtRQUMzREEsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsU0FBU0EsRUFBRUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsR0FBUUEsS0FBS0EsQ0FBQ0E7UUFDdERBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLFNBQVNBLEVBQUVBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLEdBQVNBLFFBQVFBLENBQUNBO1FBRXpEQSxBQUVBQSx3REFGd0RBO1FBRXhEQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxhQUFhQSxDQUFFQSxJQUFJQSxFQUFHQSxJQUFJQSxFQUFHQSxJQUFJQSxFQUFHQSxRQUFRQSxDQUFFQSxDQUFDQTtRQUNqRUEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsU0FBU0EsRUFBRUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsUUFBUUEsR0FBSUEsVUFBVUEsQ0FBQ0E7UUFDckRBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFNBQVNBLEVBQUVBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLEdBQVFBLEtBQUtBLENBQUNBO1FBQ2hEQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxTQUFTQSxFQUFFQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxHQUFTQSxLQUFLQSxDQUFDQTtRQUVoREEsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBRUEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsU0FBU0EsRUFBRUEsQ0FBRUEsQ0FBQ0E7UUFFckRBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEtBQUtBLEdBQU1BLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLEtBQUtBLENBQUNBO1FBQzlDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxHQUFLQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUUvQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7UUFDakNBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLE1BQU1BLENBQUNBO0lBRW5DQSxDQUFDQTtJQUVPSCxnQ0FBV0EsR0FBbkJBLFVBQXFCQSxDQUFDQTtRQUVyQkksSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBRUEsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBSUEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBRUEsQ0FBQ0E7SUFDekRBLENBQUNBO0lBRU1KLG1DQUFjQSxHQUFyQkEsVUFBdUJBLE1BQXNCQSxFQUFHQSxNQUE2QkEsRUFBRUEsS0FBcUJBLEVBQUVBLElBQWdCQTtRQUF0RUssc0JBQTZCQSxHQUE3QkEsYUFBNkJBO1FBQUVBLHFCQUFxQkEsR0FBckJBLGFBQXFCQTtRQUFFQSxvQkFBZ0JBLEdBQWhCQSxRQUFlQSxDQUFDQTtRQUVySEEsSUFBSUEsQ0FBQ0EsR0FBVUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDdEJBLElBQUlBLENBQVFBLENBQUNBO1FBRWJBLE9BQU9BLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLFFBQVFBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO1FBRTlCQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFFQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUVyQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0E7Z0JBQ1RBLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO1lBRWhDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxLQUFLQSxHQUFHQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUNqREEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsR0FBR0EsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7WUFFbkRBLE1BQU1BLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO1lBQ3RCQSxNQUFNQSxDQUFDQSxNQUFNQSxHQUFFQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN0QkEsTUFBTUEsQ0FBQ0EsVUFBVUEsQ0FBRUEsTUFBTUEsRUFBR0EsTUFBTUEsQ0FBQ0EsSUFBSUEsRUFBR0EsSUFBSUEsU0FBU0EsQ0FBRUEsQ0FBQ0EsRUFBR0EsQ0FBQ0EsRUFBR0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsRUFBR0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBRUEsQ0FBRUEsQ0FBQ0E7WUFFckZBLElBQUlBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1lBQ2JBLElBQUlBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1lBRWJBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEdBQUVBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQzFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFFQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUM1Q0EsQ0FBQ0E7UUFFREEsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBRUEsbUNBQW1DQSxFQUFHQSxVQUFVQSxDQUFDQSxjQUFjQSxDQUFFQSxNQUFNQSxDQUFFQSxDQUFDQSxDQUFDQTtRQUV4RkEsT0FBT0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsUUFBUUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFFbENBLENBQUNBO0lBQ0ZMLGlCQUFDQTtBQUFEQSxDQWhHQSxBQWdHQ0EsSUFBQSIsImZpbGUiOiJ1dGlscy9NaXBNYXBUZXN0LmpzIiwic291cmNlUm9vdCI6Ii4vdGVzdHMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQml0bWFwSW1hZ2UyRFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZGF0YS9CaXRtYXBJbWFnZTJEXCIpO1xuaW1wb3J0IE1hdHJpeFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vTWF0cml4XCIpO1xuaW1wb3J0IFJlY3RhbmdsZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL1JlY3RhbmdsZVwiKTtcbmltcG9ydCBVUkxMb2FkZXJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbmV0L1VSTExvYWRlclwiKTtcbmltcG9ydCBVUkxMb2FkZXJEYXRhRm9ybWF0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbmV0L1VSTExvYWRlckRhdGFGb3JtYXRcIik7XG5pbXBvcnQgVVJMUmVxdWVzdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9uZXQvVVJMUmVxdWVzdFwiKTtcbmltcG9ydCBFdmVudFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2V2ZW50cy9FdmVudFwiKTtcbmltcG9ydCBQYXJzZXJVdGlsc1x0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9wYXJzZXJzL1BhcnNlclV0aWxzXCIpO1xuaW1wb3J0IEltYWdlVXRpbHNcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdXRpbHMvSW1hZ2VVdGlsc1wiKTtcblxuY2xhc3MgTWlwTWFwVGVzdFxue1xuXG5cdHByaXZhdGUgbWlwTG9hZGVyICAgICAgIDogVVJMTG9hZGVyO1xuXHRwcml2YXRlIHNvdXJjZUJpdG1hcCAgICA6IEJpdG1hcEltYWdlMkQ7XG5cdHByaXZhdGUgbWlwTWFwICAgICAgICAgIDogQml0bWFwSW1hZ2UyRDtcblx0cHJpdmF0ZSBfcmVjdCAgICAgICAgICAgOiBSZWN0YW5nbGUgPSBuZXcgUmVjdGFuZ2xlKCk7XG5cdHByaXZhdGUgX21hdHJpeCAgICAgICAgIDogTWF0cml4ID0gbmV3IE1hdHJpeCgpO1xuXHRwcml2YXRlIHcgICAgICAgICAgICAgICA6IG51bWJlcjtcblx0cHJpdmF0ZSBoICAgICAgICAgICAgICAgOiBudW1iZXI7XG5cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHQvLyBMb2FkIGEgUE5HXG5cblx0XHR2YXIgbWlwVXJsUmVxdWVzdCA9IG5ldyBVUkxSZXF1ZXN0KCAnYXNzZXRzLzEwMjR4MTAyNC5wbmcnKTtcblx0XHR0aGlzLm1pcExvYWRlciAgPSBuZXcgVVJMTG9hZGVyKCk7XG5cdFx0dGhpcy5taXBMb2FkZXIuZGF0YUZvcm1hdCA9IFVSTExvYWRlckRhdGFGb3JtYXQuQkxPQjtcblx0XHR0aGlzLm1pcExvYWRlci5sb2FkKCBtaXBVcmxSZXF1ZXN0ICk7XG5cdFx0dGhpcy5taXBMb2FkZXIuYWRkRXZlbnRMaXN0ZW5lciggRXZlbnQuQ09NUExFVEUgLCAoZXZlbnQ6RXZlbnQpID0+IHRoaXMubWlwSW1nTG9hZGVkKGV2ZW50KSApO1xuXG5cdFx0ZG9jdW1lbnQub25tb3VzZWRvd24gPSAoIGUgKSA9PiB0aGlzLm9uTW91c2VEb3duKCBlICk7XG5cdH1cblxuXHRwcml2YXRlIG1pcEltZ0xvYWRlZChldmVudDpFdmVudClcblx0e1xuXHRcdHZhciBsb2FkZXIgIDogVVJMTG9hZGVyICAgICAgICA9IDxVUkxMb2FkZXIgPiBldmVudC50YXJnZXQ7XG5cdFx0dmFyIGltYWdlIDogSFRNTEltYWdlRWxlbWVudCA9IFBhcnNlclV0aWxzLmJsb2JUb0ltYWdlKGxvYWRlci5kYXRhKTtcblx0XHRpbWFnZS5vbmxvYWQgPSAoIGV2ZW50ICkgPT4gdGhpcy5vbkltYWdlTG9hZCggZXZlbnQgKTtcblx0fVxuXG5cdHByaXZhdGUgb25JbWFnZUxvYWQgKGV2ZW50KVxuXHR7XG5cdFx0dmFyIGltYWdlIDogSFRNTEltYWdlRWxlbWVudCA9IDxIVE1MSW1hZ2VFbGVtZW50PiBldmVudC50YXJnZXQ7XG5cdFx0YWxlcnQoICdFYWNoIGNsaWNrIHdpbGwgZ2VuZXJhdGUgYSBsZXZlbCBvZiBNaXBNYXAnKTtcblxuXHRcdHRoaXMuc291cmNlQml0bWFwICAgICAgICAgICAgICAgICAgICAgICAgPSBuZXcgQml0bWFwSW1hZ2UyRCggMTAyNCAsIDEwMjQgLCB0cnVlICwgMHhmZjAwMDAgKTtcblx0XHR0aGlzLnNvdXJjZUJpdG1hcC5kcmF3KGltYWdlKTtcblx0XHR0aGlzLnNvdXJjZUJpdG1hcC5nZXRDYW52YXMoKS5zdHlsZS5wb3NpdGlvbiAgPSAnYWJzb2x1dGUnO1xuXHRcdHRoaXMuc291cmNlQml0bWFwLmdldENhbnZhcygpLnN0eWxlLmxlZnQgICAgICA9ICcwcHgnO1xuXHRcdHRoaXMuc291cmNlQml0bWFwLmdldENhbnZhcygpLnN0eWxlLnRvcCAgICAgICA9ICcxMDMwcHgnO1xuXG5cdFx0Ly9kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCB0aGlzLnNvdXJjZUJpdG1hcC5jYW52YXMgKTtcblxuXHRcdHRoaXMubWlwTWFwID0gbmV3IEJpdG1hcEltYWdlMkQoIDEwMjQgLCAxMDI0ICwgdHJ1ZSAsIDB4ZmYwMDAwICk7XG5cdFx0dGhpcy5taXBNYXAuZ2V0Q2FudmFzKCkuc3R5bGUucG9zaXRpb24gID0gJ2Fic29sdXRlJztcblx0XHR0aGlzLm1pcE1hcC5nZXRDYW52YXMoKS5zdHlsZS5sZWZ0ICAgICAgPSAnMHB4Jztcblx0XHR0aGlzLm1pcE1hcC5nZXRDYW52YXMoKS5zdHlsZS50b3AgICAgICAgPSAnMHB4JztcblxuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIHRoaXMubWlwTWFwLmdldENhbnZhcygpICk7XG5cblx0XHR0aGlzLl9yZWN0LndpZHRoICAgID0gdGhpcy5zb3VyY2VCaXRtYXAud2lkdGg7XG5cdFx0dGhpcy5fcmVjdC5oZWlnaHQgICA9IHRoaXMuc291cmNlQml0bWFwLmhlaWdodDtcblxuXHRcdHRoaXMudyA9IHRoaXMuc291cmNlQml0bWFwLndpZHRoO1xuXHRcdHRoaXMuaCA9IHRoaXMuc291cmNlQml0bWFwLmhlaWdodDtcblxuXHR9XG5cblx0cHJpdmF0ZSBvbk1vdXNlRG93biggZSApXG5cdHtcblx0XHR0aGlzLmdlbmVyYXRlTWlwTWFwKCB0aGlzLnNvdXJjZUJpdG1hcCAsICB0aGlzLm1pcE1hcCApO1xuXHR9XG5cdFxuXHRwdWJsaWMgZ2VuZXJhdGVNaXBNYXAoIHNvdXJjZSA6IEJpdG1hcEltYWdlMkQgLCBtaXBtYXAgOiBCaXRtYXBJbWFnZTJEID0gbnVsbCwgYWxwaGE6Ym9vbGVhbiA9IGZhbHNlLCBzaWRlOm51bWJlciA9IC0xKVxuXHR7XG5cdFx0dmFyIGM6bnVtYmVyID0gdGhpcy53O1xuXHRcdHZhciBpOm51bWJlcjtcblxuXHRcdGNvbnNvbGVbJ3RpbWUnXSgnTWlwTWFwJyArIGMpO1xuXHRcdFxuXHRcdGlmICgodGhpcy53ID49IDEgKSB8fCAodGhpcy5oID49IDEpKSB7XG5cblx0XHRcdGlmIChhbHBoYSlcblx0XHRcdFx0bWlwbWFwLmZpbGxSZWN0KHRoaXMuX3JlY3QsIDApO1xuXG5cdFx0XHR0aGlzLl9tYXRyaXguYSA9IHRoaXMuX3JlY3Qud2lkdGggLyBzb3VyY2Uud2lkdGg7XG5cdFx0XHR0aGlzLl9tYXRyaXguZCA9IHRoaXMuX3JlY3QuaGVpZ2h0IC8gc291cmNlLmhlaWdodDtcblxuXHRcdFx0bWlwbWFwLndpZHRoID0gdGhpcy53O1xuXHRcdFx0bWlwbWFwLmhlaWdodD0gdGhpcy5oO1xuXHRcdFx0bWlwbWFwLmNvcHlQaXhlbHMoIHNvdXJjZSAsIHNvdXJjZS5yZWN0ICwgbmV3IFJlY3RhbmdsZSggMCAsIDAgLCB0aGlzLncgLCB0aGlzLmggKSApO1xuXG5cdFx0XHR0aGlzLncgPj49IDE7XG5cdFx0XHR0aGlzLmggPj49IDE7XG5cblx0XHRcdHRoaXMuX3JlY3Qud2lkdGggPSB0aGlzLncgPiAxPyB0aGlzLncgOiAxO1xuXHRcdFx0dGhpcy5fcmVjdC5oZWlnaHQgPSB0aGlzLmggPiAxPyB0aGlzLmggOiAxO1xuXHRcdH1cblxuXHRcdGNvbnNvbGUubG9nKCAnSW1hZ2VVdGlscy5pc0JpdG1hcEltYWdlMkRWYWxpZDogJyAsIEltYWdlVXRpbHMuaXNJbWFnZTJEVmFsaWQoIG1pcG1hcCApKTtcblxuXHRcdGNvbnNvbGVbJ3RpbWVFbmQnXSgnTWlwTWFwJyArIGMpO1xuXG5cdH1cbn0iXX0=