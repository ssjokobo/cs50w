document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});


function compose_email(reply=false, email=null) {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';

  // Clear out of prepopulate composition fields
  if (reply === true) {
    document.querySelector('#compose-recipients').value = email.sender;
    if (email.subject.substring(0, 4) === 'Re: ') {
      document.querySelector('#compose-subject').value = email.subject;
    } else {
      document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
    }
    document.querySelector('#compose-body').value = `\nOn ${email.timestamp} ${email.sender} wrote:\n${email.body}`;
  } else {
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';
  }

  // Sending
  document.querySelector('#compose-form').onsubmit = send_mail;
}


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails);

      // ... do something else with emails ...
      for (let i = 0; i < emails.length; i++) {
        let email = emails[i];
        // row
        const emailRow = document.createElement('div');
        emailRow.className = 'row';

        // Styling
        emailRow.style.height = '35px';
        if (i === 0){
          emailRow.style.border = 'solid black';
        } else {
          emailRow.style.borderLeft = 'solid black';
          emailRow.style.borderRight = 'solid black';
          emailRow.style.borderBottom = 'solid black';
        }

        if (email.read || mailbox === 'sent') {
          emailRow.style.background = 'lightgray';
        }

        // column: email that being communicated with
        const emailCom = document.createElement('div');
        emailCom.className = 'col-3';
        if (mailbox === 'sent') {
          emailCom.innerHTML = email.recipients;            
        } else {
          emailCom.innerHTML = email.sender;
        }

        // column: topic
        const emailSubject = document.createElement('div');
        emailSubject.className = 'col-6';
        emailSubject.innerHTML = email.subject;

        // column: timestamp
        const emailTime = document.createElement('div');
        emailTime.className = 'col-3';
        emailTime.innerHTML = email.timestamp;

        // fill columns into the row
        emailRow.append(emailCom);
        emailRow.append(emailSubject);
        emailRow.append(emailTime);

        // make clickable
        emailRow.addEventListener('click', function() {
          show_mail(email.id, mailbox);
        });

        // fill row into the DOM
        document.querySelector('#emails-view').append(emailRow);
      }
  });
}


function show_mail(emailId, mailbox) {
  // Show the selected mail and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';

  // Clear the view
  document.querySelector('#email-view').innerHTML = "";

  fetch(`/emails/${emailId}`)
        .then(response => response.json())
        .then(email => {
            console.log(email);

            // If unread, change to read
            if (email.read === false) {
              fetch(`/emails/${email.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    read: true
                })
              });
            }

          // Email headers
          const emailHeader = document.createElement('div');
          emailHeader.className = 'email-header';
          emailHeader.innerHTML = 
          `
          <b>From:</b> ${email.sender}<br>
          <b>To:</b> ${email.recipients}<br>
          <b>Subject:</b> ${email.subject}<br>
          <b>Timstamp:</b> ${email.timestamp}<br>
          `

          // Reply button
          const replyButton = document.createElement('button');
          replyButton.className = 'btn btn-sm btn-outline-primary';
          replyButton.id = 'reply';
          replyButton.innerHTML = 'Reply';

          // Archive button
          const archiveButton = document.createElement('button');
          archiveButton.className = 'btn btn-sm btn-outline-primary';
          archiveButton.id = 'archive';

          if (email.archived) {
            archiveButton.innerHTML = 'Unarchive';
          } else {
            archiveButton.innerHTML = 'Archive';
          }

          // Email body
          const emailBody = document.createElement('div');
          emailBody.className = 'email-body';
          emailBody.innerHTML = email.body;

          // Add to the DOM
          document.querySelector('#email-view').append(emailHeader);
          document.querySelector('#email-view').append(replyButton);
          document.querySelector('#email-view').append(' ');
          document.querySelector('#email-view').append(archiveButton);
          document.querySelector('#email-view').innerHTML += '<hr>';
          document.querySelector('#email-view').append(emailBody);

          document.querySelector('#archive').addEventListener('click', () => {
            fetch(`/emails/${emailId}`, {
              method: 'PUT',
              body: JSON.stringify({
                  archived: !email.archived
              })
            })
            .then(result => {
                console.log(result);
                load_mailbox('inbox');
            });
          });

          document.querySelector('#reply').addEventListener('click', () => {
            compose_email(true, email);
          });

          if (mailbox === 'sent') {
            document.querySelector('#archive').style.display = 'none';
          }
  });
}


function send_mail() {
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: document.querySelector('#compose-recipients').value,
      subject: document.querySelector('#compose-subject').value,
      body: document.querySelector('#compose-body').value
    })
  })
  .then(response => response.json())
  .then(result => {
      console.log(result);
      load_mailbox('sent');
  });
  
  // prevent form to actually submit
  return false;
};