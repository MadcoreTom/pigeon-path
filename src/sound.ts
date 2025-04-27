

const audioCtx: AudioContext = new (window['AudioContext'] || window['webkitAudioContext'])();
const MAX_GAIN = 0.05;

class Sound {
    private osc: OscillatorNode;
    private gain: GainNode;
    private filter: BiquadFilterNode;
    private timeBlocked: number = 0;
    private timeBlockedPriority = 0;


    constructor() {

        // OSC -> wave shaper -> gain

        // create        
        this.osc = audioCtx.createOscillator();
        this.osc.type = "sawtooth";
        this.osc.start();

        const len = 256;
        const pulseCurve = new Float32Array(len);
        for (var i = 0; i < len; i++) {
            pulseCurve[i] = i < len * 0.4 ? -1 : 1; // 60% PWM
        }
        const pulseShaper = audioCtx.createWaveShaper();
        pulseShaper.curve = pulseCurve;

        this.gain = audioCtx.createGain();
        this.gain.gain.setValueAtTime(0, audioCtx.currentTime);
        
        this.filter = audioCtx.createBiquadFilter();
        this.filter.type = "lowpass";
        this.filter.frequency.setValueAtTime(550, audioCtx.currentTime);
        // connect
        this.osc.connect(pulseShaper);
        pulseShaper.connect(this.gain);
        this.gain.connect(this.filter);
        this.filter.connect(audioCtx.destination);
    }

    private clearAndCheckBlocked(seconds: number, priority: number, method: () => void) {
        const now = audioCtx.currentTime;
        if (priority < this.timeBlockedPriority && now < this.timeBlocked) {
            return;
        }
        this.timeBlockedPriority = priority;
        this.timeBlocked = now + seconds;
        // clear
        this.osc.frequency.cancelScheduledValues(now);
        this.gain.gain.cancelScheduledValues(now);
        method();
    }

    private beep(freq: number, seconds: number, priority: number = 0): void {
        this.clearAndCheckBlocked(seconds, priority, () => {
            const now = audioCtx.currentTime;
            this.osc.frequency.setValueAtTime(freq, now);
            this.gain.gain.setValueAtTime(MAX_GAIN, now);
            this.gain.gain.setValueAtTime(0.0, now + seconds);
        });
    }

    private blip(freq: number, seconds: number, priority: number = 0): void {
        this.clearAndCheckBlocked(seconds, priority, () => {
            const now = audioCtx.currentTime;
            this.osc.frequency.setValueAtTime(freq, now);
            this.osc.frequency.setValueAtTime(freq * 2, now + seconds / 2);
            this.gain.gain.setValueAtTime(MAX_GAIN, now);
            this.gain.gain.setValueAtTime(0.0, now + seconds);
        });
    }

    private zoop(freq: [number, number], seconds: number, priority: number = 0): void {
        this.clearAndCheckBlocked(seconds, priority, () => {
            const now = audioCtx.currentTime;
            this.osc.frequency.setValueAtTime(freq[0], now);
            this.osc.frequency.linearRampToValueAtTime(freq[1], now + seconds / 2);
            this.gain.gain.setValueAtTime(MAX_GAIN, now);
            this.gain.gain.setValueAtTime(0.0, now + seconds);
        });
    }

    public confirm() {
        this.blip(600, 0.1);
    }

    public move() {
        this.beep(600, 0.05, -1);
    }

    public collide() {
        this.beep(600, 0.2);
    }

    public doorLocked() {
        this.beep(500, 0.15);
    }

    public openDoor() {
        this.blip(600, 0.2);
    }

    public newLevel() {
        this.zoop([500, 800], 0.4, 1);
    }


    public resume() {
        if (audioCtx.state != "running") {
            audioCtx.resume().then(() => console.log("RESUMED"));
        }
    }
};

export const SOUND = new Sound();