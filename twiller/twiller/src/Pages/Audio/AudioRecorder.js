import React, { useState } from 'react';
import { ReactMic } from 'react-mic';
import moment from 'moment-timezone';
import Authentication from './Authentication'; // Ensure path is correct

const AudioRecorder = () => {
  const [record, setRecord] = useState(false);
  const [blobURL, setBlobURL] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const MAX_DURATION = 300; // 5 minutes in seconds
  const MAX_SIZE = 100 * 1024 * 1024; // 100 MB
  const uploadTimeStart = 14; // 2 PM IST
  const uploadTimeEnd = 19; // 7 PM IST

  const isAllowedTime = () => {
    const now = moment().tz('Asia/Kolkata'); // IST
    const hours = now.hour();
    return hours >= uploadTimeStart && hours <= uploadTimeEnd;
  };

  const handleStop = (recordedBlob) => {
    const file = recordedBlob.blob;
    const fileSize = file.size;
    const audio = new Audio(URL.createObjectURL(file));

    audio.onloadedmetadata = () => {
      if (fileSize > MAX_SIZE) {
        setError('File size exceeds 100MB.');
      } else if (audio.duration > MAX_DURATION) {
        setError('Audio duration exceeds 5 minutes.');
      } else {
        setBlobURL(URL.createObjectURL(file));
        setAudioFile(file);
        setError('');
      }
    };
  };

  const handleUpload = () => {
    if (!isAllowedTime()) {
      setError('Audio upload is allowed only between 2 PM and 7 PM IST.');
      return;
    }

    if (!isAuthenticated) {
      setError('You need to authenticate before uploading audio.');
      return;
    }

    // Upload audio logic (Placeholder)
    console.log('Audio uploaded successfully!');
  };

  return (
    <div>
      <h2>Record Audio</h2>
      {isAuthenticated ? (
        <>
          <ReactMic
            record={record}
            className="sound-wave"
            onStop={handleStop}
            strokeColor="#000000"
            backgroundColor="#FF4081"
          />
          <button onClick={() => setRecord(true)}>Start Recording</button>
          <button onClick={() => setRecord(false)}>Stop Recording</button>
          <button onClick={handleUpload}>Upload Audio</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {blobURL && <audio src={blobURL} controls />}
        </>
      ) : (
        <Authentication onSuccess={() => setIsAuthenticated(true)} />
      )}
    </div>
  );
};

export default AudioRecorder;
