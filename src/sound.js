import { loadedSounds } from './assets.js';

export function playSound(name) {
    const asset = loadedSounds[name];
    if (asset && asset.resource) {
        try {
            const sound = asset.resource;
            const ctx = window.audioContext || (window.audioContext = new (window.AudioContext || window.webkitAudioContext)());
            // PlayCanvas audio - simple fallback using HTML5 Audio
            const audio = new Audio(asset.file.url);
            audio.volume = 0.5;
            audio.play().catch(() => {});
        } catch (e) {}
    }
}
