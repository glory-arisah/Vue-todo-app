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
  background: linear-gradient(to top right, #147df5, #0dafd3, #1aaf8a);
  padding-block: 1.3rem;
  h3 {
    cursor: pointer;
    color: #fff;
    font-weight: light;
    margin-left: 1.5rem;
  }
}
</style>
