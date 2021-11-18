
import React, { useEffect, useState } from 'react'

const Books = (props) => {

  const [books, setBooks] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (filter !== 'all') {
      setBooks(props.books.allBooks.filter(book => book.genres.includes(filter)))
    } else {
      setBooks(props.books.allBooks)
    }
  }, [props.books, filter])

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>books</h2>
      <p>In genre {filter}</p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        <button onClick={() => setFilter('refactoring')}>refactoring</button>
        <button onClick={() => setFilter('agile')}>agile</button>
        <button onClick={() => setFilter('patterns')}>patterns</button>
        <button onClick={() => setFilter('horror')}>horror</button>
        <button onClick={() => setFilter('design')}>design</button>
        <button onClick={() => setFilter('crime')}>crime</button>
        <button onClick={() => setFilter('classic')}>classic</button>
        <button onClick={() => setFilter('all')}>all genres</button>
      </div>
    </div>
  )
}

export default Books