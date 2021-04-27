const $ = new Env('网易云音乐')
$.VAL_session = '{"url":"https://music.163.com/weapi/user/level","body":"params=tr4M235r%2FPUJwjgBrR6bqiyVWsbjFPEZpl61NKlET5u2hVwwa7eOaEpNLLFUaActQtIuCqw4Cyn3d3HRArIv0lhV02J1vBrDraA9YbXec9r%2BdvPKosdsGcAaHdolmydP&encSecKey=5a30a10d982b75cfb8eac8fcca276e95e64fe3b7b8888b17ca386500f693b5857b2ffb76b01e1efe6f5b99edcbf4ee7cf6b4e79120213b6d2503a5600dd2457278d17625d446d26e9d70319a5ad3d48c81d2407ba57544ad7412eb4651894033a525ef6718e16200965ad926e401ec03574b547d80c2b0f242e6d044e798a0bc","headers":{"Cookie":"MUSIC_U=755ee3d556ea1eb9a6f1183eaa458d321d1938a73058c2b1e59e798378503c1e33a649814e309366; __csrf=9e0464f8b40033fed3f1f2b4657c105c; WM_NI=uh8IptNrmDkWtReLy4ApswcWJ%2FWCyG8HGfVn43MJ14ctoJXEeUvp5G4BAMYYNFEm6vyzD6wai%2FG8HPIAzEHfuw7fwn38niaR3NLN4dbz621H2JBkfMrqqlCqsXqz3okgaDU%3D; WM_NIKE=9ca17ae2e6ffcda170e2e6eeccdc66f28d8f99b5648f9a8fa3d44a979a9abbae74ac96b9d3e166a2e98bb6e22af0fea7c3b92ab7b8f8aaf3808eaea3a5ea5db88eabadfc4083b0bd98e25d8af199a4fc4dfc988987d566f8ed83abb440a1aca1abdb4fa78bba91b84df89e8faedc538e9a8b8eb57ebba68cd7f66babf189d9cb5c8b9fb6a6cb6eb7a9f987f666f1e8a28ae45af19284afb770a2a6fad3b444f2968e8ce547b2afbf8dc27bb188bf9bb265a9b9afa5d837e2a3; WM_TID=X7XdlH%2BoaRlFEVBFRAJqxgJx3Kib%2FRUJ; _ntes_nnid=64486d8cc683f23b47538f8ab8739972,1619549650488; _ntes_nuid=64486d8cc683f23b47538f8ab8739972; JSESSIONID-WYYY=0vPp06s7fmi2xCBB%2BRkQfjKT5Yq7cyGqzOcQOePe0eo1XktUQfP80s60vRdCEm%5CaJQgDBpV7XNHrw%2FMDOkuGogf6bYIw4CiSXjpFgjuJbkUAcUT15AzTunWkv1wXWpZfK7pUjdBn6HHUi%2B2J61jTMp%2F4QU15IbIsqZRKj8oaxbz1%2FrUH%3A1619551450466; NMTID=00OskNpwke0JDQ_X0NSmdFgic9aS7QAAAF5FK5_Gg; _iuqxldmzr_=33","Accept":"*/*","Content-Type":"application/x-www-form-urlencoded","Origin":"https://music.163.com","Accept-Encoding":"br, gzip, deflate","Connection":"keep-alive","Host":"music.163.com","Accept-Language":"zh-cn","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Mobile/15E148 Safari/604.1","Referer":"https://music.163.com/store/m/gain/mylevel"}}'
$.CFG_retryCnt = ($.getdata('CFG_neteasemusic_retryCnt') || '10') * 1
$.CFG_retryInterval = ($.getdata('CFG_neteasemusic_retryInterval') || '500') * 1

!(async () => {
  $.log('', `🔔 ${$.name}, 开始!`, '')
  init()
  await signweb()
  await signapp()
  await getInfo()
  await showmsg()
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.msg($.name, $.subt, $.desc), $.log('', `🔔 ${$.name}, 结束!`, ''), $.done()
  })

function init() {
  $.isNewCookie = /https:\/\/music.163.com\/weapi\/user\/level/.test($.VAL_session)
  $.Cookie = $.isNewCookie ? JSON.parse($.VAL_session).headers.Cookie : $.VAL_session
}

async function signweb() {
  for (let signIdx = 0; signIdx < $.CFG_retryCnt; signIdx++) {
    await new Promise((resove) => {
      const url = { url: `http://music.163.com/api/point/dailyTask?type=1`, headers: {} }
      url.headers['Cookie'] = $.Cookie
      url.headers['Host'] = 'music.163.com'
      url.headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15'
      $.get(url, (error, response, data) => {
        try {
          $.isWebSuc = JSON.parse(data).code === -2
          $.log(`[Web] 第 ${signIdx + 1} 次: ${data}`)
        } catch (e) {
          $.isWebSuc = false
          $.log(`❗️ ${$.name}, 执行失败!`, ` error = ${error || e}`, `response = ${JSON.stringify(response)}`, '')
        } finally {
          resove()
        }
      })
    })
    await new Promise($.wait($.CFG_retryInterval))
    if ($.isWebSuc) break
  }
}

