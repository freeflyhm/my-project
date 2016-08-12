/* 模板片段 */
'use strict'
import Vue from 'vue'

export default function () {
  Vue.partial('errorTemplate', '{{ message }}')
}
