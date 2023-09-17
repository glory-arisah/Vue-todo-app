<template>
  <div class="container">
    <TheModalVue v-if="showModal"
      :modalSubmissionState="modalSubmissionState"
      :options="modalOptions"
      @resolveModalAction="createTodo"
      @close="showModal = false"
    />
    <!-- CREATE TODO MODAL -->
    <section class="top-header">
      <h3>Tasks</h3>
      <button
        @click="showCreateTodoModal"
      >
        Add task
      </button>
    </section>

    <the-pagination
      @sortedList="handleSortedList"
      @updateTodoList="updateTodoList"
      :todo-list-copy="todoListCopy"

    />
  </div>
</template>

<script>
import IBaseConfig from '@/service';
import axios from "axios";
import ThePagination from "@/components/ThePagination.vue";
import TheModalVue from '@/components/TheModal.vue';
import  { ref, reactive } from "vue";

export default {
  props: {
    formSubmissionError: Boolean,
  },
  setup() {
    const todoList = ref([]);
    const lastTodoId = ref(null);
    const todoListCopy = ref([]);
    const modalOptions = reactive({ action: '', header: '', inputValue: '', id: null })
    const modalSubmissionState = ref(false)

    async function getTodoList() {
      if (localStorage.getItem("todoList") !== null) {
        todoListCopy.value = JSON.parse(localStorage.getItem("todoList"));
        lastTodoId.value = parseInt(JSON.parse(localStorage.getItem("lastTodoId")));
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
    const showModal = ref(false);

    function showCreateTodoModal() {
      showModal.value = true
      modalOptions.action = 'create'
      modalOptions.header = `Create a new task`
      modalOptions.inputValue = ''
      modalOptions.id = lastTodoId.value++
    }

    async function handleNewTodo(value, id) {
      try {
        const resp = await IBaseConfig.post('add', {
          id,
          userId: 5,
          todo: value,
          completed: false,
        })
        if (resp?.errors) {
          throw resp?.errors
        }
      } catch(err) {
        console.log(err)
      }
    }

    async function createTodo({ value, id }) {
      modalSubmissionState.value = true

      if (!value && !value.length) return
      await handleNewTodo(value, id)
      todoListCopy.value = [{ id, completed: false, todo: value, userId: 5 }, ...todoListCopy.value]
      localStorage.setItem('todoList', JSON.stringify(todoListCopy.value))

      modalSubmissionState.value = false
      showModal.value = false
    }

    function handleSortedList(sortedList) {
      todoListCopy.value = sortedList
      localStorage.setItem("todoList", JSON.stringify(todoListCopy.value));
    }

    function updateTodoList(newList) {
      todoListCopy.value = newList
      localStorage.setItem("todoList", JSON.stringify(todoListCopy.value));
    }

    return {
      todoListCopy,
      activeEditId,
      showModal,
      showCreateTodoModal,
      createTodo,
      modalSubmissionState,
      formMode,
      lastTodoId,
      handleSortedList,
      updateTodoList,
      modalOptions
    };
  },
  async created() {},
  components: {
    ThePagination,
    // TodoForm,
    TheModalVue
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
