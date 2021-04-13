import React, { useState } from "react"

type Props = {
    label: string
    search: ({detail: {query: string}}) => void
}

export const SearchForm = ({label, search}: Props) => {
    const [query, setQuery] = useState("")
    return (
        <div>
            <div>
                <label htmlFor="search">{label}</label>
                <input type="text" id="search" onChange={(e)=>setQuery(e.target.value)} ></input>
            </div>
            <button onClick={() => search({detail: {query}})}>Search</button>
        </div>
    )
}