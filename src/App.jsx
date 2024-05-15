import { DatePicker } from "./DatePicker";
import { useState } from "react";
import "../styles.css";

function App() {
  const [selectedDay, setSelectedDay] = useState(new Date());
  return (
    <>
      <DatePicker selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
    </>
  );
}

export default App;
