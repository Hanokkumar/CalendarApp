import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';
import { fetchCalendarData } from '../services/api';
import EventListModal from './EventListModal';
import { Box } from '@mui/material';
import EventDetailsModal from './EventDetailsModal';

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [showEventListModal, setShowEventListModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentView, setCurrentView] = useState("month");
  const [selectedEvent, setSelectedEvent] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
  useEffect(() => {
    loadData(currentView);
  }, [currentView]);

  // const loadData = async (view) => {
  //   let startDate, endDate;
  
  //   if (view === "month") {
  //     startDate = moment().startOf("month").toDate();
  //     endDate = moment().endOf("month").toDate();
  //   } else if (view === "week") {
  //     startDate = moment().startOf("week").toDate();
  //     endDate = moment().endOf("week").toDate();
  //   } else if (view === "day") {
  //     startDate = moment().startOf("day").toDate();
  //     endDate = moment().endOf("day").toDate();
  //   }
  
  //   const data = await fetchCalendarData(startDate, endDate);
    
  //   if (view === "month") {
  //     // Group by date for month view (existing code)
  //     const groupedEvents = {};
  //     data.forEach((event) => {
  //       const dateKey = moment(event.start).format("YYYY-MM-DD");
  //       if (!groupedEvents[dateKey]) {
  //         groupedEvents[dateKey] = {
  //           id: dateKey,
  //           title: `${event.jobTitle} (1)`,
  //           start: new Date(moment(event.start).startOf('day').toDate()),
  //           end: new Date(moment(event.start).startOf('day').add(1, 'hour').toDate()),
  //           jobTitle: event.jobTitle,
  //           candidate: event.candidate,
  //           count: 1,
  //           originalEvents: [event]
  //         };
  //       } else {
  //         groupedEvents[dateKey].count += 1;
  //         groupedEvents[dateKey].title = `${event.jobTitle} (${groupedEvents[dateKey].count})`;
  //         groupedEvents[dateKey].originalEvents.push(event);
  //       }
  //     });
  //     setEvents(Object.values(groupedEvents));
  //   } else {
  //     // Group by time for week/day views
  //     const groupedEvents = {};
  //     data.forEach((event) => {
  //       // Create time key with 30-minute precision
  //       const timeKey = moment(event.start)
  //         .startOf('minute')
  //         .subtract(moment(event.start).minute() % 30, 'minutes')
  //         .format("YYYY-MM-DD-HH-mm");
        
  //       if (!groupedEvents[timeKey]) {
  //         groupedEvents[timeKey] = {
  //           id: timeKey,
  //           title: `${moment(event.start).format("h:mm A")} (1)`,
  //           start: new Date(event.start),
  //           end: new Date(event.end),
  //           jobTitle: event.jobTitle,
  //           candidate: event.candidate,
  //           count: 1,
  //           originalEvents: [event]
  //         };
  //       } else {
  //         groupedEvents[timeKey].count += 1;
  //         groupedEvents[timeKey].title = `${moment(event.start).format("h:mm A")} (${groupedEvents[timeKey].count})`;
  //         groupedEvents[timeKey].originalEvents.push(event);
  //       }
  //     });
  //     setEvents(Object.values(groupedEvents));
  //   }
  // };

  
  
  
 
  
    const handleCloseDetails = () => {
      setShowDetailsModal(false);
    };
  
  const loadData = async (view) => {
    let startDate, endDate;
  
    if (view === "month") {
      startDate = moment().startOf("month").toDate();
      endDate = moment().endOf("month").toDate();
    } else if (view === "week") {
      startDate = moment().startOf("week").toDate();
      endDate = moment().endOf("week").toDate();
    } else if (view === "day") {
      startDate = moment().startOf("day").toDate();
      endDate = moment().endOf("day").toDate();
    }
  
    const data = await fetchCalendarData(startDate, endDate);
    
    if (view === "month") {
      // Group by date for month view
      const groupedEvents = {};
      data.forEach((event) => {
        const dateKey = moment(event.start).format("YYYY-MM-DD");
        if (!groupedEvents[dateKey]) {
          groupedEvents[dateKey] = {
            ...event,
            start: new Date(moment(event.start).startOf('day').toDate()),
            end: new Date(moment(event.start).startOf('day').add(1, 'hour').toDate()),
            count: 1,
            originalEvents: [event]
          };
        } else {
          groupedEvents[dateKey].count += 1;
          groupedEvents[dateKey].originalEvents.push(event);
        }
      });
      setEvents(Object.values(groupedEvents));
    } else {
      // For week/day views, use exact times but still group overlapping events
      const groupedEvents = {};
      data.forEach((event) => {
        const timeKey = `${moment(event.start).format("YYYY-MM-DD-HH:mm")}-${moment(event.end).format("HH:mm")}`;
        
        if (!groupedEvents[timeKey]) {
          groupedEvents[timeKey] = {
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
            count: 1,
            originalEvents: [event]
          };
        } else {
          groupedEvents[timeKey].count += 1;
          groupedEvents[timeKey].originalEvents.push(event);
        }
      });
      setEvents(Object.values(groupedEvents));
    }
  };
  
  // Modified handleEventClick
  const handleEventClick = (event, e) => {

    const eventsToShow = event.originalEvents || [event];
    console.log(eventsToShow)
    if(eventsToShow.length==1){
      setSelectedEvent(eventsToShow[0]);
      setShowDetailsModal(true);
    }else{
      setSelectedDateEvents(eventsToShow);
      setShowEventListModal(true);
    }
 
   
    
    const rect = e.target.getBoundingClientRect();
    
    if (currentView === "month") {
      // Original month view positioning
      setModalPosition({
        top: rect.top + window.scrollY,
        left: rect.right + window.scrollX + 30,
      });
    } else {
      // Week/day view positioning - left side with 100px offset
      setModalPosition({
        top: rect.top + window.scrollY - 170, // Slightly above event
        left: Math.max( // Ensure it doesn't go off left screen edge
          rect.left + window.scrollX + 135, 
          10 // Minimum 10px from left edge
        ),
      });
    }
  
    setAnchorEl(e.currentTarget);
  };

  const eventStyleGetter = (event) => {
    return {
      className: "event-popup",
      style: {
        backgroundColor: "lightblue",
        color: "black",
        borderRadius: "8px",
        padding: "10px 14px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
        fontSize: "14px",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        maxWidth: "250px",
        border: "1px solid #ddd",
        zIndex: 1000,
        whiteSpace: "nowrap",
      },
    };
  };

  // const EventComponent = ({ event }) => {
  //    return (
  //      <div className="event-popup">
  //        <span className="event-number">{event.count}</span>
  //        <div>
  //          <div>{event.jobTitle}</div>
  //          <div style={{ fontSize: "12px", fontWeight: "normal" }}>
  //            Interviewer: {event.candidate}
  //          </div>
  //          <div style={{ fontSize: "12px", fontWeight: "normal" }}>
  //          Time: {moment(event.start).format('h:mm A')} -{' '}
  //              {moment(event.end).format('h:mm A')}
  //          </div>
  //        </div>
  //      </div>
  //    );
  //  };
   
  const EventComponent = ({ event }) => {
    return (
      <div className="event-popup">
        <span className="event-number">{event.count}</span>
        <div>
          <div>{event.jobTitle}</div>
          <div style={{ fontSize: "12px", fontWeight: "normal" }}>
            Interviewer: {event.candidate}
          </div>
          <div style={{ fontSize: "10px", fontWeight: "normal" }}>
            Time: {moment(event.start).format('h:mm A')} -{' '}
            {moment(event.end).format('h:mm A')}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-container mb-5">
      <h2 className="calendar-header">
      <h2 className="calendar-header">
      {moment().startOf('month').format('Do MMMM')} to {moment().endOf('month').format('Do MMMM')}, {moment().format('YYYY')}
</h2>
      </h2>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "90vh", width: "100%" }}
        views={["month", "week", "day"]}
        defaultView="month"
        onView={(view) => {
          setCurrentView(view);
          loadData(view);
        }}
        step={60} // Ensure events are split hourly
        timeslots={1} // Ensure each slot is 1 hour
        min={new Date(2024, 7, 29, 0, 0)} // Calendar starts from midnight
        max={new Date(2024, 7, 29, 23, 59)} // Calendar ends at midnights
        selectable
        onSelectEvent={handleEventClick}
        eventPropGetter={eventStyleGetter}
        components={{ event: EventComponent }}
        
      />

      {showEventListModal && (
        <EventListModal
        style={{
          '--popover-top': `${modalPosition.top}px`,
          '--popover-left': `${modalPosition.left}px`,
        }}
          events={selectedDateEvents}
          anchorEl={anchorEl}
          onClose={() => setShowEventListModal(false)}
          position={modalPosition}
        />
      )}
      {showDetailsModal && (
        <>
        
          <Box
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1200, // Highest z-index
              width: "80%",
              maxWidth: "600px",
            }}
          >
            <EventDetailsModal
              event={{
                ...selectedEvent,
                date: moment(selectedEvent.start).format("DD MMM YYYY"),
                meetingLink: selectedEvent.meetingLink || "#",
                createdBy: selectedEvent.createdBy || "Admin",
              }}
              onClose={handleCloseDetails}
            />
          </Box>
        </>
      )}
      
    </div>
  );
};

export default Calendar;