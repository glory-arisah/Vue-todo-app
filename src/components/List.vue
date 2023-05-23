<template>
  <section class="mb-3">
    <h3>{{ arrayType === "todos" ? "List" : "Hit List" }}</h3>
    <template v-if="todosCount > 0">
      <template v-for="todo in array" :key="todo.id">
        <section class="todos">
          <p class="todo">
            <input
              type="checkbox"
              style="margin-right: 0.3rem"
              @change="checkBoxTodo(todo.id)"
              :checked="todo.done"
              false-value="false"
              true-value="true"
            />
            <span :class="todo.done && 'linethrough'">{{ todo.title }}</span>
          </p>
          <p>
            <button
              v-show="!todo.done"
              @click="addOrRevertList(todo.id)"
              class="hit-list"
            >
              {{ arrayType === "todos" ? "hitlist" : "revert" }}
            </button>
          </p>
          <div class="action-btns">
            <font-awesome-icon
              v-show="!todo.done"
              :icon="['fas', 'fa-pencil']"
              class="btn"
              @click="editTodo(todo.id)"
            />

            <font-awesome-icon
              :icon="['fas', 'fa-times']"
              class="btn"
              @click="deleteTodo(todo.id)"
            />
          </div>
        </section>
      </template>
    </template>
    <template v-else>
      <p>
        {{
          arrayType === "todos"
            ? "No task(s) -- type in a value to add a todo now!!"
            : "Add special tasks to your hit list!"
        }}
      </p>
    </template>
  </section>
</template>

<script>
export default {
  name: "List",
  data() {
    return {
      task: {},
      hitListId: 0,
    };
  },
  props: ["array", "arrayType"],
  computed: {
    todosCount() {
      return this.array.length;
    },
  },
  methods: {
    editTodo(id) {
      this.task = this.array.find((todo) => todo.id === id);
      const [todo, arrayType] = [this.task, this.arrayType];
      this.$emit("edit-todo-ev", arrayType, todo);
    },
    deleteTodo(id) {
      const arrayType = this.arrayType;
      const removedTask = this.array.filter((todo) => todo.id !== id);
      this.$emit("delete-todo-ev", arrayType, removedTask);
    },
    addOrRevertList(id) {
      // const arrayType = this.arrayType;
      this.$emit("add-or-revert-hitlist", id);
    },
    checkBoxTodo(id) {
       const arrayType = this.arrayType
      this.$emit("checkbox-action", arrayType, id)
    },
  },
  emits: ["edit-todo-ev", "delete-todo-ev", "add-or-revert-hitlist", "checkbox-action"],
};
</script>

<style scoped></style>
