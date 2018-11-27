import * as firebase from 'firebase'

export const app = firebase.initializeApp({
  apiKey: "<apiKey>",
  authDomain: "<authDomain>",
  databaseURL: "<databaseURL>",
  projectId: "<projectId>",
  storageBucket: "<storageBucket>",
  messagingSenderId: "<msgSenderId>"
})

export let serverUrl = process.env.NODE_ENV === 'production'
  ? 'SERVER_URL'
  : 'http://localhost:8000'

export async function authAsync (id: string, pass: string, url: string) {
  const r = await loginAsync(id, pass, url)
  const { firebaseToken } = r
  await app.auth().signInWithCustomToken(firebaseToken)
  // tslint:disable-next-line:no-console
  app.auth().currentUser!.getIdToken().then(s => 'ID Token: \n' + console.log(s))
  serverUrl = url
}

async function loginAsync (id: string, pass: string, url: string, key = '') {
  const params = new URLSearchParams()
  params.append('id', id)
  params.append('pass', pass)
  params.append('key', key)
  const res = await fetch(url + '/v2/admin/login', {
    method: 'POST',
    body: params.toString(),
    headers: new Headers({
      'content-type': 'application/x-www-form-urlencoded'
    })
  })
  const body = await res.json()
  if (body.status === 'success') {
    return {
      moodleToken: res.headers.get('X-New-Token'),
      firebaseToken: body.data.token as string,
      role: body.data.role as string
    }
  } else {
    throw new Error(body.error)
  }
}
