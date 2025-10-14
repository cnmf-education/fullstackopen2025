import { useState } from 'react';

const Statistics = ({good, bad, neutral}) => {
  const all = good + bad + neutral;
  if (all===0){
    return (
      <div>
        <h1>statistics</h1>
        <div>No feedback given</div>
      </div>
    )
  } else {
    return (
      <div>   
        <h1>statistics</h1>     
        <table>
          <tbody>
            <StatisticLine text="good" value={good} />
            <StatisticLine text="neutral" value={neutral} />
            <StatisticLine text="bad" value={bad} />
            <StatisticLine text="all" value={all} />
            <StatisticLine text="average" value={(good - bad)/all } />
            <StatisticLine text="positive" value={(good*100)/all + " %" } />                     
          </tbody>
        </table> 
      </div>
    )
  }
}

const Button = (props) => (
  <button onClick={props.onClick}>{props.text}</button>
)

const StatisticLine = ({text, value}) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>  
)


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={()=>setGood(good+1)} text="good" />
      <Button onClick={()=>setNeutral(neutral+1)} text="neutral" />
      <Button onClick={()=>setBad(bad+1)} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App