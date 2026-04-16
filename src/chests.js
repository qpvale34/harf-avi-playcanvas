export function createChests(app, count, mapSize) {
    const pc = window.pc;
    const entities = [];

    for (let i = 0; i < count; i++) {
        const angle = Math.random() * 6.28;
        const radius = Math.random() * 15 + 5;
        const e = new pc.Entity();
        e.addComponent('model', { type: 'box' });
        e.setLocalScale(1.2, 0.8, 0.8);
        e.setPosition(Math.cos(angle) * radius, 0.4, Math.sin(angle) * radius);
        const mat = new pc.StandardMaterial();
        mat.diffuse.set(0.54, 0.27, 0.07); mat.update();
        e.model.material = mat;

        // Gold trim
        const trim = new pc.Entity();
        trim.addComponent('model', { type: 'box' });
        trim.setLocalScale(1.22, 0.1, 0.82);
        trim.setPosition(0, 0.35, 0);
        const tm = new pc.StandardMaterial();
        tm.diffuse.set(1, 0.84, 0); tm.emissive.set(0.5, 0.4, 0); tm.update();
        trim.model.material = tm;
        e.addChild(trim);

        // Glow
        const lt = new pc.Entity();
        lt.addComponent('light', { type: 'point', color: new pc.Color(1, 0.84, 0), intensity: 0.4, range: 6 });
        lt.setPosition(0, 1.5, 0);
        e.addChild(lt);

        e.userData = { isChest: true, opened: false };
        app.root.addChild(e);
        entities.push(e);
    }
    return entities;
}
