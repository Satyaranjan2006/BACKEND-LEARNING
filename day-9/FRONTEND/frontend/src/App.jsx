import { useState, useEffect } from 'react'
import axios from 'axios'


function App() {


  const [notes, setNotes] = useState([])
  console.log('hello integration');

  function fetchNotes() {
    axios.get('http://localhost:3000/notes')
      .then((res) => {
        setNotes(res.data.notes)
      })

  }


  useEffect(() => {

    fetchNotes()

  }, [])

  function handelSubmit(e) {
    e.preventDefault()
    const { title, description } = e.target.elements
    console.log(title.value, description.value)

    axios.post('http://localhost:3000/notes', {
      title: title.value,
      description: description.value
    })
      .then(res => {
        console.log(res.data);
        fetchNotes()
      })

  }
  function handelDeleteNote(noteId) {

    axios.delete('http://localhost:3000/notes/'+noteId)
      .then(res => {
        console.log(res.data);
        fetchNotes()

      })

  }





  return (
    <>
      <form className='note-created-form' onSubmit={handelSubmit}>
        <input name='title' type="text" placeholder='Enter title' />
        <input name='description' type="text" placeholder='Enter Description' />
        <button>Create Notes</button>
      </form>
      <div className="notes">
        {
          notes.map(note => {
            return <div className="note">
              <h1>{note.title}</h1>
              <p>{note.description}</p>
              {/* helps to deleete */}
              <button onClick={() => { handelDeleteNote(note._id) }}>delete</button>
            </div>

          })
        }


      </div>
    </>
  )
}

export default App
