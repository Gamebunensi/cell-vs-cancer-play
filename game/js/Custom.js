// Web Audio API-based audio engine
const audioContext = globalThis.audioContext || new (window.AudioContext || window.webkitAudioContext)();
globalThis.audioContext = audioContext;

// Master gain node for volume control
const masterGain = globalThis.masterGain || audioContext.createGain();
if (!globalThis.masterGain) {
	masterGain.connect(audioContext.destination);
	globalThis.masterGain = masterGain;
}

// Audio buffer cache
const audioBuffers = globalThis.audioBuffers || new Map();
globalThis.audioBuffers = audioBuffers;

// Playing sounds tracking
window.playingSounds = [];

// Configuration
const MAX_TOTAL_SOUNDS = 64; // Increased since Web Audio API is more efficient
const MAX_SOUNDS_PER_KEY = 8;
const CLEANUP_INTERVAL_MS = 3000;
const MIN_INTERVAL_MS_PER_KEY = 30;
const PLAY_RATE_WINDOW_MS = 250;
const MAX_PLAYS_PER_WINDOW = 20;

// Rate limiting
const lastPlayAt = globalThis.audioLastPlayAt || new Map();
globalThis.audioLastPlayAt = lastPlayAt;
const recentPlayTimes = globalThis.audioRecentPlayTimes || [];
globalThis.audioRecentPlayTimes = recentPlayTimes;

// Helper to generate unique keys
function getAudioKey(path, name, tag) {
	return `${path}|${name || path}|${tag || "default"}`;
}

// Load and decode audio file
async function loadAudioBuffer(url) {
	if (audioBuffers.has(url)) {
		return audioBuffers.get(url);
	}

	try {
		const response = await fetch(url);
		const arrayBuffer = await response.arrayBuffer();
		const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
		audioBuffers.set(url, audioBuffer);
		return audioBuffer;
	} catch (error) {
		console.warn(`Failed to load audio: ${url}`, error);
		return null;
	}
}

// Cleanup finished sounds
function cleanupPlayingSounds() {
	for (let i = playingSounds.length - 1; i >= 0; i -= 1) {
		const sound = playingSounds[i];
		if (!sound || !sound.source || sound.stopped) {
			playingSounds.splice(i, 1);
		}
	}
}

// Rate limiting check
function canPlayNow(key) {
	const now = Date.now();
	const last = lastPlayAt.get(key) || 0;
	if (now - last < MIN_INTERVAL_MS_PER_KEY) {
		return false;
	}
	while (recentPlayTimes.length && now - recentPlayTimes[0] > PLAY_RATE_WINDOW_MS) {
		recentPlayTimes.shift();
	}
	if (recentPlayTimes.length >= MAX_PLAYS_PER_WINDOW) {
		return false;
	}
	recentPlayTimes.push(now);
	lastPlayAt.set(key, now);
	return true;
}

setInterval(cleanupPlayingSounds, CLEANUP_INTERVAL_MS);

// Main play function
async function PlaySound2(path, loop, name, tag) {
	if (oS.ImmuneMod && path.startsWith("crazydave")) path = "immune-guide";
	// Resume audio context if suspended (browser autoplay policy)
	if (audioContext.state === "suspended") {
		await audioContext.resume();
	}

	name = name || path;
	const tagName = tag || "default";
	const audioPath = `audio/${path}.${path.startsWith("immune-") ? "wav" : "mp3"}`;
	const key = getAudioKey(audioPath, name, tagName);

	if (!canPlayNow(key)) {
		return null;
	}

	cleanupPlayingSounds();

	// Enforce total sound limit
	if (playingSounds.length >= MAX_TOTAL_SOUNDS) {
		const oldest = playingSounds.shift();
		if (oldest && oldest.source) {
			oldest.source.stop();
			oldest.stopped = true;
		}
	}

	// Check per-key limits
	let playingForKeyCount = 0;
	for (const sound of playingSounds) {
		if (sound.name === name && sound.tag === tagName) {
			playingForKeyCount += 1;
			if (playingForKeyCount >= MAX_SOUNDS_PER_KEY) {
				return null;
			}
		}
	}

	// Load audio buffer
	const buffer = await loadAudioBuffer(audioPath);
	if (!buffer) {
		return null;
	}

	// Create source node
	const source = audioContext.createBufferSource();
	source.buffer = buffer;
	source.loop = Boolean(loop);

	// Create gain node for this sound
	const gainNode = audioContext.createGain();
	gainNode.gain.value = oS.Silence ? 0 : 1;

	// Connect: source -> gain -> master -> destination
	source.connect(gainNode);
	gainNode.connect(masterGain);

	// Track the sound
	const soundObj = {
		source,
		gainNode,
		name,
		tag: tagName,
		path: audioPath,
		stopped: false,
		startTime: audioContext.currentTime,
	};

	// Auto-cleanup when sound ends
	source.onended = () => {
		soundObj.stopped = true;
		const idx = playingSounds.indexOf(soundObj);
		if (idx !== -1) {
			playingSounds.splice(idx, 1);
		}
	};

	source.start(0);
	playingSounds.push(soundObj);

	return soundObj;
}

// Stop sounds by name
function StopSound2(name) {
	playingSounds.forEach((sound) => {
		if (sound.name && sound.name.includes(name)) {
			if (sound.source && !sound.stopped) {
				try {
					sound.source.stop();
					sound.stopped = true;
				} catch (e) {
					// Already stopped
				}
			}
		}
	});
	cleanupPlayingSounds();
}

// Stop sounds by tag
function StopSoundTag2(tag) {
	playingSounds.forEach((sound) => {
		if (sound.tag === tag) {
			if (sound.source && !sound.stopped) {
				try {
					sound.source.stop();
					sound.stopped = true;
				} catch (e) {
					// Already stopped
				}
			}
		}
	});
	cleanupPlayingSounds();
}

// Edit sound properties (loop)
function EditSound2(name, loop = false) {
	playingSounds.forEach((sound) => {
		if (sound.path && sound.path.includes(name) && sound.source) {
			sound.source.loop = Boolean(loop);
		}
	});
}

// Update master volume based on oS.Silence
setInterval(() => {
	if (typeof oS !== "undefined" && masterGain) {
		masterGain.gain.value = oS.Silence ? 0 : 1;
	}
}, 100);
