import React from "react";
import MeetingTemplate from "../components/template/MeetingTemplate"; // Import the MeetingTemplate component

const Files = () => {
  return (
    <div>
      <h1>Files Page</h1>
      <p>Manage your files here.</p>

      {/* Render the MeetingTemplate component */}
      <MeetingTemplate />
    </div>
  );
};

export default Files;