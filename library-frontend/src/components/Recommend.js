import React, { useEffect, useState } from "react"

const Recommend = ({ show, books, user }) => {
    const [reBooks, setReBooks] = useState([])

    useEffect(() => {
        setReBooks(books.allBooks.filter(book => book.genres.includes(user.favoriteGenre)))
    }, [books, user])

    if (!show) {
        return null
    }

    if (reBooks.length === 0) {
        return <p>No recommended books...</p>
    }

    return (
        <div>
            <h2>Recommendations</h2>
            <p>Books in your favorite genre <b>{user.favoriteGenre}</b></p>
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
                    {reBooks.map(book =>
                        <tr key={book.id}>
                            <td>{book.title}</td>
                            <td>{book.author.name}</td>
                            <td>{book.published}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        // reBooks.map(book => <p key={book.id}>{book.title}</p>)
    )
}

export default Recommend