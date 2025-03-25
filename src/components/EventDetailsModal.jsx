import React from "react";
import Modal from "react-modal";
import { Button, IconButton, Box, Typography } from "@mui/material";
import { Download, Visibility, Close } from "@mui/icons-material";
import img from "../logo_meet.png";
import moment from "moment";

Modal.setAppElement("#root");

const EventDetailsModal = ({ event, onClose }) => 
  (
  <Modal
    isOpen={true}
    onRequestClose={onClose}
    contentLabel="Event Details"
    style={{
      overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Gray background overlay
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      content: {
        position: "relative",
        inset: "auto",
        width: "90%",
        maxWidth: "500px",
        padding: 0,
        border: "none",
        background: "transparent",
        overflow: "visible",
      }
    }}
  >
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.25)",
        position: "relative",
      }}
    >

      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: "10px",
          right: "10px",
          color: "#0056b3",
        }}
      >
        <Close />
      </IconButton>

  
      <Box 
  sx={{ 
    flex: 1, 
    pr: { sm: 2 }, 
    mb: { xs: 2, sm: 0 },
    height: '300px',
    display: 'grid',
    padding: '20px',
    gridTemplateRows: 'repeat(auto-fill, minmax(30px, 1fr))',
    gap: '8px'
  }} 
  className='rightside'
>
        <Typography variant="subtitle1"><strong>Interview With:</strong> {event.candidate}</Typography>
        <Typography variant="subtitle1"><strong>Position:</strong> {event.jobTitle}</Typography>
        <Typography variant="subtitle1"><strong>Created By:</strong> {event.createdBy || '-'}</Typography>
        <Typography variant="subtitle1">
          <strong>Date:</strong> {moment(event.start).format("DD MMM YYYY")}
        </Typography>
        <Typography variant="subtitle1">
          <strong>Time:</strong> {moment(event.start).format("hh:mm A")} - {moment(event.end).format("hh:mm A")}
        </Typography>
        <Typography variant="subtitle1"><strong>Via:</strong> Google Meet</Typography>


        <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: 'wrap' }}>
          <Button 
            variant="outlined" 
            startIcon={<Download />}
            sx={{ fontSize: '0.75rem' }}
          >
            Resume.docx
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<Visibility />}
            sx={{ fontSize: '0.75rem' }}
          >
            Aadharcard
          </Button>
        </Box>
      </Box>

      <Box sx={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center",
        borderLeft: { sm: '1px solid #eee' },
        pl: { sm: 3 },
        ml: { sm: 2 },
        borderTop: { xs: '1px solid #eee', sm: 'none' },
        pt: { xs: 3, sm: 0 }
        

      }}>
        <img src={img} alt="Google Meet" style={{ width: 60, height: 60, marginBottom: 8 }} />
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ 
            mt: 1, 
            width: '100%',
            backgroundColor: '#1a73e8',
            '&:hover': {
              backgroundColor: '#1765cc',
            }
          }}
          onClick={() => window.open(event.meetingLink, "_blank")}
        >
          JOIN 
        </Button>
      </Box>
    </Box>
  </Modal>
);

export default EventDetailsModal;