import React from 'react'

export default function error404(props){
    
    return(
      
    <div>
      <h1>Error 404</h1>
      <button onClick={()=>{
        props.history.push('/')
      }}>
        home
      </button>
    </div>
  )
}