async function signapp() {
  for (let signIdx = 0; signIdx < $.CFG_retryCnt; signIdx++) {
    await new Promise((resove) => {
      const url = { url: `http://music.163.com/api/point/dailyTask?type=0`, headers: {} }
      url.headers['Cookie'] = $.Cookie
      url.headers['Host'] = 'music.163.com'
      url.headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1'
      $.get(url, (error, response, data) => {
        try {
          $.isAppSuc = JSON.parse(data).code === -2
          $.log(`[App] 第 ${signIdx + 1} 次: ${data}`)
        } catch (e) {
          $.isAppSuc = false
          $.log(`❗️ ${$.name}, 执行失败!`, ` error = ${error || e}`, `response = ${JSON.stringify(response)}`, '')
        } finally {
          resove()
        }
      })
    })
    await new Promise($.wait($.CFG_retryInterval))
    if ($.isAppSuc) break
  }
}

function getInfo() {
  if (!$.isNewCookie) return
  return new Promise((resove) => {
    $.post(JSON.parse($.VAL_session), (error, response, data) => {
      try {
        $.userInfo = JSON.parse(data)
      } catch (e) {
        $.log(`❗️ ${$.name}, 执行失败!`, ` error = ${error || e}`, `response = ${JSON.stringify(response)}`, '')
      } finally {
        resove()
      }
    })
  })
}

function showmsg() {
  return new Promise((resove) => {
    $.subt = $.isWebSuc ? 'PC: 成功' : 'PC: 失败'
    $.subt += $.isAppSuc ? ', APP: 成功' : ', APP: 失败'
    if ($.isNewCookie && $.userInfo) {
      $.desc = `等级: ${$.userInfo.data.level}, 听歌: ${$.userInfo.data.nowPlayCount} => ${$.userInfo.data.nextPlayCount} 升级 (首)`
      $.desc = $.userInfo.data.level === 10 ? `等级: ${$.userInfo.data.level}, 你的等级已爆表!` : $.desc
    }
    resove()
  })
}

// prettier-ignore
function Env(s){this.name=s,this.data=null,this.logs=[],this.isSurge=(()=>"undefined"!=typeof $httpClient),this.isQuanX=(()=>"undefined"!=typeof $task),this.isNode=(()=>"undefined"!=typeof module&&!!module.exports),this.log=((...s)=>{this.logs=[...this.logs,...s],s?console.log(s.join("\n")):console.log(this.logs.join("\n"))}),this.msg=((s=this.name,t="",i="")=>{this.isSurge()&&$notification.post(s,t,i),this.isQuanX()&&$notify(s,t,i);const e=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];s&&e.push(s),t&&e.push(t),i&&e.push(i),console.log(e.join("\n"))}),this.getdata=(s=>{if(this.isSurge())return $persistentStore.read(s);if(this.isQuanX())return $prefs.valueForKey(s);if(this.isNode()){const t="box.dat";return this.fs=this.fs?this.fs:require("fs"),this.fs.existsSync(t)?(this.data=JSON.parse(this.fs.readFileSync(t)),this.data[s]):null}}),this.setdata=((s,t)=>{if(this.isSurge())return $persistentStore.write(s,t);if(this.isQuanX())return $prefs.setValueForKey(s,t);if(this.isNode()){const i="box.dat";return this.fs=this.fs?this.fs:require("fs"),!!this.fs.existsSync(i)&&(this.data=JSON.parse(this.fs.readFileSync(i)),this.data[t]=s,this.fs.writeFileSync(i,JSON.stringify(this.data)),!0)}}),this.wait=((s,t=s)=>i=>setTimeout(()=>i(),Math.floor(Math.random()*(t-s+1)+s))),this.get=((s,t)=>this.send(s,"GET",t)),this.post=((s,t)=>this.send(s,"POST",t)),this.send=((s,t,i)=>{if(this.isSurge()){const e="POST"==t?$httpClient.post:$httpClient.get;e(s,(s,t,e)=>{t&&(t.body=e,t.statusCode=t.status),i(s,t,e)})}this.isQuanX()&&(s.method=t,$task.fetch(s).then(s=>{s.status=s.statusCode,i(null,s,s.body)},s=>i(s.error,s,s))),this.isNode()&&(this.request=this.request?this.request:require("request"),s.method=t,s.gzip=!0,this.request(s,(s,t,e)=>{t&&(t.status=t.statusCode),i(null,t,e)}))}),this.done=((s={})=>this.isNode()?null:$done(s))}
