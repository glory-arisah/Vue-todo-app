<template>
  <!-- <transition name="dialog"> -->
  <div class="dialog">
    <h3>Are you sure?</h3>
    <div class="option-buttons">
      <button @click="$emit('response', 'yes')">Yes</button>
      <button @click="$emit('response', 'no')">No</button>
    </div>
  </div>
  <!-- </transition> -->
</template>

<script>
// import dialog from "../dialog.js";
export default {};
</script>

<style lang="scss" scoped>
.dialog {
  position: absolute;
  background-color: #fff;
  top: 8%;
  width: 80%;
  border: 0.5px solid #9ab8b2;
  box-shadow: 3px 4px 6px #aacbc5;
  transition: all 500ms ease-in;
  h3 {
    margin-block: 1rem;
    text-align: center;
  }
  .option-buttons {
    width: 100%;
    text-align: center;
    margin-bottom: 0.8rem;
    button {
      padding: 0.2rem 0.35rem;
      margin-right: 0.7rem;
    }
  }
}
</style>
