pc.script.createLoadingScreen(function (app) {
    var appWrapper = document.getElementById('playcanvas-wrapper');
    var showSplash = function () {
        var wrapper = document.createElement('div');
        wrapper.id = 'application-splash-wrapper';
        wrapper.style.backgroundColor = '#ffffff';

        appWrapper.appendChild(wrapper);

        var splash = document.createElement('div');
        splash.id = 'application-splash';
        wrapper.appendChild(splash);

        var rotatingContainer = document.createElement('div');
        rotatingContainer.className = 'rotating-container';
        splash.appendChild(rotatingContainer);

        // Функция генерации случайного цвета в формате hex
        function getRandomColor() {
            return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        }

        for (var i = 0; i < 8; i++) {
            var square = document.createElement('div');
            square.className = 'rotating-square square' + i;
            square.style.backgroundColor = getRandomColor();
            rotatingContainer.appendChild(square);
        }
    };

    var hideSplash = function () {
        var splash = document.getElementById('application-splash-wrapper');
        if (splash) splash.remove();
    };

    var createCss = function () {
        var cssParts = [
            '* { box-sizing: border-box; padding: 0; margin: 0; }',
            'html, body {',
            '    width: 100%; height: 100%; margin: 0; padding: 0;',
            '    background-color: #ffffff;',
            '}',
            '#application-splash-wrapper {',
            '    position: absolute;', // вместо fixed
            '    top: 0; left: 0;',
            '    width: 100%; height: 100%;',
            '    display: flex; align-items: center; justify-content: center;',
            '    background-color: #ffffff;',
            '}',
            '#application-splash {',
            '    width: 100%; height: 100%;',
            '    position: relative;',
            '}',
            '.rotating-container {',
            '    width: 100%; height: 100%;',
            '    position: relative;',
            '    animation: rotate 5s linear infinite;',
            '}',
            '.rotating-square {',
            '    position: absolute;',
            '    width: 10vw; height: 10vw;',
            '    max-width: 120px; max-height: 120px;',
            '    border-radius: 16px;',
            // Убрана анимация яркости, чтобы не было затухания
            '    opacity: 0.9;',
            '    transform: translate(-50%, -50%);',
            '}',
        ];

        var centerX = 50;
        var centerY = 50;
        var radius = 40;

        for (var i = 0; i < 8; i++) {
            var angle = (i * 360 / 8) * Math.PI / 180;
            var x = centerX + radius * Math.cos(angle);
            var y = centerY + radius * Math.sin(angle);
            cssParts.push('.square' + i + ' { top: ' + y + '%; left: ' + x + '%; }');
        }

        cssParts.push(
            '@keyframes rotate {',
            '    0% { transform: rotate(0deg); }',
            '    100% { transform: rotate(360deg); }',
            '}'
        );

        var css = cssParts.join('\n');
        var style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    };

    createCss();
    showSplash();

    app.on('start', hideSplash);
});
