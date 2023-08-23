<template>
  <div class="container">
    <!-- <the-alert
      v-show="!formSubmissionError"
    /> -->
    <section class="top-header">
      <!-- FLEX THIS CONTAINER -->
      <h3>Tasks</h3>
      <button
        @click="
          showModal = true;
          formMode = 'create';
        "
      >
        Add task
      </button>
    </section>
    <!-- CREATE TODO MODAL -->
    <template v-if="showModal">
      <todo-form
        :lastTodoId="lastTodoId"
        :activeEditId="activeEditId"
        @createTodo="handleNewTodo"
        @updateTodo="handleEditTodo"
        @closeModal="(value) => (showModal = !value)"
        :formMode="formMode"
      >
      </todo-form>
    </template>

    <the-pagination
      @setFormModeAndId="handleFormModeAndId"
      @sortedList="handleSortedList"
      :todo-list-copy="todoListCopy"
    />
  </div>
</template>

<script>
import axios from "axios";
import ThePagination from "@/components/ThePagination.vue";
import TodoForm from "./TodoForm.vue";
import { ref } from "vue";

export default {
  props: {
    formSubmissionError: Boolean,
  },
  setup() {
    const todoList = ref([]);
    const lastTodoId = ref(null);
    const todoListCopy = ref([]);

    // ONCREATE FETCH TODO LIST FROM LOCAL STORAGE IF AVAILABLE
    async function getTodoList() {
      if (localStorage.getItem("todoList") !== null) {
        todoListCopy.value = JSON.parse(localStorage.getItem("todoList"));
        lastTodoId.value = parseInt(
          JSON.parse(localStorage.getItem("lastTodoId"))
        );
      } else {
        const url = "https://dummyjson.com/todos";
        try {
          const { data } = await axios.get(url);
          todoList.value = data.todos;
          todoListCopy.value = data.todos.filter(
            ({ id, todo, userId, completed }) => ({
              id,
              todo,
              userId,
              completed,
            })
          );
          lastTodoId.value = todoListCopy.value[todoList.value.length - 1].id;
          localStorage.setItem("todoList", JSON.stringify(data.todos));
          localStorage.setItem("lastTodoId", JSON.stringify(lastTodoId.value));
        } catch (error) {
          console.error(error);
        }
      }
    }

    getTodoList();

    const activeEditId = ref(null);
    const formMode = ref("create");
    const response = ref("");
    const showModal = ref(false);

    function handleNewTodo({ title }) {
      if (!title) return;

      todoListCopy.value = [
        {
          id: lastTodoId.value++,
          todo: title,
          completed: false,
          userId: 5,
        },
        ...todoListCopy.value,
      ];
      localStorage.setItem("todoList", JSON.stringify(todoListCopy.value));
      showModal.value = false;
    }

    function handleEditTodo({ title, id }) {
      if (!title) return;

      todoListCopy.value = todoListCopy.value.map((todoItem) => {
        if (todoItem.id === id) todoItem.todo = title;
        return todoItem;
      });
      localStorage.setItem("todoList", JSON.stringify(todoListCopy.value));
      showModal.value = false;
    }

    function handleFormModeAndId({ editId, mode }) {
      activeEditId.value = editId;
      formMode.value = mode;
      showModal.value = true;
    }

    function handleSortedList(sortedList) {
      todoListCopy.value = sortedList
    }

    return {
      todoListCopy,
      activeEditId,
      showModal,
      formMode,
      response,
      lastTodoId,
      handleNewTodo,
      handleEditTodo,
      handleFormModeAndId,
      handleSortedList
    };
  },
  async created() {},
  components: {
    ThePagination,
    TodoForm,
  },
};
</script>

<style lang="scss" scoped>
.container {
  .top-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-block: 0;
    h3 {
      margin-block: 0;
      font-size: 1.8rem;
      font-weight: lighter;
    }
    button {
      padding: 0.5rem 1rem;
      border: 1px solid #0ab666;
      border-radius: 5px;
      background: #1aaf8a;
      color: #fff;
      transition: color 200ms, background-color 200ms;
      &:hover {
        color: #eee;
        background-color: #2ec67f;
        border-color: #2ad384;
        transition: background-color 200ms;
        cursor: pointer;
      }
    }
  }
  .todo-list {
    margin-top: 4rem;
    article {
      display: flex;
      justify-content: space-between;
      button {
        padding: 0.3rem 0.6rem;
      }
    }
  }
}
</style>
