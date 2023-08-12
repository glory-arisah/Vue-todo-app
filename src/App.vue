<template>
  <div id="app">
    <the-navigation />
    <main>
      <router-view
        :formSubmissionError="formSubmissionError"
        @submissionErrors="handleFormErrors"
      />
    </main>
  </div>
</template>

<script>
import TheNavigation from "./components/TheNavigation.vue";
import { RouterView } from "vue-router";

export default {
  name: "App",
  data() {
    return {
      formSubmissionError: false,
    };
  },
  components: {
    TheNavigation,
    RouterView,
  },
  methods: {
    handleFormErrors(value) {
      this.formSubmissionError = value;
    },
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
main {
  width: 80%;
  margin: 3rem auto 0 auto;
}
</style>
