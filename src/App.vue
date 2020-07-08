<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Статистика</router-link> |
      <router-link to="/loading">Загрузка</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.button {
    cursor: pointer;
    line-height: 1;
    cursor: pointer;
    border: 1px solid #dcdfe6;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    padding: 6px 14px;
    font-size: 14px;
    border-radius: 4px;
    &_danger {
      color: #fff;
      background-color: #f56c6c;
      border-color: #f56c6c;
      &:hover {
        background: #f78989;
        border-color: #f78989;
      }
      &:active {
        background: #dd6161;
        border-color: #dd6161;
      }
    }
  }
.grid {
    display: grid;
    .grid__header {
      padding: 15px 5px;
      margin: 10px 0;
      border-bottom: 2px solid black;
      border-top: 2px solid black;

    }
    .grid__row {
      padding: 10px 0;
      border-bottom: 1px solid black;
      align-self: center;
      min-height: 30px;
      position: relative;
    }
 }
 </style>
