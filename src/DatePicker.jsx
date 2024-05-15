import {
  eachDayOfInterval,
  subDays,
  endOfMonth,
  format,
  startOfMonth,
  addDays,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { useState } from "react";

const totalSpots = 7 * 5;

export function DatePicker({ selectedDay, setSelectedDay }) {
  const [displayMonth, setDisplayMonth] = useState(new Date());
  //   上下的時候要重新render, 但這兩個state變數有互相依賴的問題
  //   const [displayDay, setDisplayDay] = useState(new Date());
  //   prev => 顯示上個月的日曆
  //   displayMonth 預設為這個月
  function prev() {
    setDisplayMonth(
      () => new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1, 1)
    );
  }

  function next() {
    setDisplayMonth(
      () => new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 1)
    );
  }
  const [isOpen, setIsOpen] = useState(false);
  const formatToday = format(selectedDay, "MMM do , yyyy");

  const spots = fillDayInCanlender(displayMonth);
  return (
    <>
      <div className="date-picker-container">
        {/* 預設關閉，點擊該按鈕的時候on/off */}
        <button
          className="date-picker-button"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {formatToday}
        </button>

        {isOpen && (
          <div className="date-picker">
            <div className="date-picker-header">
              <button
                className="prev-month-button month-button"
                onClick={() => prev()}
              >
                &larr;
              </button>
              <div className="current-month">
                {format(displayMonth, "MMM")} - {displayMonth.getFullYear()}
              </div>
              <button
                className="next-month-button month-button"
                onClick={() => next()}
              >
                &rarr;
              </button>
            </div>
            <div className="date-picker-grid-header date-picker-grid">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
            <div className="date-picker-grid-dates date-picker-grid">
              {spots.map((date) => (
                <button
                  className={`date ${isToday(date) && "today"} ${
                    isSameMonth(date, selectedDay)
                      ? ""
                      : "date-picker-other-month-date"
                  } ${isSameDay(date, selectedDay) ? "selected" : ""}`}
                  key={date.toDateString()}
                  onClick={() => setSelectedDay(date)}
                >
                  {date.getDate()}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// fillDayInCanlender function can done with this line of code:
// return eachDayOfInterval({
//    start: startOfWeek(startOfMonth(displayMonth)),
//    end: endOfWeek(endOfMonth(displayMonth)),
//  })

function fillDayInCanlender(selectedDay) {
  const allDaysInMonth = eachDayOfInterval({
    start: startOfMonth(selectedDay),
    end: endOfMonth(selectedDay),
  });

  const allSpots = Array.from({ length: totalSpots }, () => null);
  const startDay = allDaysInMonth[0].getDay();

  let i = 0;
  for (let spotIndex = startDay; spotIndex < allSpots.length; spotIndex++) {
    allSpots[spotIndex] = allDaysInMonth[i] ? allDaysInMonth[i] : null;
    i = i + 1;
  }

  const newAllSpots = fillEmptySlot(
    allSpots,
    selectedDay,
    startDay,
    allDaysInMonth[allDaysInMonth.length - 1].getDate()
  );

  return newAllSpots;
}

function fillEmptySlot(allSpots, selectedDay, startDay, totalDate) {
  const newAllSpots = [...allSpots];
  const emptyTailSpotCount = allSpots.length - (startDay + totalDate);

  //   往前遞補
  if (startDay !== 0) {
    let prevDate = subDays(startOfMonth(selectedDay), 1);
    for (let i = startDay - 1; i >= 0; i--) {
      newAllSpots[i] = prevDate;
      prevDate = subDays(prevDate, 1);
    }
  }

  //   往後遞補
  if (emptyTailSpotCount) {
    let nextDate = addDays(endOfMonth(selectedDay), 1);
    for (let i = emptyTailSpotCount; i > 0; i--) {
      newAllSpots[newAllSpots.length - i] = nextDate;
      nextDate = addDays(nextDate, 1);
    }
  }
  return newAllSpots;
}
