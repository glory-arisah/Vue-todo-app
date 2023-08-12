import Vue from "vue";

let close;

const state = Vue.observable({
  type: "confirm",
  active: false,
  message: "",
});

const dialogPromise = () => new Promise((resolve) => (close = resolve));

const open = (message) => {
  state.message = message;
  state.active = true;
  return dialogPromise();
};

const reset = () => {
  state.active = false;
  // state.message = "";
};

const dialog = {
  get state() {
    return state;
  },
  confirm(message) {
    state.type = "confirm";
    open(message);
  },
  cancel() {
    dialogPromise();
    close(false);
    reset();
  },
  // ok(input = true) {
  //   input = state.type === "prompt" ? input : true;
  //   close(input);
  //   reset();
  // },
};

export default dialog;
