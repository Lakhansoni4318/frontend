<template>
  <div class="max-w-2xl mx-auto mt-20">
    <div class="bg-white p-8 rounded-xl md:max-w-3xl shadow-lg">
      <h1 class="text-3xl font-semibold mb-6">Choose Specialization</h1>

      <div>
        <p>
          It looks like you haven't chosen a specialization yet. Follow these
          steps to choose a specialization:
        </p>

        <ol class="list-decimal pl-6">
          <li>Click on the "Settings" button.</li>
          <li>Go to the "Settings" option.</li>
          <li>Choose your specialization.</li>
          <li>
            Click on the "Save Specialization" button to confirm your
            specialization
          </li>
        </ol>

        <router-link :to="{ name: 'setting' }">
          <button
            class="mt-4 bg-blue-500 text-white p-2 rounded cursor-pointer"
          >
            Go to Settings
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>
