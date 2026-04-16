import { LETTERS } from './game.js';

export function createLetters(app, startIdx, count, mapSize) {
    const pc = window.pc;
    const entities = [];
    const margin = mapSize * 0.3;

    for (let i = 0; i < count; i++) {
        const idx = startIdx + i;
        if (idx >= LETTERS.length) break;

        const e = new pc.Entity();
        e.addComponent('model', { type: 'cylinder' });
        e.setLocalScale(0.8, 0.1, 0.8);
        const mat = new pc.StandardMaterial();
        mat.diffuse.set(1, 0.84, 0);
        mat.emissive.set(0.5, 0.4, 0);
        mat.update();
        e.model.material = mat;

        const x = (Math.random() - 0.5) * margin * 2;
        const z = (Math.random() - 0.5) * margin * 2;
        e.setPosition(x, 1.5, z);

        // Glow light
        const lt = new pc.Entity();
        lt.addComponent('light', { type: 'point', color: new pc.Color(1, 0.84, 0), intensity: 0.3, range: 5 });
        lt.setPosition(0, 1, 0);
        e.addChild(lt);

        e.userData = { li: idx, fo: Math.random() * 6.28, col: false, baseY: 1.5 };
        app.root.addChild(e);
        entities.push(e);
    }
    return entities;
}

export function collectLetter(entity) {
    entity.userData.col = true;
    entity.enabled = false;
    return { idx: entity.userData.li, letter: LETTERS[entity.userData.li] };
}
