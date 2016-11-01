import React, { Component } from 'react';

class QueueForm extends Component {
    /**
   * Event handler for form submission. This will use the formClick callback
   * to make the ajax request and clear the form.
   * preventDefault is used to prevent a page refresh.
   */
  handleClick(e) {
    e.preventDefault();
    const form = document.forms.addLink;
    const link = form.link.value;
    this.props.formClick(link)
    form.link.value = '';
  }
  
  render() {
    return (
      <form name='addLink'>
        <input id='link' type="text" name="link"></input>        
        <button onClick={this.handleClick.bind(this)} type="submit" value="Submit">Submit</button>
      </form>
    )
  }
}

export default QueueForm;