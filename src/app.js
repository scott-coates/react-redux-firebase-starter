import axios from 'axios'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Base64 from 'crypto-js/enc-base64'
import Utf8 from 'crypto-js/enc-utf8'

const App = () => {
  const [userData, setUserData] = useState()
  const [searchParams, setSearchParams] = useSearchParams()

  console.log('userData', userData)

  const redirect_uri = 'http://localhost:3000'

  const authentication = () => {
    window.location.replace(
      `https://accounts.spotify.com/authorize?response_type=code&client_id=462b17ca327648a4ac1f6202fa7e3a79&redirect_uri=${redirect_uri}`
    )
  }

  const setAccessToken = () => {
    const code = searchParams.get('code')
    const clientId = '462b17ca327648a4ac1f6202fa7e3a79'
    const clientSecret = '253ddfa807194bcfad327dc49fbc9ec0'
    const formData = {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code',
    };

    // copied from one of my side projects, not sure of original source.
    const POSTWebhookData = Object.entries(formData).map(([key, value]) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(value);
    }).join('&');

    const options = {
      method: 'POST',
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // https://github.com/brix/crypto-js/issues/189
        // https://stackoverflow.com/questions/48524452/base64-encoder-via-crypto-js
        'Authorization': 'Basic ' + Base64.stringify(Utf8.parse(clientId + ':' + clientSecret))
      },
      data: POSTWebhookData
    }

    axios(options).then((response) => setUserData(response.data))
  }

  return (
    <>
      <button onClick={authentication}>Auth</button>
      <button onClick={setAccessToken}> SetToken</button>
    </>
  )
}

export default App
