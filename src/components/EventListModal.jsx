import React, { useEffect, useState } from "react";
import { IconButton, Typography, Box, Popover,Backdrop  } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import moment from "moment";
import "./List.css";
import EventDetailsModal from "./EventDetailsModal"; // Import your detailed modal
const EventListModal = ({ events, anchorEl, onClose, position }) => {
  const open = Boolean(anchorEl);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);


  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
    // onClose(); // Close the events popover
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);
 
  return (
    <>  
    <Popover
        open={Boolean(anchorEl) && !showDetailsModal} // Only show when details modal is closed
        anchorEl={anchorEl}
        onClose={onClose}
        anchorReference="anchorPosition"
        anchorPosition={position}
        sx={{
          "& .MuiPopover-paper": {
            zIndex: 1000, // Lower z-index
            background: "white",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            borderRadius: "10px",
            padding: "10px",
            minWidth: "250px",
          },
        }}
      >
      <div className="popover-container">
        {events.map((event) => (
          <Box key={event.id} className="event-item"
          onClick={() => handleEventClick(event)}
          sx={{ 
            cursor: 'pointer',
            '&:hover': { 
              backgroundColor: '#f5f5f5',
              transform: 'scale(1.01)',
              transition: 'all 0.2s ease'
            }
          }} >
            <div className="blue-line" />
            <Box className="event-content">
              <Box className="event-header">
                <Typography variant="subtitle1" className="event-title">
                  {event.jobTitle}
                </Typography>
                <Box className="event-actions">
                  <IconButton size="small" className="edit-icon">
                    <Edit fontSize="small" sx={{ color: "#4E94F5" }} />
                  </IconButton>
                  <IconButton size="small" className="delete-icon">
                    <Delete fontSize="small" sx={{ color: "#FF4C4C" }} />
                  </IconButton>
                </Box>
              </Box>
              <Typography variant="body2" className="event-info">
                <strong>Round:</strong> {event.round} | Interviewer:{" "}
                {event.candidate}
              </Typography>
              <Typography variant="body2" className="event-date-time">
                <strong>Date:</strong> {moment(event.start).format("DD MMM YYYY")}
              </Typography>
              <Typography variant="body2" className="event-date-time">
                <strong>Time:</strong>{" "}
                {moment(event.start).format("hh:mm A")} -{" "}
                {moment(event.end).format("hh:mm A")}
              </Typography>
            </Box>
          </Box>
        ))}
      </div>
    </Popover>
      {/* Meeting Details Modal (higher z-index) */}
      {showDetailsModal && (
        <>
          {/* <Backdrop
            open={true}
            sx={{
              zIndex: 1100, // Between events popover and details modal
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
            onClick={handleCloseDetails}
          /> */}
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
    </>
  );
};

export default EventListModal;
