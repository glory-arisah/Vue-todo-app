<template>
  <div>
    <h2>Create a Task</h2>
    <form @submit.prevent="handleSubmit">
      <input type="text" v-model="newTodo.todo" />
      <textarea
        name="description"
        rows="10"
        v-model="newTodo.description"
      ></textarea>
      <span class="word-count">{{ wordCount }}</span>
      <input type="submit" value="Create Task" />
    </form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      newTodo: {
        userId: 5,
        todo: "",
        description: "",
        completed: false,
      },
      isError: true,
    };
  },
  computed: {
    wordCount() {
      return this.newTodo.description.trim().length;
    },
  },
  methods: {
    resetInputFields() {
      this.newTodo.todo = "";
      this.newTodo.description = "";
    },
    handleSubmit() {
      // validate all fields
      if (this.newTodo.todo && this.newTodo.description) {
        this.isError = false;
        axios.post("https://dummyjson.com/todos/add", {
          userId: 5,
          todo: this.newTodo.todo,
          completed: this.newTodo.completed,
        });
        this.resetInputFields();
        this.$router.push({ name: "Home" });
      }
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped></style>
