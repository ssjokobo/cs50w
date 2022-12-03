document.addEventListener('DOMContentLoaded', function() {

  document.querySelector('#favorite-button').onclick = function() {
      const game_id = document.querySelector('#favorite-button').value;
      const cookiesList = document.cookie.split(';');
      const csrfToken = getCsrfToken(cookiesList);

      fetch(`/favorites/${game_id}`, {
          method: 'PUT',
          headers: {"X-CSRFToken": csrfToken}
        })
        .then(result => {
          console.log(result);
        });

      const fav_stat = document.querySelector('#favorite-button')
      if (fav_stat.innerHTML === 'Faved') {
        fav_stat.innerHTML = 'Fave';
      } else {
        fav_stat.innerHTML = 'Faved';
      }
  }

})


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