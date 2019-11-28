<template>
    <div class="infinite">
        <slot></slot>
    </div>
</template>

<script>
  export default {
    /*$emit: loadFetch()*/
    /*props.sync: noMoreData()*/
    name:"infinite-scroll",
    props: {
      hasNextPage: false,
      loading: false,
      delay: 300,
      noMoreData: false,
    },
    data() {
      return {
        timerScroll: null,
        handleScrollThrottle: null,
        noMore: false,
      }
    },
    mounted() {
      this.timerScroll = null;
      this.handleScrollThrottle = this.throttle(this.handleScroll, this.delay);
      window.addEventListener('scroll', this.handleScrollThrottle, false);
    },
    methods: {
      // 节流函数
      throttle(func, delay) {
        let timerScroll = null;
        return () => {
          let context = this;
          let args = arguments;
          if (!timerScroll) {
            timerScroll = setTimeout(function () {
              func.apply(context, args);
              timerScroll = null;
            }, delay);
          }
        }
      },
      // 是否滚动到页面底部
      isScrollToPageBottom() {
        // const offsetHeight = document.documentElement.offsetHeight; //文档高度
        // const innerHeight = window.innerHeight; //浏览器窗口的高
        // const scrollY = window.scrollY; //页面滚动条的垂直距离
        const pageHeight = Math.max(document.body.scrollHeight,document.body.offsetHeight);
        const viewportHeight = window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight || 0;
        const scrollHeight = window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop || 0;
        console.log(pageHeight);
        console.log(viewportHeight);
        console.log(scrollHeight);
        console.log("*****", pageHeight - viewportHeight - scrollHeight);
        if (this.noMore || this.loading){
          return false;
        }
        return pageHeight - viewportHeight - scrollHeight < 48 && pageHeight - viewportHeight - scrollHeight != 0;
      },
      handleScroll() {
        // 如果当前不是在加载中，并且滚动到距离页面底部，则加载数据
        if (!this.loading && this.isScrollToPageBottom()) {
          if (this.hasNextPage) {
            this.$emit('loadFetch');
          } else {
            // 清除上一次的定时器，防止上一次定时器对底部提示文案的隐藏效果影响到本次
            clearTimeout(this.timerScroll);
            this.noMore = true;
            this.$emit('update:noMoreData',this.noMore)
            this.timerScroll = setTimeout(() => {
              this.noMore = false;
              this.$emit('update:noMoreData',this.noMore)
            }, 1500);
          }
        }
      },
    },
    beforeDestroy() {
      if (this.timerScroll) {
        clearInterval(this.timerScroll);
        this.timerScroll = null;
      }
      window.removeEventListener('scroll', this.handleScrollThrottle);
    },
  }
</script>