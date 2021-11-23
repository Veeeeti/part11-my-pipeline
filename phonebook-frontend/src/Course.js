import React from 'react'

const Header = (props) => {
    console.log('Header props:',props)
    return (
      <h1>{props.course}</h1>
    )
  }
  
  const Part = (props) => {
    return(
      <div>
        {props.part} {props.exercises}
      </div>
    )
  }
  
  const Content = (props) => {
    console.log('Content props',props)
    const { parts } = props
    console.log('parts',parts)
  
  
    const totalExercises = parts.map((part,i) => parts[i].exercises).reduce((a,b) => a+b)
    console.log('totalexercises',totalExercises)
  
    return (
      <>
        <div>
          {parts.map((part,i) => <Part key={i} part={part.name} exercises={part.exercises}/>)}
        </div>
        <p><b>total of {totalExercises} exercises</b></p>
      </>
    )
    
  }
  
  
  const Course = (props) => {
    console.log('<Course/> props:',props)
    return(
      <>
        <Header course={props["course"].name} />
        <Content parts={props["course"].parts} />
        
      </>
    )
  }

export default Course