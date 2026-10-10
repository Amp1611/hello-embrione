import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

export default function App() {
  const [notes, setNotes] = useState([])
  const [text, setText] = useState('')

  async function load() {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) console.error(error)
    else setNotes(data)
  }

  async function add() {
    if (!text.trim()) return
    const { error } = await supabase.from('notes').insert({ content: text })
    if (error) console.error(error)
    setText('')
    load()
  }

  useEffect(() => { load() }, [])

  return (
    <div style={{ maxWidth: 480, margin: '40px auto' }}>
      <h1>Notes</h1>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={add}>Add</button>
      <ul>{notes.map(n => <li key={n.id}>{n.content}</li>)}</ul>
    </div>
  )
}