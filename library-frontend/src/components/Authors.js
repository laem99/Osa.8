import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import React, { useState } from 'react'
import { ALL_AUTHORS } from '../App'
import Select from 'react-select';

const UPDATE_AUTHOR = gql`
mutation Mutation($name: String, $setBornTo: Int) {
  editAuthor(name: $name, setBornTo: $setBornTo) {
    name
    born
  }
}
`

const Authors = (props) => {

  const [name, setName] = useState(null)
  const [born, setBorn] = useState('')

  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [ALL_AUTHORS]
  })

  if (!props.show) {
    return null
  }

  const authors = props.authors.allAuthors

  const update = async (event) => {
    event.preventDefault()

    updateAuthor({ variables: { name: name.value, setBornTo: parseInt(born) } })

    setBorn('')
    setName(null)
  }
  const options = authors.map(au => {
    let obj = { value: au.name, label: au.name }
    return obj
  })

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2>Set birthyear</h2>
      <form onSubmit={update}>
        <Select defaultValue={name} onChange={setName} options={options} />
        <div>
          born
          <input value={born} name="born" onChange={({ target }) => setBorn(target.value)} />
        </div>
        <button type='submit'>update author</button>
      </form>

    </div>
  )
}

export default Authors