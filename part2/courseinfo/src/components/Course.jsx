// Courses.jsx
const Header = ({name}) => {  
  return <h2>{name}</h2>
}

const Part = ({ name, exercises}) => {
  return (
    <p> <strong> {name} {exercises} </strong> </p>
  )
}

const Content = ({parts}) =>{
  return (
    <div>
      {parts.map(part => 
        <Part 
          key = {part.id} 
          name = {part.name} 
          exercises = {part.exercises} 
        />
      )}     
    </div>
  )  
}

const Total = ({parts}) =>{
  const totalExercises = parts.reduce(
    (total, part) => (total + part.exercises), 0
  )
  
  return (
    <b>Number of exercises {totalExercises}</b>
  )
}

const Course = ({course}) => {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <Header  name = {course.name} />
      <Content parts = {course.parts} />
      <Total   parts = {course.parts}  />
    </div>
  )
}



export default Course;