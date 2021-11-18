import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { gql, useApolloClient, useLazyQuery, useQuery, useSubscription } from '@apollo/client'
import Login from './components/Login'
import Recommend from './components/Recommend'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      bookCount,
      name,
      id,
      born,
    }
  }
`

export const ALL_BOOKS = gql`
  query {
    allBooks(author: "", genre: "") {
      title,
      published,
      author {
        name,
        born,
        id
      },
      id,
      genres,
    }
  }
`

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    id
    title
    genres
    published
    author {
      born 
      name
      id
    }
  }
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  
${BOOK_DETAILS}
`

export const LOGIN = gql`
  mutation Mutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

const ME = gql`
    query {
      me {
        username,
        favoriteGenre,
      }
    }
`

export const GENRE_BOOKS = gql`
  query {
    allBooks(author: "", genre: ${JSON.parse(localStorage.getItem('genre'))}) {
      title,
      published,
      author {
        name,
        born,
        id
      },
      id,
      genres,
    }
  }
`

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null
  }
  return (
    <div style={{ color: 'violet' }}>
      {errorMessage}
    </div>
  )
}

const App = () => {
  const authors_result = useQuery(ALL_AUTHORS)
  const books_result = useQuery(ALL_BOOKS)
  const me = useQuery(ME)
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()
  const genre_result = useLazyQuery(GENRE_BOOKS)

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => 
      set.map(p => p.id).includes(object.id)  

    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks : dataInStore.allBooks.concat(addedBook) }
      })
    }   
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      notify(`${addedBook.title} added`)
      updateCacheWith(addedBook)
    }
  })

  if (authors_result.loading || books_result.loading || me.loading || genre_result.loading) {
    return <div>Loading...</div>
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    window.localStorage.clear()
    client.resetStore()
  }

  window.localStorage.setItem('genre', JSON.stringify(me.data.me.favoriteGenre))

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <Login setToken={setToken} setError={notify} />
      </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommend')}>recommend</button>
        <button onClick={logout}>logout</button>
      </div>
      <br />
      <Notify errorMessage={errorMessage} />

      <Authors
        show={page === 'authors'}
        authors={authors_result.data}
      />

      <Books
        show={page === 'books'}
        books={books_result.data}
      />

      <NewBook
        show={page === 'add'}
        setError={notify}
      />

      <Recommend
        show={page === 'recommend'}
        books={books_result.data}
        user={me.data.me}
      />

    </div>
  )
}

export default App