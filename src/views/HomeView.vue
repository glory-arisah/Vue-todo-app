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
          $router.push({
            name: 'form',
            params: {
              formMode: 'create',
            },
          })
        "
      >
        Add task
      </button>
    </section>
    <section>
      <select data-todo-filter v-model="filter">
        <option :value="null">All</option>
        <option :value="true">Completed</option>
        <option :value="false">Not Completed</option>
      </select>
    </section>
    <the-pagination :filter="filter" :todoList="[...filteredTodos]" />
  </div>
</template>

<script>
import axios from "axios";
import ThePagination from "@/components/ThePagination.vue";
import { ref, computed } from "vue";

export default {
  setup(props) {
    const todoTitle = ref("");
    const activeEditId = ref(null);
    const formMode = ref("add");
    const response = ref(null);

    // FILTER TODOLIST BASED ON COMPLETION
    const todoList = ref([{}]);
    const filter = ref(null);

    const filteredTodos = computed(() => {
      if (filter.value === null) return todoList.value;
      else
        return todoList.value.filter((todo) => todo.completed === filter.value);
    });

    // ONCREATE FETCH TODO LIST FROM LOCAL STORAGE IF AVAILABLE
    async function getTodoList() {
      if (localStorage.getItem("todoList")) {
        todoList.value = JSON.parse(localStorage.getItem("todoList"));
      } else {
        const url = "https://dummyjson.com/todos";
        const { data } = await axios.get(url);
        todoList.value = data.todos;
        localStorage.setItem("todoList", JSON.stringify(todoList.value));
      }
    }
    getTodoList();

    const todoId = computed(() => {
      if (todoList.value.length)
        return todoList.value[todoList.value.length].id;
      else return null;
    });

    return {
      todoTitle,
      todoList,
      activeEditId,
      todoId,
      formMode,
      response,
      filter,
      filteredTodos,
      formSubmissionError: props.formSubmissionError,
    };
  },
  async created() {},
  components: {
    ThePagination,
  },
  computed: {
    // filteredTodos() {
    //   if (this.filter === null) return this.todoList;
    //   else
    //     return this.todoList.filter((todo) => todo.completed === this.filter);
    // },
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
      background: linear-gradient(to top right, #147df5, #0dafd3, #1aaf8a);
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
