<script setup>
import { ref, onMounted } from 'vue';

const musicPlaying = ref(false);
const volume = ref(50); // Volumen inicial al 50%
const showVolumeControl = ref(false);

function toggleMusic() {
  const audio = document.getElementById("background-music");
  if (audio.paused) {
    audio.play();
    musicPlaying.value = true;
  } else {
    audio.pause();
    musicPlaying.value = false;
  }
}

function changeVolume() {
  const audio = document.getElementById("background-music");
  audio.volume = volume.value / 100;
}

onMounted(() => {
  const audio = document.getElementById("background-music");
  audio.volume = volume.value / 100;
});
</script>

<template>
  <div class="music-container" @mouseover="showVolumeControl = true" @mouseleave="showVolumeControl = false">
    <button @click="toggleMusic" class="music-button">
      🎵 {{ musicPlaying ? 'Pausar Música' : 'Reproducir Música' }}
    </button>
    <input 
      v-show="showVolumeControl" 
      type="range" 
      min="0" 
      max="100" 
      v-model="volume" 
      @input="changeVolume" 
      class="volume-slider"
    />
  </div>

  <audio id="background-music" loop>
    <source src="\src\assets\music\ambient.mp3" type="audio/mp3">
    Tu navegador no soporta audio.
  </audio>
</template>

<style scoped>
.music-container {
  position: fixed;
  bottom: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1050;
}

.music-button {
  background: #1F1E1C;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease-in-out, transform 0.2s;
}
.music-button:hover {
  background: #343434;
  transform: scale(1.05);
}

.volume-slider {
  width: 120px;
  height: 6px;
  background: #ddd;
  border-radius: 5px;
  cursor: pointer;
  appearance: none;
  outline: none;
  opacity: 0.8;
  transition: opacity 0.3s;
}
.volume-slider:hover {
  opacity: 1;
}
.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  background: #f5a623;
  border-radius: 50%;
  cursor: pointer;
}
</style>
