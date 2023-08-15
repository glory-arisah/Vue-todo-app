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
$md: 40em;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
main {
  width: 75%;
  margin: 3rem auto;
  .modal {
    position: fixed;
    z-index: 1000;
    top: 30%;
    left: 50%;
    max-width: 100%;
    width: 600px;
    transform: translate(-50%, -50%);
    background-color: #fff;
    transition: display 300ms;
    padding-block: 1.4rem;
    border-radius: 8px;
    animation-name: animatetop;
    animation-duration: 0.4s;

    @keyframes animatetop {
      from {
        top: -300px;
        opacity: 0;
      }
      to {
        top: 30%;
        opacity: 1;
      }
    }
    h2 {
      text-align: center;
    }
    .close--btn {
      span {
        display: block;
        margin: -2rem 1rem 0 auto;
        width: 24px;
        font-size: 1.5rem;
        cursor: pointer;
        text-align: center;
        border-radius: 50%;
        height: 24px;
        line-height: 24px;
        color: #fff;
        border: 0.5px solid #e61616;
        background-color: #e61616;
        transition: color 200ms, background-color 200ms;
        &:hover {
          background-color: transparent;
          color: #e61616;
          transition: color 200ms, background-color 200ms;
        }
      }
    }
  }
  .modal-overlay {
    position: absolute;
    z-index: 999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: 0.3;
  }
}
</style>
