import { initStore, logout, somebodyIsOnlined, somebodyWantOnline } from './auth'
import io from 'socket.io-client'

export const makeSio = (token) => {
  const socket = io.connect('http://120.76.232.12:8080/nspzx', {
    'query': 'token=' + token
  })

  // 连接成功
  socket.on('connect_decoded', (results) => {
    initStore(results)
  })

  socket.on('connect', () => {
    console.log('client connect success')

    // 通过客户端回调 callback, 无需用户干预
    socket.on('semit-user', (obj, callback) => {
      var citys = { '深圳': 'sz' }
      console.log(obj)
      console.log('client callback sz')
      callback(citys[obj.company.city])
    })
  })

  socket.on('error', (err) => {
    // Object {message: "jwt malformed", code: "invalid_token", type: "UnauthorizedError"}
    if (err.type === 'UnauthorizedError' || err.code === 'invalid_token') {
      // go to login page
      logout()
    }
  })

  // －A 服务器告诉自己（甲方）有人（乙方）已经使用此账号登录了
  // socket.emit('on-somebodyIsOnlined')

  // B 收到服务器通知（甲方）
  socket.on('on-somebodyIsOnlined', () => {
    window.setTimeout(function () {
      somebodyIsOnlined()
    }, 300)
  })

  // -C 通知服务器踢人下线（甲方）
  // emitToServer('somebodyWantOnline', null, null)

  // -D 服务器收到通知（甲方）
  // socket.on('emit-somebodyWantOnline')
    // 并通知对方自己想要登录（乙方）
    // io.to(socketId).emit('on-somebodyWantOnline', socket.id)

  // -E 对方收到通知（乙方）
  socket.on('on-somebodyWantOnline', (sid) => {
    somebodyWantOnline(sid)
  })

  // -F 对方（乙方）通知服务器拒绝（甲方）上线
  // emitToServer('cancelSomebodyOnline', store.state.sids, null)

  // -G 服务器收到通知
  // socket.on('emit-cancelSomebodyOnline')
    // 并通知甲方下线
    // io.to(sid[i]).emit(on-cancelSomebodyOnline)

  // 甲方收到服务器通知, 下线
  socket.on('on-cancelSomebodyOnline', () => {
    logout()
    window.alert('对方拒绝了您的上线请求！')
  })

  // // 不老实，服务器强制踢人
  socket.on('on-kickUser', () => {
    logout()
    window.alert('服务器发飙了！')
  })

  return {
    emit (eventName, data, callback) {
      socket.emit(eventName, data, callback)
    },
    on (eventName, callback) {
      socket.on(eventName, () => {
        callback(arguments)
      })
    },
    disconnect () {
      socket.disconnect()
    }
  }
}
