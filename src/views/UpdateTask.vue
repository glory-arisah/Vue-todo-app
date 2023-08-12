<!-- <template>
  <div>
    <h2>Edit Task</h2>
    <form @submit.prevent="handleSubmit">
      <input type="text" v-model="todoToEdit.todo" />
      <textarea
        name="description"
        rows="10"
        v-model="todoToEdit.description"
      ></textarea>
      <span class="word-count">{{ wordCount }}</span>
      <input type="submit" value="Update Task" />
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      todoToEdit: {
        userId: 5,
        todo: "",
        description: "",
      },
      isError: true,
    };
  },
  computed: {
    wordCount() {
      return this.todoToEdit.description.trim().length;
    },
  },
  mounted() {
    const currentTodo = JSON.parse(localStorage.getItem("todoList")).find(
      (todo) => todo.id === parseInt(this.$route.params.todoId)
    );
    this.todoToEdit.todo = currentTodo.todo;
  },
  methods: {
    resetInputFields() {
      this.todoToEdit.todo = "";
      this.todoToEdit.description = "";
    },
    async handleSubmit() {
      // validate all fields
      if (this.todoToEdit.todo && this.todoToEdit.description) {
        this.isError = false;
        const todoId = this.$route.params.todoId;
        const response = await axios.put(
          `https://dummyjson.com/todos/${todoId}`,
          {
            todo: this.todoToEdit.todo,
            completed: this.todoToEdit.completed,
            userId: 5,
          }
        );
        console.log(response);
        this.resetInputFields();
        this.$router.push({ name: "Home" });
      }
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped></style> -->
