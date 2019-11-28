// import a from './core/main.js'
import b from './core/infiniteScroll.vue'

export const InfiniteScroll = b;

class Plugin {
  static install (Vue) {
    // Vue.prototype.InfiniteScroll = InfiniteScroll
    Vue.mixin({
      components: {
        'InfiniteScroll': InfiniteScroll
      }
    })
  }
}
export default Plugin