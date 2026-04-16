// GLB Model and Sound Loader
const MODEL_FILES = {
    character: 'assets/models/character.glb',
    coin: 'assets/models/coin.glb',
    brick: 'assets/models/brick.glb',
    flag: 'assets/models/flag.glb',
    cloud: 'assets/models/cloud.glb',
    platform: 'assets/models/platform.glb',
    grass: 'assets/models/grass.glb',
    grassSmall: 'assets/models/grass-small.glb'
};

const SOUND_FILES = {
    coin: 'assets/sounds/coin.ogg',
    jump: 'assets/sounds/jump.ogg',
    break: 'assets/sounds/break.ogg'
};

export const loadedModels = {};
export const loadedSounds = {};

export function loadAllAssets(app, onComplete) {
    const allKeys = [...Object.keys(MODEL_FILES), ...Object.keys(SOUND_FILES)];
    let loaded = 0;
    const total = allKeys.length;
    const loadText = document.getElementById('loadText');

    function updateProgress(name) {
        loaded++;
        loadText.textContent = `${name} yuklendi (${loaded}/${total})`;
        if (loaded >= total) onComplete();
    }

    // Load models
    Object.entries(MODEL_FILES).forEach(([name, url]) => {
        const asset = new pc.Asset(name, 'container', { url });
        app.assets.add(asset);
        app.assets.load(asset);
        asset.ready(() => {
            loadedModels[name] = asset;
            updateProgress(name);
        });
        asset.on('error', () => updateProgress(name));
    });

    // Load sounds
    Object.entries(SOUND_FILES).forEach(([name, url]) => {
        const asset = new pc.Asset(name, 'audio', { url: url });
        app.assets.add(asset);
        app.assets.load(asset);
        asset.ready(() => {
            loadedSounds[name] = asset;
            updateProgress(name);
        });
        asset.on('error', () => updateProgress(name));
    });
}

export function cloneModel(app, name) {
    const asset = loadedModels[name];
    if (!asset || !asset.resource) return null;
    const entity = asset.resource.instantiateRenderEntity();
    return entity;
}
