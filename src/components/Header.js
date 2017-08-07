import React from 'react'
import { translate } from 'react-i18next'
import Head from 'next/head'
import Link from 'next/link'

@translate(['common'])
class Header extends React.Component {
  constructor (props) {
    super(props)
    this.t = props.t
  }

  render () {
    return (
      <div>
        <Head>
          <title>
            Vcash - {this.t('decentralizedMoney')}
          </title>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <link
            rel='stylesheet'
            href='//cdnjs.cloudflare.com/ajax/libs/antd/2.12.3/antd.min.css'
          />
          <link rel='stylesheet' href='/static/css/default.css' />
        </Head>
        <div className='navigation shadow'>
          <div className='flex-sb wrapper'>
            <Link href='/'>
              <a className='flex header-link' style={{ margin: '0' }}>
                <img
                  src='/static/images/logoGrey.png'
                  width='32px'
                  height='32px'
                />
                <p style={{ fontSize: '18px', margin: '0 0 0 10px' }}>Vcash</p>
              </a>
            </Link>
            <div className='flex'>
              <Link prefetch href='/news'>
                <a className='flex header-link' title={this.t('news')}>
                  <i className='material-icons md-20'>speaker_notes</i>
                  <span>
                    {this.t('news')}
                  </span>
                </a>
              </Link>
              <Link prefetch href='/network'>
                <a className='flex header-link' title={this.t('network')}>
                  <i className='material-icons md-20'>public</i>
                  <span>
                    {this.t('network')}
                  </span>
                </a>
              </Link>
              <a
                className='flex header-link'
                href='https://docs.vcash.info'
                target='_blank'
                title={this.t('docs')}
              >
                <i className='material-icons md-20'>dvr</i>
                <span>
                  {this.t('docs')}
                </span>
              </a>
              <a
                className='flex header-link'
                href='https://blog.vcash.info'
                target='_blank'
                title={this.t('blog')}
              >
                <i className='material-icons md-20'>rate_review</i>
                <span>
                  {this.t('blog')}
                </span>
              </a>
              <a
                className='flex header-link'
                href='https://forum.vcash.info'
                target='_blank'
                title={this.t('forum')}
              >
                <i className='material-icons md-20'>forum</i>
                <span>
                  {this.t('forum')}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Header