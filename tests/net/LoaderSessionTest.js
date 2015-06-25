var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetEvent = require("awayjs-core/lib/events/AssetEvent");
var ParserEvent = require("awayjs-core/lib/events/ParserEvent");
var LoaderSession = require("awayjs-core/lib/library/LoaderSession");
var URLRequest = require("awayjs-core/lib/net/URLRequest");
var ParserBase = require("awayjs-core/lib/parsers/ParserBase");
var ParserDataFormat = require("awayjs-core/lib/parsers/ParserDataFormat");
var LoaderSessionTest = (function () {
    function LoaderSessionTest() {
        var _this = this;
        //---------------------------------------------------------------------------------------------------------------------
        // Enable Custom Parser ( JSON file format with multiple texture dependencies )
        LoaderSession.enableParser(JSONTextureParser);
        //---------------------------------------------------------------------------------------------------------------------
        // LOAD A SINGLE IMAGE
        this.alImage = new LoaderSession();
        this.alImage.addEventListener(AssetEvent.ASSET_COMPLETE, function (event) { return _this.onAssetComplete(event); });
        this.alImage.addEventListener(AssetEvent.TEXTURE_SIZE_ERROR, function (event) { return _this.onTextureSizeError(event); });
        this.alImage.load(new URLRequest('assets/1024x1024.png'));
        //---------------------------------------------------------------------------------------------------------------------
        // LOAD A SINGLE IMAGE - With wrong dimensions
        this.alErrorImage = new LoaderSession();
        this.alErrorImage.addEventListener(AssetEvent.ASSET_COMPLETE, function (event) { return _this.onAssetComplete(event); });
        this.alErrorImage.addEventListener(AssetEvent.TEXTURE_SIZE_ERROR, function (event) { return _this.onTextureSizeError(event); });
        this.alErrorImage.load(new URLRequest('assets/2.png'));
        //---------------------------------------------------------------------------------------------------------------------
        // LOAD WITH A JSON PARSER
        this.alJson = new LoaderSession();
        this.alJson.addEventListener(AssetEvent.ASSET_COMPLETE, function (event) { return _this.onAssetComplete(event); });
        this.alJson.addEventListener(AssetEvent.TEXTURE_SIZE_ERROR, function (event) { return _this.onTextureSizeError(event); });
        this.alJson.addEventListener(ParserEvent.PARSE_COMPLETE, function (event) { return _this.onParseComplete(event); });
        this.alJson.load(new URLRequest('assets/JSNParserTest.json'));
    }
    LoaderSessionTest.prototype.onParseComplete = function (event) {
        console.log('--------------------------------------------------------------------------------');
        console.log('LoaderSessionTest.onParseComplete', event);
        console.log('--------------------------------------------------------------------------------');
    };
    LoaderSessionTest.prototype.onTextureSizeError = function (event) {
        var assetLoader = event.target;
        console.log('--------------------------------------------------------------------------------');
        console.log('LoaderSessionTest.onTextureSizeError', assetLoader.baseDependency._iLoader.url, event);
        console.log('--------------------------------------------------------------------------------');
    };
    LoaderSessionTest.prototype.onAssetComplete = function (event) {
        var assetLoader = event.target;
        console.log('--------------------------------------------------------------------------------');
        console.log('LoaderSessionTest.onAssetComplete', assetLoader.baseDependency._iLoader.url, event);
        console.log('--------------------------------------------------------------------------------');
    };
    return LoaderSessionTest;
})();
/**
 * ImageParser provides a "parser" for natively supported image types (jpg, png). While it simply loads bytes into
 * a loader object, it wraps it in a BitmapImage2DResource so resource management can happen consistently without
 * exception cases.
 */
