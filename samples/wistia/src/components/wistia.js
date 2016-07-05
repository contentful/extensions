import axios from 'axios';

export default function (widget, projectId, url) {

  // DOM elements.
  const containerEl = document.querySelector('.thumbnails-container');
  const thumbnailsEl = document.querySelector('.thumbnail-items-container');
  const errorEl = document.querySelector('.error');
  const preloaderEl = document.querySelector('.preloader');
  const inputEl = document.getElementById('wistia-video-id');
  let activeThumbnailEl;

  widget.field.onValueChanged(onValueChanged);

  // Resize iframe in Contenful UI.
  widget.window.updateHeight();

  axios.get(url, {
      params: {
        project_id: projectId
      }
    })
    .then(response => {
      preloaderEl.style.display = 'none';
      containerEl.style.display = 'block';

      const ejsTemplate = require('ejs!./../templates/video-browser.ejs');

      thumbnailsEl.innerHTML = ejsTemplate({
        'data': response.data
      });

      // Pass value from Contentful to input element.
      inputEl.value = widget.field.getValue();

      const thumbnailEls = document.querySelectorAll('.thumbnail .btn');

      for (let i = 0; i < thumbnailEls.length; i++) {
        thumbnailEls[i].addEventListener('click', onThumbnailClick);
        if (inputEl.value && thumbnailEls[i].dataset.videoId == inputEl.value) {
          thumbnailEls[i].classList.add('active');
        }
      }
    })
    .catch(response => {
      preloaderEl.style.display = 'none';
      errorEl.style.display = 'block';
      console.error(response);
    });

  /**
   * Calls the callback every time the value of the field is changed by some external event
   * (e.g. when multiple editors are working on the same entry).
   * @param val The newly changed value.
   */
  function onValueChanged(val) {
    inputEl.value = val;
  }

  function onThumbnailClick(event) {
    if (activeThumbnailEl) {
      activeThumbnailEl.classList.remove('active');
    }
    event.currentTarget.classList.add('active');

    const embedId = event.currentTarget.dataset.videoId;

    // Show value in view.
    inputEl.value = embedId;

    activeThumbnailEl = event.currentTarget;

    widget.field.setValue(embedId);
  }
}




