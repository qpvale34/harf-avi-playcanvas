import * as pc from 'playcanvas';
import { GameState } from './src/game.js';
import { loadAllAssets } from './src/assets.js';
import { setupUI } from './src/ui.js';

// Load nipplejs
const ns = document.createElement('script');
ns.src = 'https://cdn.jsdelivr.net/npm/nipplejs@0.10.1/dist/nipplejs.min.js';
document.head.appendChild(ns);

const canvas = document.getElementById('application-canvas');
const app = new pc.Application(canvas, {
    mouse: new pc.Mouse(canvas),
    touch: new pc.TouchDevice(canvas),
    keyboard: new pc.Keyboard(window)
});
app.setCanvasResolution(pc.RESOLUTION_AUTO);
app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
app.start();

window.pc = pc;
window.app = app;
window.gameState = new GameState(app);

// Joystick setup after nipplejs loads
ns.onload = () => {
    const zone = document.getElementById('joystickZone');
    if (zone && window.nipplejs) {
        const joy = window.nipplejs.create({
            zone: zone, mode: 'static',
            position: { left: '70px', bottom: '70px' },
            color: '#f5a623', size: 100, restOpacity: 0.5
        });
        joy.on('move', (e, d) => {
            if (!d.direction) return;
            const a = d.angle.radian, f = Math.min(d.force, 2) / 2;
            window.gameState.moveDir.x = Math.cos(a) * f;
            window.gameState.moveDir.y = Math.sin(a) * f;
        });
        joy.on('end', () => { window.gameState.moveDir.x = 0; window.gameState.moveDir.y = 0; });
    }
};

loadAllAssets(app, () => {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('lobby').style.display = 'flex';
    setupUI();
});

app.on('update', (dt) => window.gameState.update(dt));
