<template>
  <div>
    <h2>
      {{ $route.params.formMode === "create" ? "Create Task" : "Update Task" }}
    </h2>
    <form
      @submit.prevent="
        handleSubmit();
        $emit('submissionErrors', submissionError);
      "
    >
      <div>
        <label>Title</label>
        <input type="text" v-model.trim="todoItem.todo" @input="checkError" />
        <span class="word-count">{{ wordCount }}</span>
      </div>
      <span class="error-message" v-show="isError"
        >* This field cannot be blank</span
      >
      <div>
        <input
          type="submit"
          :value="
            $route.params.formMode === 'create' ? 'Create Task' : 'Update Task'
          "
        />
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { computed, reactive, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router/composables";
// import { useRouter, useRoute } from "vue-router/types";

export default {
  setup() {
    const todoItem = reactive({
      userId: 5,
      todo: "",
    });
    const isError = ref(true);
    const route = useRoute();
    const router = useRouter();
    const formMode = ref(route.params.formMode);
    const submissionError = ref(false);

    const wordCount = computed(() => {
      return todoItem.todo.trim().length;
    });

    // UTILITY METHODS
    function checkError() {
      if (todoItem.todo) isError.value = false;
      else isError.value = true;
    }

    function resetInputFields() {
      todoItem.todo = "";
    }

    // CREATE AND UPDATE METHODS
    async function handleNewTodo() {
      try {
        await axios.post("https://dummyjson.com/todos/add", {
          userId: 5,
          todo: todoItem.todo,
          completed: todoItem.completed,
        });
      } catch (error) {
        console.log(error);
      }
    }

    async function handleEditedTodo() {
      try {
        const todoId = route.params.todoId;
        axios.put(`https://dummyjson.com/todos/${todoId}`, {
          userId: 5,
          todo: todoItem.todo,
          completed: todoItem.completed,
        });
      } catch (error) {
        console.log(error);
      }
    }

    async function handleSubmit() {
      // validate todo field
      if (todoItem.todo.trim().length) {
        try {
          if (formMode.value === "create") await handleNewTodo();
          else if (formMode.value === "update") await handleEditedTodo();
        } catch (error) {
          submissionError.value = true;
        }
        resetInputFields();

        router.push({ name: "Home" });
      } else {
        isError.value = true;
        setTimeout(() => {
          isError.value = false;
        }, 3000);
      }
    }

    onMounted(() => {
      if (route.params.formMode === "update") {
        const currentTodo = JSON.parse(localStorage.getItem("todoList")).find(
          (todo) => todo.id === parseInt(route.params.todoId)
        );
        todoItem.todo = currentTodo.todo;
        checkError();
      }
    });

    return {
      todoItem,
      isError,
      formMode,
      submissionError,
      wordCount,
      checkError,
      handleNewTodo,
      handleEditedTodo,
      handleSubmit,
    };
  },
};
</script>

<style lang="scss" scoped>
form {
  display: flex;
  flex-direction: column;
  // border: 1px solid rgb(13, 171, 199);
  padding: 1rem;
  label {
    display: block;
    margin-top: 1rem;
  }
  input[type="text"] {
    margin: 0.3rem 0.8rem 1rem 0;
    width: 70%;
    padding: 0.3rem;
    border-radius: 5px;
    border: 1px solid gray;
  }
  input[type="submit"] {
    padding: 0.3rem 0.6rem;
    border-radius: 5px;
    border: 1px solid #0dafd3;
    background: linear-gradient(to top right, #147df5, #0dafd3, #1aaf8a);
    color: #eee;
    &:hover {
      color: #fff;
      cursor: pointer;
    }
  }
  .error-message {
    font-size: 0.8rem;
    color: rgb(169, 8, 8);
  }
}
</style>
