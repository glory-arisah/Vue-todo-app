import { mount, Wrapper } from "@vue/test-utils";
import Vue from "vue";
import Home from "@/views/HomeView.vue";

describe("HemeView.vue", () => {
  let wrapper;
  // Wrapper<Vue>;

  beforeEach(() => {
    wrapper = mount(Home, {
      stubs: {
        "font-awesome-icon": true,
      },
    });
  });
  it("renders first ten todos on page load", () => {
    const todos = wrapper.findAll("[data-todo-item]");

    // await axios fetch todo list process
    setTimeout(() => {
      expect(todos.length).toBe(10);
    }, 3000);
  });
  it("filters todo list correctly", async () => {
    // wrapper
  });
});
