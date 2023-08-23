<template>
  <div>
    <nav>
      <h3 @click="$route.path === '/' ? null : $router.push({ name: 'Home' })">
        TODO LIST
      </h3>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
nav {
  border: {
    bottom-left-radius: 5px;
    bottom-right-radius: 5px;
  }
  background: #036d44;
  padding-block: 1.3rem;
  h3 {
    cursor: pointer;
    color: #fff;
    font-weight: lighter;
    margin-left: 1.5rem;
  }
}
</style>
