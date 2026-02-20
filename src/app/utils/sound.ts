// Sound utility for retro game sounds
export class SoundManager {
  private static audioContext: AudioContext | null = null;
  private static sounds: Map<string, AudioBuffer> = new Map();
  private static isPlaying: Set<string> = new Set();

  private static getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    return this.audioContext;
  }

  // Generate retro coin sound
  static async playCoin() {
    if (this.isPlaying.has('coin')) return;
    this.isPlaying.add('coin');
    
    const ctx = this.getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
    
    setTimeout(() => this.isPlaying.delete('coin'), 150);
  }

  // Generate soft fail sound
  static async playFail() {
    if (this.isPlaying.has('fail')) return;
    this.isPlaying.add('fail');
    
    const ctx = this.getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(300, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
    
    setTimeout(() => this.isPlaying.delete('fail'), 200);
  }

  // Generate level up sound
  static async playLevelUp() {
    if (this.isPlaying.has('levelup')) return;
    this.isPlaying.add('levelup');
    
    const ctx = this.getContext();
    
    const notes = [523.25, 659.25, 783.99, 1046.50];
    let time = ctx.currentTime;
    
    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(freq, time);
      gainNode.gain.setValueAtTime(0.2, time);
      gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
      
      oscillator.start(time);
      oscillator.stop(time + 0.15);
      
      time += 0.1;
    });
    
    setTimeout(() => this.isPlaying.delete('levelup'), 500);
  }

  // Generate button click sound
  static async playClick() {
    if (this.isPlaying.has('click')) return;
    this.isPlaying.add('click');
    
    const ctx = this.getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05);
    
    setTimeout(() => this.isPlaying.delete('click'), 50);
  }
}

// Voice synthesis for character
export class VoiceManager {
  private static synth: SpeechSynthesis = window.speechSynthesis;
  private static isSpeaking = false;

  static speak(text: string) {
    if (this.isSpeaking) {
      this.synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 1.2;
    utterance.volume = 0.7;
    
    // Try to find a friendly voice
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes('Google US English') || 
      v.name.includes('Daniel') ||
      v.name.includes('Samantha')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    this.isSpeaking = true;
    utterance.onend = () => {
      this.isSpeaking = false;
    };

    this.synth.speak(utterance);
  }

  static stop() {
    this.synth.cancel();
    this.isSpeaking = false;
  }
}
