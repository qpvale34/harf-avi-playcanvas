import { createPlayer, updatePlayer } from './player.js';
import { createLetters, collectLetter } from './letters.js';
import { createChests, openChest } from './chests.js';
import { createMap } from './map.js';
import { updateHUD, showLetterInfo, showChestInfo, showPortal, showGameOver, hideAllPopups } from './ui.js';
import { playSound } from './sound.js';

export const LETTERS = [
    ["\u0627","Elif","a","Ilk harf, uzun a sesi"],
    ["\u0628","Be","b","B sesi verir"],
    ["\u062a","Te","t","T sesi verir"],
    ["\u062b","Se","s","Dil ucuyla S sesi"],
    ["\u062c","Cim","c","C sesi verir"],
    ["\u062d","Ha","h","Bogazdan H sesi"],
    ["\u062e","Hi","h","Hiriltiyla H sesi"],
    ["\u062f","Dal","d","D sesi verir"],
    ["\u0630","Zel","z","Dil ucuyla Z sesi"],
    ["\u0631","Re","r","R sesi verir"],
    ["\u0632","Ze","z","Z sesi verir"],
    ["\u0633","Sin","s","S sesi verir"],
    ["\u0634","Sin","\u015f","\u015f sesi verir"],
    ["\u0635","Sad","s","Kalin S sesi"],
    ["\u0636","Dad","d","Kalin D sesi"],
    ["\u0637","Ta","t","Kalin T sesi"],
    ["\u0638","Za","z","Kalin Z sesi"],
    ["\u0639","Ayn","a","Bogazdan A sesi"],
    ["\u063a","Gayn","g","G/H karisimi"],
    ["\u0641","Fe","f","F sesi verir"],
    ["\u0642","Kaf","k","Kalin K sesi"],
    ["\u0643","Kef","k","K sesi verir"],
    ["\u0644","Lam","l","L sesi verir"],
    ["\u0645","Mim","m","M sesi verir"],
    ["\u0646","Nun","n","N sesi verir"],
    ["\u0647","He","h","H sesi verir"],
    ["\u0648","Vav","v","V veya U sesi"],
    ["\u064a","Ye","y","Y veya I sesi"]
];

export class GameState {
    constructor(app) {
        this.app = app;
        this.player = null;
        this.letterEntities = [];
        this.chestEntities = [];
        this.portalEntity = null;
        this.collected = new Set();
        this.gold = 0;
        this.currentMap = 1;
        this.gameActive = false;
        this.selectedChar = 0;
        this.startTime = 0;
        this.moveDir = { x: 0, y: 0 };
        this.waitingForClose = false;
    }

    startGame(playerName) {
        this.clearScene();
        this.collected = new Set();
        this.gold = 0;
        this.currentMap = 1;
        this.gameActive = true;
        this.startTime = Date.now();
        this.waitingForClose = false;

        const sz = 60;
        createMap(this.app, sz);
        this.player = createPlayer(this.app, this.selectedChar);
        this.letterEntities = createLetters(this.app, 0, 14, sz);
        this.chestEntities = createChests(this.app, 3, sz);

        updateHUD(0, 14, 0, 'Harita 1');
    }

    clearScene() {
        while (this.app.root.children.length > 0) {
            this.app.root.removeChild(this.app.root.children[0]);
        }
        this.letterEntities = [];
        this.chestEntities = [];
        this.portalEntity = null;
    }

    nextMap() {
        this.clearScene();
        this.currentMap = 2;
        this.gameActive = true;
        this.waitingForClose = false;

        const sz = 90;
        createMap(this.app, sz);
        this.player = createPlayer(this.app, this.selectedChar);
        this.letterEntities = createLetters(this.app, 14, 14, sz);
        this.chestEntities = createChests(this.app, 4, sz);

        updateHUD(0, 14, 0, 'Harita 2');
    }

