import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'mobx-react'
import { has as hasProps } from 'lodash'
import { parse as parseCookie } from 'cookie'
import { get as getCookie } from 'js-cookie'
import { i18n, fetchTranslation } from '../src/utilities/i18next'

/** Required components. */
import Layout from '../src/components/Layout'
import Subscribed from '../src/components/Subscribed'

class SubscribedPage extends React.Component {
  static async getInitialProps({ req }) {
    const initProps = {
      isServer: typeof window === 'undefined',
      language: 'en-US',
      translation: {}
    }

    /**
     * Read the language cookie from the request headers if on the server,
     * or read the cookie directly if on the client.
     */
    if (initProps.isServer === true) {
      initProps.language =
        hasProps(req, 'headers.cookie') === true
          ? parseCookie(req.headers.cookie).language
          : 'en-US'
    } else {
      initProps.language =
        typeof getCookie('language') === 'undefined'
          ? 'en-US'
          : getCookie('language')
    }

    /** Fetch the translation files for the language found in the cookie. */
    initProps.translation = await fetchTranslation(
      initProps.language,
      ['common'],
      initProps.isServer
    )

    /** Return initial properties. */
    return initProps
  }

  constructor(props) {
    super(props)
    this.i18n = i18n(props.translation, props.language)
  }

  render() {
    return (
      <Provider>
        <I18nextProvider i18n={this.i18n}>
          <Layout>
            <Subscribed />
          </Layout>
        </I18nextProvider>
      </Provider>
    )
  }
}

export default SubscribedPage
