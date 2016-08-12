<template>
  <li class="dropdown">
    <slot></slot>
    <slot name="dropdown-menu"></slot>
  </li>
</template>
<script>
  import EventListener from '../util/eventListener'

  export default {
    methods: {
      toggleDropdown (e) {
        e.preventDefault()
        this.$el.classList.toggle('open')
      }
    },
    ready () {
      const el = this.$el
      el.addEventListener('click', this.toggleDropdown)

      this._closeEvent = EventListener.listen(window, 'click', (e) => {
        if (!el.contains(e.target)) el.classList.remove('open')
      })
    },
    beforeDestroy () {
      if (this._closeEvent) this._closeEvent.remove()
    }
  }
</script>
