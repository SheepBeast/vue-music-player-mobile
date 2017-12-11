import { stop } from '../assets/js/util'
export default function construct(router /* VueRouter类的实例 */) {
  const SLIDE_LEFT = 'slide-left', SLIDE_RIGHT = 'slide-right' /* 转场类(class) */

  let proto = router.__proto__,
    $store = router.app.$store,
    routes = router.options.routes[0].children

  /**
   * 对于一些基于store数据来渲染的页面，在应用刚启动时store是没有数据的
   * 在页面转场进入时(完全转场结束之前)会执行与新页面相关的数据请求操作和渲染
   * 因为转场期间并行数据请求和页面渲染时会造成转场的卡顿闪烁
   * 所以在beforeEach先拦截转场进入，预先准备好新页面的数据请求和页面渲染
   * 待页面渲染结束后再执行转场
   */
  const applyPreloadFn = function (nextRoute) {
    return new Promise(function (resolve, reject) {
      let find = routes.find(r => r.name == nextRoute.name),
        preload = find && find.meta && find.meta.preload

      if (!preload) {
        resolve()
      } else {
        Vue.$loadingTip.show()
        preload($store, Object.assign({
          done: function () {
            Vue.$loadingTip.hide()
            resolve()
          }, fail: reject
        }, nextRoute.query))
      }
    })
  }

  // 缓存转场类(class)
  proto.transfer = ''

  // push
  proto._push = proto.push
  proto.push = async function () {
    let args = arguments
    // 设置转场方向
    proto.transfer = SLIDE_LEFT
    // 预加载数据
    await applyPreloadFn(args[0])
    // 执行转场
    proto._push.apply(router, args)
  }

  // back
  proto._back = proto.back
  proto.back = function () {
    proto.transfer = SLIDE_RIGHT
    proto._back.call(router)
  }

  // replace, forward, go (TO DO)

  return router
}