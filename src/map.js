export function createMap(app, size) {
    const pc = window.pc;

    // Lights
    const lt1 = new pc.Entity();
    lt1.addComponent('light', { type: 'directional', color: new pc.Color(1,1,1), intensity: 1 });
    lt1.setEulerAngles(45, 30, 0);
    app.root.addChild(lt1);

    const lt2 = new pc.Entity();
    lt2.addComponent('light', { type: 'directional', color: new pc.Color(0.6,0.6,0.8), intensity: 0.4 });
    lt2.setEulerAngles(-45, -30, 0);
    app.root.addChild(lt2);

    // Camera
    const camera = new pc.Entity('camera');
    camera.addComponent('camera', { clearColor: new pc.Color(0.53,0.81,0.92), fov: 55 });
    camera.setPosition(0, 25, 20);
    camera.lookAt(0, 0, 0);
    camera.addTag('camera');
    app.root.addChild(camera);
    app.root._camera = camera;

    // Ground
    const ground = new pc.Entity();
    ground.addComponent('model', { type: 'plane' });
    ground.setLocalScale(size, 1, size);
    const gm = new pc.StandardMaterial();
    gm.diffuse.set(0.3, 0.5, 0.25); gm.update();
    ground.model.material = gm;
    app.root.addChild(ground);

    // Walls
    const wm = new pc.StandardMaterial();
    wm.diffuse.set(0.45, 0.35, 0.25); wm.update();
    const h = size / 2;
    [[0,2,-h,size,4,1],[0,2,h,size,4,1],[-h,2,0,1,4,size],[h,2,0,1,4,size]].forEach(w => {
        const wall = new pc.Entity();
        wall.addComponent('model', { type: 'box' });
        wall.setLocalScale(w[3], w[4], w[5]);
        wall.setPosition(w[0], w[1], w[2]);
        wall.model.material = wm;
        app.root.addChild(wall);
    });

    // Trees
    for (let i = 0; i < 10; i++) {
        const angle = Math.random() * 6.28;
        const radius = size * 0.35;
        const x = Math.cos(angle) * radius, z = Math.sin(angle) * radius;

        const trunk = new pc.Entity();
        trunk.addComponent('model', { type: 'cylinder' });
        trunk.setLocalScale(0.3, 2, 0.3);
        trunk.setPosition(x, 1, z);
        const tm = new pc.StandardMaterial();
        tm.diffuse.set(0.54, 0.27, 0.07); tm.update();
        trunk.model.material = tm;
        app.root.addChild(trunk);

        const leaf = new pc.Entity();
        leaf.addComponent('model', { type: 'cone' });
        leaf.setLocalScale(1.5, 1.5, 1.5);
        leaf.setPosition(x, 2.5, z);
        const lm = new pc.StandardMaterial();
        lm.diffuse.set(0.13, 0.55, 0.13); lm.update();
        leaf.model.material = lm;
        app.root.addChild(leaf);
    }

    // Rocks
    for (let i = 0; i < 6; i++) {
        const angle = Math.random() * 6.28;
        const radius = Math.random() * size * 0.3;
        const rock = new pc.Entity();
        rock.addComponent('model', { type: 'sphere' });
        const s = 0.5 + Math.random() * 0.5;
        rock.setLocalScale(s, s * 0.6, s);
        rock.setPosition(Math.cos(angle) * radius, 0.3, Math.sin(angle) * radius);
        const rm = new pc.StandardMaterial();
        rm.diffuse.set(0.5, 0.5, 0.5); rm.update();
        rock.model.material = rm;
        app.root.addChild(rock);
    }
}
