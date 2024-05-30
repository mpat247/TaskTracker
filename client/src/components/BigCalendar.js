import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './BigCalendar.css';

const localizer = momentLocalizer(moment);

const BigCalendar = ({ events }) => {
  return (
    <div className="big-calendar-container">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '70vh', width: '100%' }}
      />
    </div>
  );
};

export default BigCalendar;
