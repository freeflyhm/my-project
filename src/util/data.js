import { initStore, logout, somebodyIsOnlined, somebodyWantOnline } from './auth'
import io from 'socket.io-client'

export const makeSio = (token, dbName, router) => {
  const socket = io.connect('http://120.76.232.12:8080/nspzx', {
    'query': 'dbName=' + dbName + '&token=' + token
  })

  // 加入房间失败
  socket.on('semit-joinRoomFail', (results) => {
    console.log(results)
    logout(router)
  })

  socket.on('semit-somebodyIsJoinRoom', (results) => {
    initStore(results)
  })

  // socket.on('connect', () => {
  //   console.log('client connect success')
  //
  //   // // 通过客户端回调 callback, 无需用户干预
  //   // socket.on('semit-user', (obj, callback) => {
  //   //   var citys = { '深圳': 'sz' }
  //   //   console.log(obj)
  //   //   console.log('client callback sz')
  //   //   callback(citys[obj.company.city])
  //   // })
  // })

  socket.on('error', (err) => {
    // Object {message: "jwt malformed", code: "invalid_token", type: "UnauthorizedError"}
    if (err.type === 'UnauthorizedError' || err.code === 'invalid_token') {
      // go to login page
      logout(router)
    }
  })

  // －A 服务器通知甲，乙已经使用此账号登录了
  // 是否要踢乙，由甲决定

  // -B 甲收到服务器通知
  socket.on('semit-somebodyIsOnlined', () => {
    window.setTimeout(function () {
      somebodyIsOnlined()
    }, 300)
  })

  // -C 甲通知服务器踢乙下线
  // emitToServer('somebodyWantOnline', null, null)

  // -D 服务器收到来自甲的通知, 甲想要登录房间
  // socket.on('cemit-somebodyWantOnline')
    // 服务器广播通知乙，甲想要登录
    // 是否拒绝甲，由乙决定
    // socket.broadcast.to(res.id).emit('sbroadcast-somebodyWantOnline', socket.id)

  // -E 乙收到服务器广播通知
  socket.on('sbroadcast-somebodyWantOnline', (sid) => {
    somebodyWantOnline(sid)
  })

  // -F 乙通知服务器拒绝甲进入房间
  // emitToServer('cancelSomebodyOnline', iscancel, null)

  // -G 服务器收到通知
  // socket.on('cemit-cancelSomebodyOnline', iscancel)
    // if iscancel = true 并通知甲方下线
    // socket.broadcast.to().emit(semit-cancelSomebodyOnline)

  // 下线
  socket.on('semit-cancelSomebodyOnline', () => {
    logout(router)
    window.alert('不好意思，您被踢下线了！')
  })

  // // 不老实，服务器强制踢人
  // socket.on('on-kickUser', () => {
  //   logout()
  //   window.alert('服务器发飙了！')
  // })

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