var JSONTextureParser = (function (_super) {
    __extends(JSONTextureParser, _super);
    /**
     * Creates a new ImageParser object.
     * @param uri The url or id of the data or file to be parsed.
     * @param extra The holder for extra contextual data that the parser might need.
     */
    function JSONTextureParser() {
        _super.call(this, ParserDataFormat.PLAIN_TEXT);
        this.STATE_PARSE_DATA = 0;
        this.STATE_LOAD_IMAGES = 1;
        this.STATE_COMPLETE = 2;
        this._state = -1;
        this._dependencyCount = 0;
        this._loadedTextures = new Array();
        this._state = this.STATE_PARSE_DATA;
    }
    /**
     * Indicates whether or not a given file extension is supported by the parser.
     * @param extension The file extension of a potential file to be parsed.
     * @return Whether or not the given file type is supported.
     */
    JSONTextureParser.supportsType = function (extension) {
        extension = extension.toLowerCase();
        return extension == "json";
    };
    /**
     * Tests whether a data block can be parsed by the parser.
     * @param data The data block to potentially be parsed.
     * @return Whether or not the given data is supported.
     */
    JSONTextureParser.supportsData = function (data) {
        try {
            var obj = JSON.parse(data);
            if (obj)
                return true;
            return false;
        }
        catch (e) {
            return false;
        }
        return false;
    };
    /**
     * @inheritDoc
     */
    JSONTextureParser.prototype._iResolveDependency = function (resourceDependency) {
        var resource = resourceDependency.assets[0];
        this._pFinalizeAsset(resource, resourceDependency._iLoader.url);
        this._loadedTextures.push(resource);
        //console.log( 'JSONTextureParser._iResolveDependency' , resourceDependency );
        //console.log( 'JSONTextureParser._iResolveDependency resource: ' , resource );
        this._dependencyCount--;
        if (this._dependencyCount == 0)
            this._state = this.STATE_COMPLETE;
    };
    /**
     * @inheritDoc
     */
    JSONTextureParser.prototype._iResolveDependencyFailure = function (resourceDependency) {
        this._dependencyCount--;
        if (this._dependencyCount == 0)
            this._state = this.STATE_COMPLETE;
    };
    JSONTextureParser.prototype.parseJson = function () {
        if (JSONTextureParser.supportsData(this.data)) {
            try {
                var json = JSON.parse(this.data);
                var data = json.data;
                var rec;
                var rq;
                for (var c = 0; c < data.length; c++) {
                    rec = data[c];
                    var uri = rec.image;
                    var id = rec.id;
                    rq = new URLRequest(uri);
                    this._pAddDependency('JSON_ID_' + id, rq, false, null, true);
                }
                this._dependencyCount = data.length;
                this._state = this.STATE_LOAD_IMAGES;
                this._pPauseAndRetrieveDependencies();
            }
            catch (e) {
                this._state = this.STATE_COMPLETE;
            }
        }
    };
    /**
     * @inheritDoc
     */
    JSONTextureParser.prototype._pProceedParsing = function () {
        console.log('JSONTextureParser._pProceedParsing', this._state);
        switch (this._state) {
            case this.STATE_PARSE_DATA:
                this.parseJson();
                return ParserBase.MORE_TO_PARSE;
                break;
            case this.STATE_LOAD_IMAGES:
                break;
            case this.STATE_COMPLETE:
                return ParserBase.PARSING_DONE;
                break;
        }
        return ParserBase.MORE_TO_PARSE;
    };
    return JSONTextureParser;
})(ParserBase);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldC9Mb2FkZXJTZXNzaW9uVGVzdC50cyJdLCJuYW1lcyI6WyJMb2FkZXJTZXNzaW9uVGVzdCIsIkxvYWRlclNlc3Npb25UZXN0LmNvbnN0cnVjdG9yIiwiTG9hZGVyU2Vzc2lvblRlc3Qub25QYXJzZUNvbXBsZXRlIiwiTG9hZGVyU2Vzc2lvblRlc3Qub25UZXh0dXJlU2l6ZUVycm9yIiwiTG9hZGVyU2Vzc2lvblRlc3Qub25Bc3NldENvbXBsZXRlIiwiSlNPTlRleHR1cmVQYXJzZXIiLCJKU09OVGV4dHVyZVBhcnNlci5jb25zdHJ1Y3RvciIsIkpTT05UZXh0dXJlUGFyc2VyLnN1cHBvcnRzVHlwZSIsIkpTT05UZXh0dXJlUGFyc2VyLnN1cHBvcnRzRGF0YSIsIkpTT05UZXh0dXJlUGFyc2VyLl9pUmVzb2x2ZURlcGVuZGVuY3kiLCJKU09OVGV4dHVyZVBhcnNlci5faVJlc29sdmVEZXBlbmRlbmN5RmFpbHVyZSIsIkpTT05UZXh0dXJlUGFyc2VyLnBhcnNlSnNvbiIsIkpTT05UZXh0dXJlUGFyc2VyLl9wUHJvY2VlZFBhcnNpbmciXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLElBQU8sVUFBVSxXQUFhLG1DQUFtQyxDQUFDLENBQUM7QUFFbkUsSUFBTyxXQUFXLFdBQWEsb0NBQW9DLENBQUMsQ0FBQztBQUNyRSxJQUFPLGFBQWEsV0FBWSx1Q0FBdUMsQ0FBQyxDQUFDO0FBRXpFLElBQU8sVUFBVSxXQUFhLGdDQUFnQyxDQUFDLENBQUM7QUFDaEUsSUFBTyxVQUFVLFdBQWEsb0NBQW9DLENBQUMsQ0FBQztBQUNwRSxJQUFPLGdCQUFnQixXQUFZLDBDQUEwQyxDQUFDLENBQUM7QUFHL0UsSUFBTSxpQkFBaUI7SUFNdEJBLFNBTktBLGlCQUFpQkE7UUFBdkJDLGlCQThEQ0E7UUF0RENBLEFBRUFBLHVIQUZ1SEE7UUFDdkhBLCtFQUErRUE7UUFDL0VBLGFBQWFBLENBQUNBLFlBQVlBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsQ0FBQ0E7UUFFOUNBLEFBR0FBLHVI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QUNBO1lBQ3JCQSxLQUFLQSxJQUFJQSxDQUFDQSxnQkFBZ0JBO2dCQUN6QkEsSUFBSUEsQ0FBQ0EsU0FBU0EsRUFBRUEsQ0FBQ0E7Z0JBQ2pCQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQSxhQUFhQSxDQUFDQTtnQkFDaENBLEtBQUtBLENBQUNBO1lBQ1BBLEtBQUtBLElBQUlBLENBQUNBLGlCQUFpQkE7Z0JBQzFCQSxLQUFLQSxDQUFDQTtZQUNQQSxLQUFLQSxJQUFJQSxDQUFDQSxjQUFjQTtnQkFDdkJBLE1BQU1BLENBQUNBLFVBQVVBLENBQUNBLFlBQVlBLENBQUNBO2dCQUMvQkEsS0FBS0EsQ0FBQ0E7UUFDUkEsQ0FBQ0E7UUFFREEsTUFBTUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7SUFDakNBLENBQUNBO0lBQ0ZQLHdCQUFDQTtBQUFEQSxDQTdJQSxBQTZJQ0EsRUE3SStCLFVBQVUsRUE2SXpDIiwiZmlsZSI6Im5ldC9Mb2FkZXJTZXNzaW9uVGVzdC5qcyIsInNvdXJjZVJvb3QiOiIuL3Rlc3RzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJpdG1hcEltYWdlMkRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2RhdGEvQml0bWFwSW1hZ2UyRFwiKTtcbmltcG9ydCBBc3NldEV2ZW50XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2V2ZW50cy9Bc3NldEV2ZW50XCIpO1xuaW1wb3J0IExvYWRlckV2ZW50XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2V2ZW50cy9Mb2FkZXJFdmVudFwiKTtcbmltcG9ydCBQYXJzZXJFdmVudFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9ldmVudHMvUGFyc2VyRXZlbnRcIik7XG5pbXBvcnQgTG9hZGVyU2Vzc2lvblx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9Mb2FkZXJTZXNzaW9uXCIpO1xuaW1wb3J0IElBc3NldFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2xpYnJhcnkvSUFzc2V0XCIpO1xuaW1wb3J0IFVSTFJlcXVlc3RcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbmV0L1VSTFJlcXVlc3RcIik7XG5pbXBvcnQgUGFyc2VyQmFzZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9wYXJzZXJzL1BhcnNlckJhc2VcIik7XG5pbXBvcnQgUGFyc2VyRGF0YUZvcm1hdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvcGFyc2Vycy9QYXJzZXJEYXRhRm9ybWF0XCIpO1xuaW1wb3J0IFJlc291cmNlRGVwZW5kZW5jeVx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3BhcnNlcnMvUmVzb3VyY2VEZXBlbmRlbmN5XCIpO1xuXG5jbGFzcyBMb2FkZXJTZXNzaW9uVGVzdFxue1xuXHRwcml2YXRlIGFsSnNvbjpMb2FkZXJTZXNzaW9uO1xuXHRwcml2YXRlIGFsSW1hZ2U6TG9hZGVyU2Vzc2lvbjtcblx0cHJpdmF0ZSBhbEVycm9ySW1hZ2U6TG9hZGVyU2Vzc2lvbjtcblxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdC8vIEVuYWJsZSBDdXN0b20gUGFyc2VyICggSlNPTiBmaWxlIGZvcm1hdCB3aXRoIG11bHRpcGxlIHRleHR1cmUgZGVwZW5kZW5jaWVzIClcblx0XHRMb2FkZXJTZXNzaW9uLmVuYWJsZVBhcnNlcihKU09OVGV4dHVyZVBhcnNlcik7XG5cblx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdC8vIExPQUQgQSBTSU5HTEUgSU1BR0VcblxuXHRcdHRoaXMuYWxJbWFnZSAgPSBuZXcgTG9hZGVyU2Vzc2lvbigpO1xuXHRcdHRoaXMuYWxJbWFnZS5hZGRFdmVudExpc3RlbmVyKEFzc2V0RXZlbnQuQVNTRVRfQ09NUExFVEUsIChldmVudDpBc3NldEV2ZW50KSA9PiB0aGlzLm9uQXNzZXRDb21wbGV0ZShldmVudCkpO1xuXHRcdHRoaXMuYWxJbWFnZS5hZGRFdmVudExpc3RlbmVyKEFzc2V0RXZlbnQuVEVYVFVSRV9TSVpFX0VSUk9SLCAoZXZlbnQ6QXNzZXRFdmVudCkgPT4gdGhpcy5vblRleHR1cmVTaXplRXJyb3IoZXZlbnQpKTtcblx0XHR0aGlzLmFsSW1hZ2UubG9hZChuZXcgVVJMUmVxdWVzdCgnYXNzZXRzLzEwMjR4MTAyNC5wbmcnKSk7XG5cblx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdC8vIExPQUQgQSBTSU5HTEUgSU1BR0UgLSBXaXRoIHdyb25nIGRpbWVuc2lvbnNcblxuXHRcdHRoaXMuYWxFcnJvckltYWdlID0gbmV3IExvYWRlclNlc3Npb24oKTtcblx0XHR0aGlzLmFsRXJyb3JJbWFnZS5hZGRFdmVudExpc3RlbmVyKEFzc2V0RXZlbnQuQVNTRVRfQ09NUExFVEUsIChldmVudDpBc3NldEV2ZW50KSA9PiB0aGlzLm9uQXNzZXRDb21wbGV0ZShldmVudCkpO1xuXHRcdHRoaXMuYWxFcnJvckltYWdlLmFkZEV2ZW50TGlzdGVuZXIoQXNzZXRFdmVudC5URVhUVVJFX1NJWkVfRVJST1IsIChldmVudDpBc3NldEV2ZW50KSA9PiB0aGlzLm9uVGV4dHVyZVNpemVFcnJvcihldmVudCkpO1xuXHRcdHRoaXMuYWxFcnJvckltYWdlLmxvYWQobmV3IFVSTFJlcXVlc3QoJ2Fzc2V0cy8yLnBuZycpKTtcblxuXHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0Ly8gTE9BRCBXSVRIIEEgSlNPTiBQQVJTRVJcblxuXHRcdHRoaXMuYWxKc29uID0gbmV3IExvYWRlclNlc3Npb24oKTtcblx0XHR0aGlzLmFsSnNvbi5hZGRFdmVudExpc3RlbmVyKCBBc3NldEV2ZW50LkFTU0VUX0NPTVBMRVRFLCAoZXZlbnQ6QXNzZXRFdmVudCkgPT4gdGhpcy5vbkFzc2V0Q29tcGxldGUoZXZlbnQpKTtcblx0XHR0aGlzLmFsSnNvbi5hZGRFdmVudExpc3RlbmVyKCBBc3NldEV2ZW50LlRFWFRVUkVfU0laRV9FUlJPUiwgKGV2ZW50OkFzc2V0RXZlbnQpID0+IHRoaXMub25UZXh0dXJlU2l6ZUVycm9yKGV2ZW50KSk7XG5cdFx0dGhpcy5hbEpzb24uYWRkRXZlbnRMaXN0ZW5lciggUGFyc2VyRXZlbnQuUEFSU0VfQ09NUExFVEUsIChldmVudDpQYXJzZXJFdmVudCkgPT4gdGhpcy5vblBhcnNlQ29tcGxldGUoZXZlbnQpKTtcblx0XHR0aGlzLmFsSnNvbi5sb2FkKG5ldyBVUkxSZXF1ZXN0KCdhc3NldHMvSlNOUGFyc2VyVGVzdC5qc29uJykpO1xuXHR9XG5cblx0cHVibGljIG9uUGFyc2VDb21wbGV0ZShldmVudDpQYXJzZXJFdmVudCk6dm9pZFxuXHR7XG5cdFx0Y29uc29sZS5sb2coICctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xuXHRcdGNvbnNvbGUubG9nKCAnTG9hZGVyU2Vzc2lvblRlc3Qub25QYXJzZUNvbXBsZXRlJyAsIGV2ZW50ICk7XG5cdFx0Y29uc29sZS5sb2coICctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xuXHR9XG5cblx0cHVibGljIG9uVGV4dHVyZVNpemVFcnJvcihldmVudDpBc3NldEV2ZW50KTp2b2lkXG5cdHtcblx0XHR2YXIgYXNzZXRMb2FkZXI6TG9hZGVyU2Vzc2lvbiA9IDxMb2FkZXJTZXNzaW9uPiBldmVudC50YXJnZXQ7XG5cblx0XHRjb25zb2xlLmxvZyggJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XG5cdFx0Y29uc29sZS5sb2coICdMb2FkZXJTZXNzaW9uVGVzdC5vblRleHR1cmVTaXplRXJyb3InICwgYXNzZXRMb2FkZXIuYmFzZURlcGVuZGVuY3kuX2lMb2FkZXIudXJsICwgZXZlbnQgKTtcblx0XHRjb25zb2xlLmxvZyggJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XG5cdH1cblxuXHRwdWJsaWMgb25Bc3NldENvbXBsZXRlKGV2ZW50OkFzc2V0RXZlbnQpOnZvaWRcblx0e1xuXHRcdHZhciBhc3NldExvYWRlcjpMb2FkZXJTZXNzaW9uID0gPExvYWRlclNlc3Npb24+IGV2ZW50LnRhcmdldDtcblxuXHRcdGNvbnNvbGUubG9nKCAnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcblx0XHRjb25zb2xlLmxvZyggJ0xvYWRlclNlc3Npb25UZXN0Lm9uQXNzZXRDb21wbGV0ZScsIGFzc2V0TG9hZGVyLmJhc2VEZXBlbmRlbmN5Ll9pTG9hZGVyLnVybCAsIGV2ZW50ICk7XG5cdFx0Y29uc29sZS5sb2coICctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xuXHR9XG59XG5cbi8qKlxuICogSW1hZ2VQYXJzZXIgcHJvdmlkZXMgYSBcInBhcnNlclwiIGZvciBuYXRpdmVseSBzdXBwb3J0ZWQgaW1hZ2UgdHlwZXMgKGpwZywgcG5nKS4gV2hpbGUgaXQgc2ltcGx5IGxvYWRzIGJ5dGVzIGludG9cbiAqIGEgbG9hZGVyIG9iamVjdCwgaXQgd3JhcHMgaXQgaW4gYSBCaXRtYXBJbWFnZTJEUmVzb3VyY2Ugc28gcmVzb3VyY2UgbWFuYWdlbWVudCBjYW4gaGFwcGVuIGNvbnNpc3RlbnRseSB3aXRob3V0XG4gKiBleGNlcHRpb24gY2FzZXMuXG4gKi9cbmNsYXNzIEpTT05UZXh0dXJlUGFyc2VyIGV4dGVuZHMgUGFyc2VyQmFzZVxue1xuXHRwcml2YXRlIFNUQVRFX1BBUlNFX0RBVEE6bnVtYmVyID0gMDtcblx0cHJpdmF0ZSBTVEFURV9MT0FEX0lNQUdFUzpudW1iZXIgPSAxO1xuXHRwcml2YXRlIFNUQVRFX0NPTVBMRVRFOm51bWJlciA9IDI7XG5cblx0cHJpdmF0ZSBfc3RhdGU6bnVtYmVyID0gLTE7XG5cdHByaXZhdGUgX3N0YXJ0ZWRQYXJzaW5nOmJvb2xlYW47XG5cdHByaXZhdGUgX2RvbmVQYXJzaW5nOmJvb2xlYW47XG5cdHByaXZhdGUgX2RlcGVuZGVuY3lDb3VudDpudW1iZXIgPSAwO1xuXHRwcml2YXRlIF9sb2FkZWRUZXh0dXJlczpBcnJheTxCaXRtYXBJbWFnZTJEPjtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBJbWFnZVBhcnNlciBvYmplY3QuXG5cdCAqIEBwYXJhbSB1cmkgVGhlIHVybCBvciBpZCBvZiB0aGUgZGF0YSBvciBmaWxlIHRvIGJlIHBhcnNlZC5cblx0ICogQHBhcmFtIGV4dHJhIFRoZSBob2xkZXIgZm9yIGV4dHJhIGNvbnRleHR1YWwgZGF0YSB0aGF0IHRoZSBwYXJzZXIgbWlnaHQgbmVlZC5cblx0ICovXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHN1cGVyKFBhcnNlckRhdGFGb3JtYXQuUExBSU5fVEVYVCk7XG5cblx0XHR0aGlzLl9sb2FkZWRUZXh0dXJlcyA9IG5ldyBBcnJheTxCaXRtYXBJbWFnZTJEPigpO1xuXHRcdHRoaXMuX3N0YXRlID0gdGhpcy5TVEFURV9QQVJTRV9EQVRBO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCBhIGdpdmVuIGZpbGUgZXh0ZW5zaW9uIGlzIHN1cHBvcnRlZCBieSB0aGUgcGFyc2VyLlxuXHQgKiBAcGFyYW0gZXh0ZW5zaW9uIFRoZSBmaWxlIGV4dGVuc2lvbiBvZiBhIHBvdGVudGlhbCBmaWxlIHRvIGJlIHBhcnNlZC5cblx0ICogQHJldHVybiBXaGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gZmlsZSB0eXBlIGlzIHN1cHBvcnRlZC5cblx0ICovXG5cblx0cHVibGljIHN0YXRpYyBzdXBwb3J0c1R5cGUoZXh0ZW5zaW9uIDogc3RyaW5nKSA6IGJvb2xlYW5cblx0e1xuXHRcdGV4dGVuc2lvbiA9IGV4dGVuc2lvbi50b0xvd2VyQ2FzZSgpO1xuXHRcdHJldHVybiBleHRlbnNpb24gPT0gXCJqc29uXCI7XG5cdH1cblxuXHQvKipcblx0ICogVGVzdHMgd2hldGhlciBhIGRhdGEgYmxvY2sgY2FuIGJlIHBhcnNlZCBieSB0aGUgcGFyc2VyLlxuXHQgKiBAcGFyYW0gZGF0YSBUaGUgZGF0YSBibG9jayB0byBwb3RlbnRpYWxseSBiZSBwYXJzZWQuXG5cdCAqIEByZXR1cm4gV2hldGhlciBvciBub3QgdGhlIGdpdmVuIGRhdGEgaXMgc3VwcG9ydGVkLlxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBzdXBwb3J0c0RhdGEoZGF0YSA6IGFueSkgOiBib29sZWFuXG5cdHtcblx0XHR0cnkge1xuXHRcdFx0dmFyIG9iaiA9IEpTT04ucGFyc2UoZGF0YSk7XG5cblx0XHRcdGlmIChvYmopXG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSBjYXRjaCAoIGUgKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgX2lSZXNvbHZlRGVwZW5kZW5jeShyZXNvdXJjZURlcGVuZGVuY3k6UmVzb3VyY2VEZXBlbmRlbmN5KVxuXHR7XG5cdFx0dmFyIHJlc291cmNlIDogQml0bWFwSW1hZ2UyRCA9IDxCaXRtYXBJbWFnZTJEPiByZXNvdXJjZURlcGVuZGVuY3kuYXNzZXRzWzBdO1xuXG5cdFx0dGhpcy5fcEZpbmFsaXplQXNzZXQoPElBc3NldD4gcmVzb3VyY2UsIHJlc291cmNlRGVwZW5kZW5jeS5faUxvYWRlci51cmwpO1xuXG5cdFx0dGhpcy5fbG9hZGVkVGV4dHVyZXMucHVzaCggcmVzb3VyY2UgKTtcblxuXHRcdC8vY29uc29sZS5sb2coICdKU09OVGV4dHVyZVBhcnNlci5faVJlc29sdmVEZXBlbmRlbmN5JyAsIHJlc291cmNlRGVwZW5kZW5jeSApO1xuXHRcdC8vY29uc29sZS5sb2coICdKU09OVGV4dHVyZVBhcnNlci5faVJlc29sdmVEZXBlbmRlbmN5IHJlc291cmNlOiAnICwgcmVzb3VyY2UgKTtcblxuXHRcdHRoaXMuX2RlcGVuZGVuY3lDb3VudC0tO1xuXG5cdFx0aWYgKCB0aGlzLl9kZXBlbmRlbmN5Q291bnQgPT0gMClcblx0XHRcdHRoaXMuX3N0YXRlID0gdGhpcy5TVEFURV9DT01QTEVURTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9pUmVzb2x2ZURlcGVuZGVuY3lGYWlsdXJlKHJlc291cmNlRGVwZW5kZW5jeTpSZXNvdXJjZURlcGVuZGVuY3kpXG5cdHtcblx0XHR0aGlzLl9kZXBlbmRlbmN5Q291bnQtLTtcblxuXHRcdGlmICggdGhpcy5fZGVwZW5kZW5jeUNvdW50ID09IDApXG5cdFx0XHR0aGlzLl9zdGF0ZSA9IHRoaXMuU1RBVEVfQ09NUExFVEU7XG5cdH1cblxuXHRwcml2YXRlIHBhcnNlSnNvbiggKSA6IHZvaWRcblx0e1xuXHRcdGlmIChKU09OVGV4dHVyZVBhcnNlci5zdXBwb3J0c0RhdGEodGhpcy5kYXRhKSkge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0dmFyIGpzb246YW55ID0gSlNPTi5wYXJzZSh0aGlzLmRhdGEpO1xuXHRcdFx0XHR2YXIgZGF0YTpBcnJheTxhbnk+ID0gPEFycmF5PGFueT4+IGpzb24uZGF0YTtcblxuXHRcdFx0XHR2YXIgcmVjOmFueTtcblx0XHRcdFx0dmFyIHJxOlVSTFJlcXVlc3Q7XG5cblx0XHRcdFx0Zm9yICh2YXIgYyA6IG51bWJlciA9IDA7IGMgPCBkYXRhLmxlbmd0aDsgYyArKykge1xuXHRcdFx0XHRcdHJlYyA9IGRhdGFbY107XG5cblx0XHRcdFx0XHR2YXIgdXJpOnN0cmluZyA9IDxzdHJpbmc+IHJlYy5pbWFnZTtcblx0XHRcdFx0XHR2YXIgaWQ6c3RyaW5nID0gPHN0cmluZz4gcmVjLmlkO1xuXG5cdFx0XHRcdFx0cnEgPSBuZXcgVVJMUmVxdWVzdCh1cmkpO1xuXG5cdFx0XHRcdFx0dGhpcy5fcEFkZERlcGVuZGVuY3koJ0pTT05fSURfJyArIGlkLCBycSwgZmFsc2UsIG51bGwsIHRydWUpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5fZGVwZW5kZW5jeUNvdW50ID0gZGF0YS5sZW5ndGg7XG5cdFx0XHRcdHRoaXMuX3N0YXRlID0gdGhpcy5TVEFURV9MT0FEX0lNQUdFUztcblxuXHRcdFx0XHR0aGlzLl9wUGF1c2VBbmRSZXRyaWV2ZURlcGVuZGVuY2llcygpO1xuXG5cdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdHRoaXMuX3N0YXRlID0gdGhpcy5TVEFURV9DT01QTEVURTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgX3BQcm9jZWVkUGFyc2luZygpIDogYm9vbGVhblxuXHR7XG5cdFx0Y29uc29sZS5sb2coICdKU09OVGV4dHVyZVBhcnNlci5fcFByb2NlZWRQYXJzaW5nJyAsIHRoaXMuX3N0YXRlICk7XG5cblx0XHRzd2l0Y2ggKHRoaXMuX3N0YXRlKSB7XG5cdFx0XHRjYXNlIHRoaXMuU1RBVEVfUEFSU0VfREFUQTpcblx0XHRcdFx0dGhpcy5wYXJzZUpzb24oKTtcblx0XHRcdFx0cmV0dXJuIFBhcnNlckJhc2UuTU9SRV9UT19QQVJTRTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIHRoaXMuU1RBVEVfTE9BRF9JTUFHRVM6XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSB0aGlzLlNUQVRFX0NPTVBMRVRFOlxuXHRcdFx0XHRyZXR1cm4gUGFyc2VyQmFzZS5QQVJTSU5HX0RPTkU7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdHJldHVybiBQYXJzZXJCYXNlLk1PUkVfVE9fUEFSU0U7XG5cdH1cbn0iXX0=