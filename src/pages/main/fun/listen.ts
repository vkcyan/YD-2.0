import { useMain } from '@/store/main'
import { numberFun } from '@/utils'
import { onClickOutside, useMagicKeys, useMouseInElement, useMousePressed } from '@vueuse/core'
import { computed, watch, watchEffect } from 'vue'

/**
 * 页面移动监听函数
 */
export default function useListen(coreRef) {
  const main = useMain()
  let initX = 0 // 保存操作前的坐标
  let initY = 0
  const { ctrl, c, v, z } = useMagicKeys()
  watchEffect(() => {
    if (ctrl.value && c.value) {
      console.log('复制')
    } else if (ctrl.value && v.value) {
      console.log('粘贴')
    } else if (ctrl.value && z.value) {
      console.log('撤回')
    }
  })

  // 监听鼠标松开
  const { pressed } = useMousePressed(coreRef)
  watch(pressed, (value) => {
    if (!value) {
      main.moveIndex = 0
    }
  })

  /**
   * 与主页面相关的元素位置反应
   */
  const { elementX, elementY } = useMouseInElement(coreRef)
  const acDom = computed(() => {
    if (main.activeCompIndex != -1) {
      return main.template[main.activeCompIndex].cssModule
    } else {
      return {}
    }
  })
  watchEffect(() => {
    switch (main.moveIndex) {
      case 1:
        top()
        left()
        break
      case 2:
        left()
        break
      case 3:
        bottom()
        left()
        break
      case 4:
        top()
        break
      case 5:
        bottom()
        break
      case 6:
        top()
        right()
        break
      case 7:
        right()
        break
      case 8:
        bottom()
        right()
        break
      case 9:
        if (numberFun(elementY.value, 0) > 3000) {
          main.pageHeight = 3000
        } else if (numberFun(elementY.value, 0) < 650) {
          main.pageHeight = 650
        } else {
          main.pageHeight = numberFun(elementY.value, 0)
        }
        break
      case 10:
        moveDom()
        break
      case 0:
        // 保存操作前坐标
        initX = elementX.value
        initY = elementY.value
        break
      default:
        break
    }
  })

  // 单个坐标点事件
  function top() {
    acDom.value.top = elementY.value
    acDom.value.height = acDom.value.height - (elementY.value - initY)
    // 刷新操作前坐标
    initY = elementY.value
  }
  function left() {
    acDom.value.left = elementX.value
    acDom.value.width = acDom.value.width - (elementX.value - initX)
    // 刷新操作前坐标
    initX = elementX.value
  }
  function right() {
    acDom.value.width = elementX.value - acDom.value.left
  }

  function bottom() {
    acDom.value.height = elementY.value - acDom.value.top
  }

  function moveDom() {
    // 移动距离为相对于页面左上角减去抓手距离元素左上角位置
    acDom.value.top = elementY.value - main.domOffsetY
    acDom.value.left = elementX.value - main.domOffsetX
  }
}
