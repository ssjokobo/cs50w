document.addEventListener('DOMContentLoaded', function() {

  // Like buttons
  document.querySelectorAll('#like-button').forEach(likeButton => {
    likeButton.onclick = function() {
      const post_id = likeButton.value;
      const cookiesList = document.cookie.split(';');
      const csrfToken = getCsrfToken(cookiesList);

      fetch(`/like/${post_id}`, {
        method: 'PUT',
        headers: {"X-CSRFToken": csrfToken}
      })
      .then(result => {
          console.log(result);
          
          // Update DOM
          fetch(`/like/${post_id}`)
              .then(response => response.json())
              .then(like_data => {
                  console.log(like_data);
  
                  // Like button
                  if (like_data.liked){
                    likeButton.innerHTML = 'Liked';
                  } else {
                    likeButton.innerHTML = 'Like';
                  }
  
                  // Like counts
                  if (like_data.like_count > 1){
                    document.querySelector(`#like-count-${post_id}`).innerHTML = `${like_data.like_count} Likes`
                  } else if (like_data.like_count === 1){
                    document.querySelector(`#like-count-${post_id}`).innerHTML = '1 Like'
                  } else {
                    document.querySelector(`#like-count-${post_id}`).innerHTML = ''
                  }
  
              });
      });

    };
  })
  
  // Follow button
  followButton = document.querySelector('#follow-button');
  if (followButton != null) {
    followButton.onclick = function() {
      const profile_id = document.querySelector('#follow-button').value;
      const cookiesList = document.cookie.split(';');
      const csrfToken = getCsrfToken(cookiesList);

      fetch(`/follow/${profile_id}`, {
        method: 'PUT',
        headers: {"X-CSRFToken": csrfToken}
      })
      .then(result => {
        console.log(result);

          // Update DOM
          fetch(`/follow/${profile_id}`)
                .then(response => response.json())
                .then(follow_data => {
                    console.log(follow_data);
    
                    // Follow button
                    if (follow_data.followed){
                      document.querySelector('#follow-button').innerHTML = 'Followed';
                    } else {
                      document.querySelector('#follow-button').innerHTML = 'Follow';
                    }
    
                    // Following counts
                    if (follow_data.following_count > 1){
                      document.querySelector('#following-count').innerHTML = `${follow_data.following_count} Followings`
                    } else if (follow_data.following_count === 1){
                      document.querySelector('#following-count').innerHTML = '1 Following'
                    } else {
                      document.querySelector('#following-count').innerHTML = '0 Following'
                    }

                    // Follower counts
                    if (follow_data.follower_count > 1){
                      document.querySelector('#follower-count').innerHTML = `${follow_data.follower_count} Followers`
                    } else if (follow_data.follower_count === 1){
                      document.querySelector('#follower-count').innerHTML = '1 Follower'
                    } else {
                      document.querySelector('#follower-count').innerHTML = '0 Follower'
                    }
    
                });
      });
    };
  }

  // Edit buttons and form
  document.querySelectorAll('#edit-button').forEach(editButton => {
    editButton.onclick = function() {
      const post_id = editButton.value;
      
      document.querySelector(`#post-content-${post_id}`).style.display = 'none';
      document.querySelectorAll('#edit-button').forEach(button => {
        button.style.display = 'none';
      });

      const editForm = document.createElement('form');
      editForm.id = `edit-form-${post_id}`;
      editForm.className = 'edit-form';

      const textArea = document.createElement('textarea');
      textArea.className = 'form-control';
      textArea.id = `edit-content-${post_id}`;
      textArea.name = 'content';
      textArea.required = true;
      textArea.innerHTML = document.querySelector(`#post-content-${post_id}`).innerHTML;
      textArea.style.display = 'inline';

      const editButtonWrapper = document.createElement('div');
      editButtonWrapper.className = 'edit-button-wrapper';
      editButtonWrapper.id = `edit-button-wrapper-${post_id}`;
      editButtonWrapper.display = 'inline';

      const submitButton = document.createElement('input');
      submitButton.className = 'btn btn-primary';
      submitButton.id = `edit-submit-${post_id}`;
      submitButton.value = 'Save';
      submitButton.type = 'submit';
      submitButton.style.display = 'block';

      const cancelButton = document.createElement('input');
      cancelButton.className = 'btn btn-primary';
      cancelButton.id = `edit-cancel-${post_id}`;
      cancelButton.value = 'Cancel';
      cancelButton.type = 'submit';
      cancelButton.style.display = 'block';

      document.querySelector(`#edit-view-${post_id}`).append(editForm);
      document.querySelector(`#edit-form-${post_id}`).append(textArea);
      document.querySelector(`#edit-form-${post_id}`).append(editButtonWrapper);
      document.querySelector(`#edit-button-wrapper-${post_id}`).append(submitButton)
      document.querySelector(`#edit-button-wrapper-${post_id}`).append(cancelButton)

      document.querySelector(`#edit-form-${post_id}`).onsubmit = function() {
        const cookiesList = document.cookie.split(';');
        const csrfToken = getCsrfToken(cookiesList);
        const edited_content = document.querySelector(`#edit-content-${post_id}`).value

        fetch(`post/${post_id}/edit`, {
          method: 'POST',
          headers: {"X-CSRFToken": csrfToken},
          body: JSON.stringify({
            content: edited_content
          })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
        });

        document.querySelector(`#post-content-${post_id}`).style.display = 'inline';
        document.querySelector(`#post-content-${post_id}`).innerHTML = edited_content;
        document.querySelectorAll('#edit-button').forEach(button => {
          button.style.display = 'inline';
        });

        const editDiv = document.querySelector(`#edit-view-${post_id}`);
        while (editDiv.firstChild) {
          editDiv.removeChild(editDiv.firstChild);
        }
        
        return false;
      };

      document.querySelector(`#edit-cancel-${post_id}`).onclick = function() {
        
        document.querySelector(`#post-content-${post_id}`).style.display = 'inline';
        document.querySelectorAll('#edit-button').forEach(button => {
          button.style.display = 'inline';
        });

        const editDiv = document.querySelector(`#edit-view-${post_id}`);
        while (editDiv.firstChild) {
          editDiv.removeChild(editDiv.firstChild);
        }

        return false
      };

    };
  });

});

// CSRF
function getCsrfToken(cookiesList) {
  for (let i = 0; i < cookiesList.length; i++){
    const splittedCookie = cookiesList[i].split('=');
    if (splittedCookie[0] === 'csrftoken'){
      return splittedCookie[1]
    } else{
      return null
    }
  }
}