"use client";
import React, { useState,useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
const Echo = () => {
  const { user } = useUser(); 

  console.log(user);


  
  
  const [formData, setFormData] = useState({
    echo_name: "",
    echo_title: "",
    echo_details: "",
    echo_message: "",
    sender_name: "", // Keep sender_name as a separate field
    attachment: "",
    echo_logo: "",
    add_questions: "",
  
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    if (!user) {
      console.error("User is not authenticated.");
      return;
    }


    const updatedFormData = {
      ...formData,
      user: user.id, // Clerk userId
    };


    try {
      const response = await fetch("/api/echoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData), 
        
        // Send user along with form data
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Echo created successfully:", result);
      } else {
        console.error("Failed to create Echo");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };




  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="echo_name"
          placeholder="echo_name"
          value={formData.echo_name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="echo_title"
          placeholder="echo_title"
          value={formData.echo_title}
          onChange={handleChange}
        />
        <input
          type="text"
          name="echo_details"
          placeholder="echo_details"
          value={formData.echo_details}
          onChange={handleChange}
        />
        <input
          type="text"
          name="echo_message"
          placeholder="echo_message"
          value={formData.echo_message}
          onChange={handleChange}
        />
        <input
          type="text"
          name="sender_name"
          placeholder="sender_name"
          value={formData.sender_name} // sender_name stays independent
          onChange={handleChange}
        />
        <input
          type="text"
          name="attachment"
          placeholder="attachment"
          value={formData.attachment}
          onChange={handleChange}
        />
         <input
          type="text"
          name="echo_logo"
          placeholder="echo_logo"
          value={formData.echo_logo}
          onChange={handleChange}
        /> 
        <input
          type="text"
          name="add_questions"
          placeholder="add questions"
          value={formData.add_questions}
          onChange={handleChange}
        />


        <Button type="submit">Create Echo</Button>
      </form>
    </div>
  );
};

export default Echo;
