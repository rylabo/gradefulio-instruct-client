'use client'
import { Slider } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { Overview } from '../../lib/Course';
import axios from 'axios';

function Homeroom() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace '/api/courses' with your actual mocked endpoint
    axios.get('/api/course')
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []); // Empty dependency array means this effect runs once on mount

  if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Courses</h1>
      <ul>
        {/* {data.map((course: Overview) => (
          <li key={course['@id']}>{course['@id']}</li>
        ))} */}
      </ul>
    </div>
  );}

export default Homeroom