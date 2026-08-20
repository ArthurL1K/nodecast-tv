/**
 * Audio lip-sync delay (milliseconds).
 * Applied server-side by FFmpeg (adelay) so the browser never mutes the stream.
 */
class AudioSync {
    constructor() {
        this.delayMs = 0;
        this.minMs = 0;
        this.maxMs = 2000;
        this.stepMs = 50;
    }

    format(ms = this.delayMs) {
        return `${Math.round(ms)} ms`;
    }

    clamp(ms) {
        const snapped = Math.round(Number(ms) / 10) * 10;
        return Math.max(this.minMs, Math.min(this.maxMs, snapped));
    }
}

AudioSync.syncUi = function (ms) {
    const settingsSlider = document.getElementById('setting-audio-delay');
    const settingsValue = document.getElementById('audio-delay-value');
    if (settingsSlider) settingsSlider.value = String(ms);
    if (settingsValue) settingsValue.textContent = `${ms} ms`;
};

AudioSync.broadcast = async function (ms, source) {
    const app = window.app;
    if (app?.player && source !== app.player && typeof app.player.setAudioDelayMs === 'function') {
        await app.player.setAudioDelayMs(ms, { persist: false, applyGraph: false });
    }
    if (app?.pages?.watch && source !== app.pages.watch && typeof app.pages.watch.setAudioDelayMs === 'function') {
        await app.pages.watch.setAudioDelayMs(ms, { persist: false, applyGraph: false });
    }
    AudioSync.syncUi(ms);
};

window.AudioSync = AudioSync;