    collect() {
        if (!this.gameActive || !this.player || this.waitingForClose) return;
        const pp = this.player.getPosition();

        // Check letters
        let closest = null, closestDist = 3.5;
        this.letterEntities.forEach(e => {
            if (e.userData.col) return;
            const d = pp.distance(e.getPosition());
            if (d < closestDist) { closestDist = d; closest = e; }
        });
        if (closest) {
            this.gameActive = false;
            this.waitingForClose = true;
            const result = collectLetter(closest);
            this.collected.add(result.idx);
            playSound('coin');
            showLetterInfo(result.letter);
            updateHUD(this.collected.size, 14, this.gold, this.currentMap === 1 ? 'Harita 1' : 'Harita 2');
            // TTS
            setTimeout(() => {
                const l = result.letter;
                if ('speechSynthesis' in window) {
                    const u1 = new SpeechSynthesisUtterance(l[1] + ', ' + l[0]);
                    u1.lang = 'ar-SA'; u1.rate = 0.8;
                    speechSynthesis.speak(u1);
                    setTimeout(() => {
                        const u2 = new SpeechSynthesisUtterance(l[3]);
                        u2.lang = 'tr-TR'; u2.rate = 0.8;
                        speechSynthesis.speak(u2);
                    }, 1200);
                }
            }, 400);
            if (this.collected.size >= 14) setTimeout(() => this.openPortal(), 1800);
            return;
        }

        // Check chests
        this.chestEntities.forEach(c => {
            if (c.userData.opened) return;
            if (pp.distance(c.getPosition()) < 3.5) {
                const earned = Math.floor(Math.random() * 20) + 10;
                this.gold += earned;
                c.userData.opened = true;
                c.enabled = false;
                this.gameActive = false;
                this.waitingForClose = true;
                playSound('break');
                showChestInfo(earned);
                updateHUD(this.collected.size, 14, this.gold, this.currentMap === 1 ? 'Harita 1' : 'Harita 2');
                if ('speechSynthesis' in window) {
                    const u = new SpeechSynthesisUtterance('Hazine! ' + earned + ' altin!');
                    u.lang = 'tr-TR'; speechSynthesis.speak(u);
                }
            }
        });
    }

    closeInfo() {
        hideAllPopups();
        this.gameActive = true;
        this.waitingForClose = false;
    }

    openPortal() {
        const pc = window.pc || this.app.root.constructor;
        this.portalEntity = new pc.Entity();
        this.portalEntity.addComponent('model', { type: 'torus' });
        this.portalEntity.setLocalScale(2, 2, 0.3);
        this.portalEntity.setPosition(0, 2.5, 0);
        const mat = new pc.StandardMaterial();
        mat.diffuse.set(0.46, 0.27, 0.64);
        mat.emissive.set(0.3, 0.15, 0.4);
        mat.update();
        this.portalEntity.model.material = mat;
        this.app.root.addChild(this.portalEntity);
        showPortal();
        if ('speechSynthesis' in window) {
            const u = new SpeechSynthesisUtterance('Portal acildi!');
            u.lang = 'tr-TR'; speechSynthesis.speak(u);
        }
        setTimeout(() => {
            document.getElementById('portalMsg').style.display = 'none';
            if (this.currentMap === 1) {
                this.nextMap();
            } else {
                this.gameActive = false;
                const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
                const m = Math.floor(elapsed / 60), s = elapsed % 60;
                showGameOver(`28/28 harf | ${this.gold} altin | ${m}dk ${s}sn`);
                if ('speechSynthesis' in window) {
                    const u = new SpeechSynthesisUtterance('Tebrikler!');
                    u.lang = 'tr-TR'; speechSynthesis.speak(u);
                }
            }
        }, 2500);
    }

    update(dt) {
        if (!this.gameActive || !this.player) return;
        updatePlayer(this.player, this.moveDir, dt, this.currentMap === 1 ? 60 : 90);

        // Camera follow
        const pp = this.player.getPosition();
        const cp = this.app.root.findByName('camera') || null;
        if (this._camera) {
            const camPos = this._camera.getPosition();
            camPos.x += (pp.x - camPos.x) * 0.08;
            camPos.z += (pp.z + 18 - camPos.z) * 0.08;
            this._camera.setPosition(camPos.x, camPos.y, camPos.z);
            this._camera.lookAt(pp.x, 0, pp.z);
        }

        // Animate letters
        const t = Date.now() * 0.001;
        this.letterEntities.forEach(e => {
            if (e.userData.col) return;
            const p = e.getPosition();
            e.setPosition(p.x, e.userData.baseY + Math.sin(t * 3 + e.userData.fo) * 0.3, p.z);
            e.rotate(0, 120 * dt, 0);
        });

        // Animate portal
        if (this.portalEntity) this.portalEntity.rotate(0, 0, 180 * dt);
    }
}
