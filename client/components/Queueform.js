import React, { Component } from 'react';

const QueueForm = ({ formClick }) => {
/**
 * Event handler for form submission. This will use the formClick callback
 * to make the ajax request and clear the form.
 * preventDefault is used to prevent a page refresh.
 */
const handleClick = (clickEvent) => {
    clickEvent.preventDefault();
    const form = document.forms.addLink;
    const link = form.link;
    formClick(link.value)
    link.value = '';
  }
  
  return (
    <form name='addLink'>
      <input id='link' type="text" name="link"></input>
      <button onClick={handleClick}>Submit</button>
    </form>
  );
}

export default QueueForm;