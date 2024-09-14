"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from "@clerk/nextjs";

const EchoList = () => {
  const [echoes, setEchoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser(); 

  useEffect(() => {
    if (user) { // Ensure user is available
      const fetchEchoes = async () => {
        try {
          console.log(user);
          const response = await axios.get(`/api/echolist/${user.id}`);
          setEchoes(response.data);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };

      fetchEchoes();
    }
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Your Echoes</h1>
      {echoes.length === 0 ? (
        <p>No echoes found</p>
      ) : (
        <ul>
          {echoes.map((echo) => (
            <li key={echo._id} className='bg-blue-500 mx-4 my-4 p-3 cursor-pointer flex'>
              <h2>{echo.echo_title}</h2>
              <p>{echo.echo_details}</p>
              <p>{echo.echo_message}</p>
              <p>Sender: {echo.sender_name}</p>
              {/* Add more details as needed */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EchoList;
