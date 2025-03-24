
import axios from 'axios';

export const fetchCalendarData = async (startDate, endDate) => {
  try {
    const response = await axios.get(`/calendarfromtoenddate.json`, {
      params: { startDate, endDate },
    });

    console.log(response.data, 'response.data'); 

    return response.data.map((event) => ({
      id: event.id,
      title: event.summary,
      description: event.desc,
      start: new Date(event.start),
      end: new Date(event.end),
      meetingLink: event.link,
      candidate: `${event.user_det.candidate.candidate_firstName} ${event.user_det.candidate.candidate_lastName}`,
      jobTitle: event.job_id.jobRequest_Title,
    }));
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    return [];
  }
};

// Fetch details of a particular event
export const fetchEventDetails = async (eventId) => {
  try {
    const response = await axios.get(`/calendarmeeting.json`, {
      params: { id: eventId },
    });

    console.log(response.data, 'response.data'); // Log response for debugging

    const event = response.data;
    return {
      id: event.id,
      title: event.summary,
      description: event.desc,
      start: new Date(event.start),
      end: new Date(event.end),
      meetingLink: event.link,
      candidate: `${event.user_det.candidate.candidate_firstName} ${event.user_det.candidate.candidate_lastName}`,
      interviewer: `${event.user_det.handled_by.firstName} ${event.user_det.handled_by.lastName}`,
      jobTitle: event.job_id.jobRequest_Title,
      email: event.user_det.candidate.candidate_email,
    };
  } catch (error) {
    console.error('Error fetching event details:', error);
    return null;
  }
};
