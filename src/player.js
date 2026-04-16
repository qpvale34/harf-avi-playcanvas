import { cloneModel } from './assets.js';

const COLORS = [[0.91,0.27,0.38],[0.4,0.49,0.92],[0.59,0.79,0.24],[0.96,0.65,0.14]];
const HAT_COLORS = [[0.2,0.2,0.2],[0.4,0.2,0],[1,0.84,0],[0.8,0,0]];

export function createPlayer(app, charIdx) {
    const pc = window.pc;
    const e = new pc.Entity();
    e.addComponent('model', { type: 'capsule' });
    e.setLocalScale(0.6, 1, 0.6);
    e.setPosition(0, 1, 0);
    const mat = new pc.StandardMaterial();
    mat.diffuse.set(COLORS[charIdx][0], COLORS[charIdx][1], COLORS[charIdx][2]);
    mat.update();
    e.model.material = mat;

    // Head
    const head = new pc.Entity();
    head.addComponent('model', { type: 'sphere' });
    head.setLocalScale(0.5, 0.5, 0.5);
    head.setPosition(0, 1.2, 0);
    const hm = new pc.StandardMaterial();
    hm.diffuse.set(1, 0.86, 0.74); hm.update();
    head.model.material = hm;
    e.addChild(head);

    // Eyes
    [-0.12, 0.12].forEach(x => {
        const eye = new pc.Entity();
        eye.addComponent('model', { type: 'sphere' });
        eye.setLocalScale(0.12, 0.12, 0.05);
        eye.setPosition(x, 1.3, 0.22);
        const em = new pc.StandardMaterial();
        em.diffuse.set(0.1, 0.1, 0.1); em.update();
        eye.model.material = em;
        e.addChild(eye);
    });

    // Hat
    const hat = new pc.Entity();
    hat.addComponent('model', { type: 'cylinder' });
    hat.setLocalScale(0.4, 0.15, 0.4);
    hat.setPosition(0, 1.55, 0);
    const hcm = new pc.StandardMaterial();
    hcm.diffuse.set(HAT_COLORS[charIdx][0], HAT_COLORS[charIdx][1], HAT_COLORS[charIdx][2]);
    hcm.update();
    hat.model.material = hcm;
    e.addChild(hat);

    app.root.addChild(e);

    // Store camera ref
    const cam = app.root.findByTag('camera')[0];
    if (cam) app.root._camera = cam;

    return e;
}

export function updatePlayer(player, moveDir, dt, mapSize) {
    const pp = player.getPosition();
    const speed = 8;
    const half = mapSize / 2 - 1;
    let dx = moveDir.x, dy = moveDir.y;

    if (dx || dy) {
        const len = Math.sqrt(dx * dx + dy * dy);
        dx = dx / len * speed * dt;
        dy = dy / len * speed * dt;
        const nx = Math.max(-half, Math.min(half, pp.x + dx));
        const nz = Math.max(-half, Math.min(half, pp.z - dy));
        player.setPosition(nx, pp.y, nz);
        player.setEulerAngles(0, Math.atan2(dx, -dy) * 180 / Math.PI, 0);
    }
}
