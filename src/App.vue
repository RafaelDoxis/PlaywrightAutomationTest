<script setup>
import { ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import Navbar from './components/Navbar.vue'
import DashboardPanel from './components/DashboardPanel.vue'

const activeTab = ref('Home')
</script>

<template>
  <div class="app">
    <Navbar v-model="activeTab" />

    <main>
      <section v-if="activeTab === 'Home'">
        <header>
          <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

          <div class="wrapper">
            <HelloWorld msg="You did it!" />
          </div>
        </header>
        <TheWelcome />
      </section>

      <section v-else-if="activeTab === 'Dashboard'">
        <DashboardPanel />
      </section>

      <section v-else-if="activeTab === 'Profile'">
        <h2>Profile</h2>
        <p>This is your profile area. Hook this up to your user data.</p>
      </section>
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 2rem auto;
}

main {
  flex: 1;
  width: 100%;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>

