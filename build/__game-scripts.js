var ScaleCameraOrthoSize = pc.createScript("scaleCameraOrthoSize");
ScaleCameraOrthoSize.attributes.add("camera", {
    type: "entity"
}), ScaleCameraOrthoSize.attributes.add("refResolution", {
    type: "vec2",
    default: [1960, 1200],
    title: "Reference Resolution",
    description: "Базовое разрешение экрана"
}), ScaleCameraOrthoSize.attributes.add("refOrthoSize", {
    type: "number",
    default: 5,
    title: "Reference Ortho Size",
    description: "Ортографический размер для базового разрешения"
}), ScaleCameraOrthoSize.prototype.initialize = function () {
    this.prevWidth = this.app.graphicsDevice.width, this.prevHeight = this.app.graphicsDevice.height, this.updateOrthoSize()
}, ScaleCameraOrthoSize.prototype.update = function () {
    var e = this.app.graphicsDevice.width,
        t = this.app.graphicsDevice.height;
    e === this.prevWidth && t === this.prevHeight || (this.prevWidth = e, this.prevHeight = t, this.updateOrthoSize())
}, ScaleCameraOrthoSize.prototype.updateOrthoSize = function () {
    var e = this.refResolution.x / this.refResolution.y,
        t = this.app.graphicsDevice.width / this.app.graphicsDevice.height;
    this.camera.camera.orthoHeight = t > e ? this.refOrthoSize : this.refOrthoSize * (e / t)
};
var Loader = pc.createScript("loader");
Loader.attributes.add("btnMob", {
    type: "entity"
}), Loader.attributes.add("btnDesk", {
    type: "entity"
}), Loader.attributes.add("buildNumber", {
    type: "number"
}), Loader.prototype.initialize = function () {
    this.start()
}, Loader.prototype.initializeStart = function () {
    this.isMobile() ? this.btnMob.element.on("click", this.start, this) : this.btnDesk.element.on("click", this.start, this)
}, Loader.prototype.start = function () {
    this.isMobile() ? this.loadScene("GameScene_Mobile") : this.loadScene("GameScene_Desktop")
}, Loader.prototype.isMobile = function () {
    return !!pc.platform.mobile
}, Loader.prototype.loadScene = function (t) {
    this.app.scenes.changeScene(t)
};
var SaveSystem = pc.createScript("saveSystem");
SaveSystem.instance = null, SaveSystem.prototype.data = {
    coins: 0,
    level: 1,
    items: [],
    logs: null
}, SaveSystem.prototype.storageKey = "myGameSave", SaveSystem.getInstance = function () {
    if (!SaveSystem.instance) {
        console.warn("SaveSystem instance not found. Creating new one.");
        var e = new pc.Entity("SaveSystem");
        e.addComponent("script"), e.script.create("saveSystem"), pc.app.root.addChild(e)
    }
    return SaveSystem.instance
}, SaveSystem.prototype.initialize = function () {
    if (SaveSystem.instance) return console.warn("SaveSystem already exists"), void this.entity.destroy();
    SaveSystem.instance = this, this.load(), this.entity.reparent(null), window.addEventListener("beforeunload", this.save.bind(this))
}, SaveSystem.prototype.update = function (e) {
    this.saveTimer || (this.saveTimer = 0), this.saveTimer += e, this.saveTimer >= 5 && (this.save(), this.saveTimer = 0)
}, SaveSystem.prototype.save = function () {
    try {
        var e = JSON.stringify(this.data);
        localStorage.setItem(this.storageKey, e)
    } catch (e) {
        console.error("Failed to save:", e)
    }
}, SaveSystem.prototype.load = function () {
    try {
        var e = localStorage.getItem(this.storageKey);
        e && (this.data = JSON.parse(e), console.log("[SaveSystem] Loaded:", this.data))
    } catch (e) {
        console.error("Failed to load:", e)
    }
};
var ScaleRectByScreenWidth = pc.createScript("scaleRectByScreenWidth");
ScaleRectByScreenWidth.attributes.add("scaleFactor", {
    type: "number",
    default: 1,
    title: "Scale Factor",
    description: "Коэффициент масштабирования (от 0 до 1)"
}), ScaleRectByScreenWidth.attributes.add("refResolution", {
    type: "vec2",
    default: [1920, 1080],
    title: "Reference Resolution",
    description: "Базовое разрешение экрана"
}), ScaleRectByScreenWidth.attributes.add("targetRects", {
    type: "entity",
    array: !0,
    title: "Target Rects",
    description: "Список целевых объектов для масштабирования"
}), ScaleRectByScreenWidth.prototype.initialize = function () {
    this.initScales = [];
    for (var t = 0; t < this.targetRects.length; t++) {
        var e = this.targetRects[t];
        e && (this.initScales[t] = e.getLocalScale().clone())
    }
    this.lastWidth = this.app.graphicsDevice.width, this.lastHeight = this.app.graphicsDevice.height, this.updateScale()
}, ScaleRectByScreenWidth.prototype.update = function () {
    var t = this.app.graphicsDevice.width,
        e = this.app.graphicsDevice.height;
    t === this.lastWidth && e === this.lastHeight || (this.lastWidth = t, this.lastHeight = e, this.updateScale())
}, ScaleRectByScreenWidth.prototype.updateScale = function () {
    var t = this.app.graphicsDevice.width,
        e = this.app.graphicsDevice.height;
    if (0 !== t && 0 !== e)
        for (var i = this.refResolution.x / this.refResolution.y, a = t / e, c = pc.math.lerp(1, a / i, this.scaleFactor), s = 0; s < this.targetRects.length; s++) {
            var h = this.targetRects[s];
            if (h) {
                var r = this.initScales[s];
                h.setLocalScale(r.x * c, r.y * c, r.z)
            }
        } else this.app.once("postupdate", this.updateScale, this)
};
var Logger = pc.createScript("logger");
Logger.instance = null, Logger.getInstance = function () {
    if (!Logger.instance) {
        console.warn("Logger instance not found. Creating new one.");
        var e = new pc.Entity("Logger");
        e.addComponent("script"), e.script.create("logger"), pc.app.root.addChild(e)
    }
    return Logger.instance
}, Logger.prototype.initialize = function () {
    if (Logger.instance) return console.warn("Logger already exists"), void this.entity.destroy();
    Logger.instance = this, this.entity.reparent(null), this.exitLogs = {
        type: "Exit",
        points: 50,
        countFindPair: 0,
        time: 0,
        startDate: 0
    }, this.lose = {
        type: "Lose",
        points: 50,
        countFindPair: 0,
        time: 0,
        startDate: 0
    }, this.exitLogs.startDate = new Date, this.lose.startDate = new Date, this.gameCompletedStats = {
        type: "GameCompleted",
        points: 500,
        time: 0,
        startDate: 0
    }, this.gameCompletedStats.startDate = new Date, window.addEventListener("beforeunload", this.exitGame.bind(this))
}, Logger.prototype.exitGame = function () {
    this.exitLogs.countFindPair = LevelManager.instance.currentLevel, this.exitLogs.time = ProgressBar.instance.getElapsedTime(), this.showLogs(this.exitLogs)
}, Logger.prototype.loseGame = function () {
    this.lose.countFindPair = LevelManager.instance.currentLevel, this.lose.time = ProgressBar.instance.getElapsedTime(), this.showLogs(this.lose)
}, Logger.prototype.completedGame = function () {
    this.gameCompletedStats.time = ProgressBar.instance.getElapsedTime(), this.showLogs(this.gameCompletedStats)
}, Logger.prototype.showLogs = function (e) {
    console.log(JSON.parse(JSON.stringify(e)))
};
var Test = pc.createScript("test");
Test.prototype.initialize = function () {
    console.log(SaveSystem.getInstance().data.coins)
}, Test.prototype.update = function (t) { };
var PairGenerator = pc.createScript("pairGenerator");
PairGenerator.attributes.add("cells", {
    type: "entity",
    array: !0
}), PairGenerator.attributes.add("sprites", {
    type: "asset",
    assetType: "sprite",
    array: !0
}), PairGenerator.prototype.initialize = function () {
    if (20 !== this.cells.length || 10 !== this.sprites.length) return void console.error("Нужно 20 ячеек и 10 спрайтов");
    const e = this.shuffleArray(this.sprites.slice());
    for (let t = 0; t < 10; t++) {
        const r = e[t].resource,
            s = this.cells[2 * t],
            i = this.cells[2 * t + 1];
        s.script.cell.setSprite(r), i.script.cell.setSprite(r), s.script.cell.level = t, i.script.cell.level = t
    }
}, PairGenerator.prototype.shuffleArray = function (e) {
    for (let t = e.length - 1; t > 0; t--) {
        const r = Math.floor(Math.random() * (t + 1));
        [e[t], e[r]] = [e[r], e[t]]
    }
    return e
};
var Cell = pc.createScript("cell");
Cell.attributes.add("spriteObj", {
    type: "entity"
}), Cell.prototype.initialize = function () {
    this.level = 0, this.clicked = !0
}, Cell.prototype.setSprite = function (t) {
    this.spriteObj.sprite.sprite = t
}, Cell.prototype.hide = function () {
    this.clicked = !1, this.entity.script.scalePingPong.stop(), this.entity.script.fadeOut.startFade()
}, Cell.prototype.scale = function () {
    this.entity.script.scalePingPong.play(), this.clicked = !1
}, Cell.prototype.shake = function () {
    this.entity.script.scalePingPong.stop(), this.entity.script.shakeOnSpaceScene.startAnim(), this.clicked = !0
}, Cell.prototype.show = function () {
    this.entity.enabled = !0, this.clicked = !0
};
var LevelManager = pc.createScript("levelManager");
LevelManager.instance = null, LevelManager.prototype.initialize = function () {
    if (LevelManager.instance) return console.warn("LevelManager already exists"), void this.entity.destroy();
    LevelManager.instance = this, this.currentLevel = 0, this.firstClickedCell = null, this.completed = !1, this.camera = this.app.root.findByName("Camera"), this.nextCount = 0, this.btn = this.app.root.findByName("Btn"), this.btn && this.btn.element.on("click", function () { console.log("Click") }), this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.handleClick, this)
}, LevelManager.prototype.handleClick = function (e) {
    if (this.completed) return;
    const t = this.camera.camera.screenToWorld(e.x, e.y, this.camera.camera.nearClip),
        i = this.camera.camera.screenToWorld(e.x, e.y, this.camera.camera.farClip),
        l = this.app.systems.rigidbody.raycastFirst(t, i);
    if (!l || !l.entity) return;
    const r = l.entity.script && l.entity.script.cell ? l.entity : l.entity.parent && l.entity.parent.script && l.entity.parent.script.cell ? l.entity.parent : null;
    if (!r) return;
    const n = r.script.cell;
    if (n.clicked)
        if (n.level === this.currentLevel) n.scale(), this.firstClickedCell ? (n.hide(), this.firstClickedCell.hide(), this.firstClickedCell = null, this.currentLevel++, this.nextCount >= 1 && this.currentLevel >= 5 && (this.currentLevel = 0, this.nextCount++), this.currentLevel >= 10 && (this.currentLevel = 0, this.nextCount++), this.nextCount >= 2 && (Logger.getInstance().completedGame(), ProgressBar.instance.isRunning = !1)) : this.firstClickedCell = n;
        else {
            if (this.firstClickedCell) {
                if (this.firstClickedCell.level === n.level) return;
                this.firstClickedCell.shake(), this.firstClickedCell = null
            }
            n.shake()
        }
};

