<template>
  <section>
    <div class="modal">
      <h2>
        {{ formMode === "create" ? "Add a new Todo" : "Update your Todo" }}
      </h2>
      <div class="close--btn">
        <span @click="$emit('closeModal', true)">&times;</span>
      </div>
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
            :value="formMode === 'create' ? 'Create' : 'Update'"
          />
        </div>
      </form>
    </div>
    <div class="modal-overlay"></div>
  </section>
</template>

<script>
import axios from "axios";
import { computed, reactive, ref, onMounted } from "vue";

export default {
  props: {
    formMode: String,
    activeEditId: Number,
  },
  setup(props, { emit }) {
    const todoItem = reactive({
      userId: 5,
      todo: "",
    });
    const isError = ref(true);

    // const editTodoName = computed(() => )
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
        emit("createTodo", {
          title: todoItem.todo,
        });
        await axios.post("https://dummyjson.com/todos/add", {
          userId: 5,
          todo: todoItem.todo,
          completed: todoItem.completed,
        });
      } catch (error) {
        console.log(error);
        // emit("newTodo", { close: false });
      }
    }

    async function handleEditedTodo() {
      try {
        emit("updateTodo", {
          title: todoItem.todo,
          id: todoItem.id,
        });
        axios.put(`https://dummyjson.com/todos/${props.activeEditId}`, {
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
          if (props.formMode === "create") await handleNewTodo();
          else if (props.formMode === "update") await handleEditedTodo();
        } catch (error) {
          submissionError.value = true;
        }
        resetInputFields();
      } else {
        isError.value = true;
        setTimeout(() => {
          isError.value = false;
        }, 3000);
      }
    }

    onMounted(() => {
      if (props.formMode === "update") {
        const currentTodo = JSON.parse(localStorage.getItem("todoList")).find(
          (todo) => parseInt(todo.id) === props.activeEditId
        );
        todoItem.todo = currentTodo.todo;
        todoItem.id = currentTodo.id;
        checkError();
      }
    });

    return {
      todoItem,
      isError,
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
    font-weight: bold;
  }
  input[type="text"] {
    margin: 0.3rem 0.8rem 0.4rem 0;
    width: 70%;
    padding: 0.3rem 0.5rem;
    border-radius: 5px;
    border: 1px solid gray;
  }
  input[type="submit"] {
    padding: 0.3rem 0.6rem;
    margin-top: 1rem;
    border-radius: 5px;
    font-size: 0.95rem;
    border: 1px solid #0dafd3;
    // background: linear-gradient(to top right, #147df5, #0dafd3, #1aaf8a);
    color: #fff;
    background-color: #26a469;
  }
  .error-message {
    font-size: 0.8rem;
    color: #a90808;
  }
}
</style>
