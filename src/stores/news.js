import { action, computed, observable } from 'mobx'
import { shorten } from '../utilities/common'
import fetch from 'isomorphic-unfetch'

class News {
  /**
   * Observable properties.
   * @property {number} page - Pagination's current page.
   * @property {array} posts - News posts.
   * @property {object} search - Search value, keywords and timeout id.
   */
  @observable page = 1
  @observable posts = observable.array([])
  @observable search = { value: '', keywords: [], timeoutId: null }

  /**
   * @constructor
   * @property {number} perPage - News posts per page.
   */
  constructor () {
    this.perPage = 3

    /** Fetch news posts. */
    this.fetchNews()
  }

  /**
   * Get an object with news posts ids as keys.
   * @function byId
   * @return {object} News posts.
   */
  @computed
  get byId () {
    return this.posts.reduce((posts, post) => {
      posts[post.id] = post
      return posts
    }, {})
  }

  /**
   * Get paginated and filtered news posts.
   * @function filtered
   * @return {object} News posts and count.
   */
  @computed
  get filtered () {
    let filtered = this.posts

    /** Search for keywords in news posts titles and bodies. */
    if (this.search.keywords.length !== 0) {
      filtered = this.posts.reduce((posts, post) => {
        const matches = this.search.keywords.reduce((matches, keyword) => {
          if (
            post.body.indexOf(keyword) !== -1 ||
            post.title.indexOf(keyword) !== -1
          ) {
            matches += 1
          }

          return matches
        }, 0)

        /** Push news posts with match count equal to the number of keywords. */
        if (matches === this.search.keywords.length) {
          posts.push(post)
        }

        return posts
      }, [])
    }

    /** Paginate filtered news posts. */
    return {
      count: filtered.length,
      posts: filtered.slice(
        this.page === 1 ? 0 : (this.page - 1) * this.perPage,
        this.page === 1
          ? this.perPage
          : (this.page - 1) * this.perPage + this.perPage
      )
    }
  }

  /**
   * Get the ids and titles of the 5 latest news posts.
   * @function latestFive
   * @return {array} Latest five news posts.
   */
  @computed
  get latestFive () {
    let posts = []

    for (let i = 0; i < this.posts.length; i++) {
      if (posts.length === 5) break

      posts.push({
        id: this.posts[i].id,
        timestamp: this.posts[i].timestamp,
        title: shorten(this.posts[i].title, 25)
      })
    }

    return posts
  }

  /**
   * Set current page.
   * @function setPage
   * @param {number} page - Current page.
   */
  @action
  setPage (page) {
    this.page = page
  }

  /**
   * Set news posts.
   * @function setPosts
   * @param {array} posts - News posts.
   */
  @action
  setPosts (posts) {
    this.posts = posts
  }

  /**
   * Set searching keywords.
   * @function setSearch
   * @param {string} keywords - Keywords to search by.
   */
  @action
  setSearch (keywords) {
    /** Clear previous timeout id. */
    clearTimeout(this.search.timeoutId)

    /** Update search string. */
    this.search.value = keywords

    /** Update keywords array in 1s, unless canceled before. */
    this.search.timeoutId = setTimeout(
      action('setSearch', () => {
        this.search.keywords = keywords.match(/[^ ]+/g) || []

        /** If not on the first page of news posts, go back to it. */
        if (this.page !== 1) {
          this.setPage(1)
        }
      }),
      1 * 1000
    )
  }

  /**
   * Fetch news posts.
   * @function fetchNews
   */
  async fetchNews () {
    try {
      let posts = await fetch('http://localhost:3000/api/news')
      posts = await posts.json()

      /** Set news posts. */
      this.setPosts(posts)
    } catch (e) {
      console.error('Failed to fetch news.json\n\n', e)
    }
  }
}

/**
 * Initialize a new store or return an existing one.
 * @function initNews
 * @param {boolean} isServer - Calling from server or client.
 */
export const initNews = isServer => {
  if (isServer && typeof window === 'undefined') {
    return new News()
  } else {
    if (newsStore === null) {
      newsStore = new News()
    }

    return newsStore
  }
}

/** Keep a global reference of the news store. */
let newsStore = null