var ShakeOnSpaceScene = pc.createScript("shakeOnSpaceScene");
ShakeOnSpaceScene.prototype.initialize = function () {
    this.originalPos = this.entity.getLocalPosition().clone(), this.shakeDuration = 0
}, ShakeOnSpaceScene.prototype.startAnim = function () {
    this.shakeDuration = .3
}, ShakeOnSpaceScene.prototype.update = function (t) {
    if (this.shakeDuration > 0) {
        this.shakeDuration -= t;
        const i = .1,
            e = (Math.random() - .5) * i,
            n = (Math.random() - .5) * i,
            a = (Math.random() - .5) * i;
        this.entity.setLocalPosition(this.originalPos.x + e, this.originalPos.y + n, this.originalPos.z + a)
    } else this.entity.setLocalPosition(this.originalPos)
};
var ScalePingPong = pc.createScript("scalePingPong");
ScalePingPong.attributes.add("minScale", {
    type: "vec3",
    default: [1, 1, 1]
}), ScalePingPong.attributes.add("maxScale", {
    type: "vec3",
    default: [1.3, 1.3, 1.3]
}), ScalePingPong.attributes.add("speed", {
    type: "number",
    default: 1
}), ScalePingPong.prototype.initialize = function () {
    this.time = 0, this.isPlaying = !1
}, ScalePingPong.prototype.update = function (t) {
    if (this.isPlaying) {
        this.time += t * this.speed;
        var i = .5 * (1 + Math.sin(this.time * Math.PI * 2)),
            e = (new pc.Vec3).lerp(this.minScale, this.maxScale, i);
        this.entity.setLocalScale(e)
    }
}, ScalePingPong.prototype.play = function () {
    this.isPlaying = !0, this.time = 0
}, ScalePingPong.prototype.stop = function () {
    this.isPlaying = !1, this.entity.setLocalScale(this.minScale)
};
var ProgressBar = pc.createScript("progressBar");
ProgressBar.attributes.add("timerText", {
    type: "entity"
}), ProgressBar.instance = null, ProgressBar.prototype.initialize = function () {
    ProgressBar.instance ? this.entity.destroy() : (ProgressBar.instance = this, this.fillTime = 30, this.remainingTime = this.fillTime, this.isRunning = !0, this.updateTimerText(this.remainingTime))
}, ProgressBar.prototype.getRemainingTime = function () {
    return Math.max(0, Math.ceil(this.remainingTime))
}, ProgressBar.prototype.getElapsedTime = function () {
    return Math.min(this.fillTime, Math.floor(this.fillTime - this.remainingTime))
}, ProgressBar.prototype.updateTimerText = function (e) {
    var i = Math.ceil(e),
        t = Math.floor(i / 60),
        r = (t < 10 ? "0" + t : t) + ":" + ((i %= 60) < 10 ? "0" + i : i);
    this.timerText && this.timerText.element && (this.timerText.element.text = r)
}, ProgressBar.prototype.update = function (e) {
    this.isRunning && (this.remainingTime -= e, this.remainingTime <= 0 && (this.timerText.element.text = "00:00", this.remainingTime = 0, this.isRunning = !1, LevelManager.instance.completed = !0, Uimanager.instance.game.enabled = !1, Uimanager.instance.lose.enabled = !0, Logger.instance.loseGame()), this.updateTimerText(this.remainingTime))
};
var FadeOut = pc.createScript("fadeOut");
FadeOut.attributes.add("fadeSpeed", {
    type: "number",
    default: 3,
    title: "Fade Speed"
}), FadeOut.prototype.initialize = function () {
    this.opacity = 1, this.fading = !1, this.spriteComp = this.entity.script.cell.spriteObj, this.spriteComp.sprite.opacity = this.opacity
}, FadeOut.prototype.startFade = function () {
    this.fading = !0
}, FadeOut.prototype.update = function (t) {
    this.fading && (this.opacity > 0 ? (this.opacity -= this.fadeSpeed * t, this.opacity = Math.max(this.opacity, 0), this.spriteComp.sprite.opacity = this.opacity) : this.entity.enabled = !1)
};
pc.script.createLoadingScreen((function (t) {
    ! function () {
        for (var t = ["* { box-sizing: border-box; padding: 0; margin: 0; }", "html, body {", "    width: 100%; height: 100%; margin: 0; padding: 0;", "    background-color: #ffffff;", "}", "#application-splash-wrapper {", "    position: fixed;", "    top: 0; left: 0;", "    width: 100vw; height: 100vh;", "    display: flex; align-items: center; justify-content: center;", "    background-color: #ffffff;", "}", "#application-splash {", "    width: 50vw; height: 50vw;", "    max-width: 600px; max-height: 600px;", "    position: relative;", "}", ".rotating-container {", "    width: 100%; height: 100%;", "    position: relative;", "    animation: rotate 5s linear infinite;", "}", ".rotating-square {", "    position: absolute;", "    width: 10vw; height: 10vw;", "    max-width: 120px; max-height: 120px;", "    border-radius: 16px;", "    opacity: 0.9;", "    transform: translate(-50%, -50%);", "}"], e = 0; e < 8; e++) {
            var a = 360 * e / 8 * Math.PI / 180,
                i = 50 + 40 * Math.cos(a),
                n = 50 + 40 * Math.sin(a);
            t.push(".square" + e + " { top: " + n + "%; left: " + i + "%; }")
        }
        t.push("@keyframes rotate {", "    0% { transform: rotate(0deg); }", "    100% { transform: rotate(360deg); }", "}");
        var o = t.join("\n"),
            r = document.createElement("style");
        r.type = "text/css", r.appendChild(document.createTextNode(o)), document.head.appendChild(r)
    }(),
        function () {
            var t = document.createElement("div");
            t.id = "application-splash-wrapper", t.style.backgroundColor = "#ffffff", document.body.appendChild(t);
            var e = document.createElement("div");
            e.id = "application-splash", t.appendChild(e);
            var a = document.createElement("div");
            a.className = "rotating-container", e.appendChild(a);
            for (var i = 0; i < 8; i++) {
                var n = document.createElement("div");
                n.className = "rotating-square square" + i, n.style.backgroundColor = "#" + Math.floor(16777215 * Math.random()).toString(16).padStart(6, "0"), a.appendChild(n)
            }
        }(), t.on("start", (function () {
            var t = document.getElementById("application-splash-wrapper");
            t && t.remove()
        }))
}));
var Uimanager = pc.createScript("uimanager");
Uimanager.instance = null, Uimanager.attributes.add("game", {
    type: "entity"
}), Uimanager.attributes.add("lose", {
    type: "entity"
}), Uimanager.prototype.initialize = function () {
    Uimanager.instance ? this.entity.destroy() : Uimanager.instance = this
}, Uimanager.prototype.update = function (a) { };
var ScaleRectByscreenWidthOld = pc.createScript("scaleRectByscreenWidthOld");
ScaleRectByscreenWidthOld.attributes.add("scaleFactor", {
    type: "number",
    default: 1,
    title: "Scale Factor",
    description: "Коэффициент масштабирования (от 0 до 1)"
}), ScaleRectByscreenWidthOld.attributes.add("refResolution", {
    type: "vec2",
    default: [1920, 1080],
    title: "Reference Resolution",
    description: "Базовое разрешение экрана"
}), ScaleRectByscreenWidthOld.attributes.add("targetRects", {
    type: "entity",
    array: !0,
    title: "Target Rects",
    description: "Список целевых объектов для масштабирования"
}), ScaleRectByscreenWidthOld.prototype.initialize = function () {
    this.initScales = [];
    for (var t = 0; t < this.targetRects.length; t++) {
        var e = this.targetRects[t];
        e && (this.initScales[t] = e.getLocalScale().clone())
    }
    this.lastWidth = this.app.graphicsDevice.width, this.lastHeight = this.app.graphicsDevice.height, this.updateScale()
}, ScaleRectByscreenWidthOld.prototype.update = function () {
    var t = this.app.graphicsDevice.width,
        e = this.app.graphicsDevice.height;
    t === this.lastWidth && e === this.lastHeight || (this.lastWidth = t, this.lastHeight = e, this.updateScale())
}, ScaleRectByscreenWidthOld.prototype.updateScale = function () {
    var t = this.app.graphicsDevice.width,
        e = this.app.graphicsDevice.height;
    if (0 !== t && 0 !== e) {
        var i = this.refResolution.x / this.refResolution.y,
            a = t / e;
        if (a < i)
            for (var s = pc.math.lerp(1, a / i, this.scaleFactor), c = 0; c < this.targetRects.length; c++) {
                if (l = this.targetRects[c]) {
                    var h = this.initScales[c];
                    l.setLocalScale(h.x * s, h.y * s, h.z)
                }
            } else
            for (c = 0; c < this.targetRects.length; c++) {
                var l;
                if (l = this.targetRects[c]) {
                    h = this.initScales[c];
                    l.setLocalScale(h.x, h.y, h.z)
                }
            }
    } else this.app.once("postupdate", this.updateScale, this)
};