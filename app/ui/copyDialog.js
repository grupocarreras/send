const html = require('choo/html');
const { copyToClipboard } = require('../utils');

module.exports = function(name, url, emit) {
  const dialog = function(state, emit, close) {
    return html`
      <send-copy-dialog
        class="flex flex-col items-center text-center p-4 max-w-sm m-auto"
      >
        <h1 class="text-3xl font-bold my-4">
          ${state.translate('notifyUploadEncryptDone')}
        </h1>

        <div class="mb-2 px-1">
          <div class="inline-block mr-3">
            <label>
              ${state.translate('emailTo')}
            </label>
          </div>
          <input
            id="share-email-to"
            class="border rounded focus:border-blue-60 leading-normal my-1 py-1 px-2 h-8 dark:bg-grey-80"
            autocomplete="off"
            oninput="${toInputChanged}"
            type="email"
            placeholder="${state.translate('emailToPlaceholder')}"
            value=""
          />
          <label
            id="share-email-to-msg"
            for="share-email-to"
            class="block text-xs text-red-70"
          >
          </label>
        </div>

        <div class="mb-2 px-1">
          <div class="inline-block mr-3">
            <label>
              ${state.translate('emailFrom')}
            </label>
          </div>
          <input
            id="share-email-from"
            class="border rounded focus:border-blue-60 leading-normal my-1 py-1 px-2 h-8 dark:bg-grey-80"
            autocomplete="off"
            oninput="${fromInputChanged}"
            type="email"
            placeholder="${state.translate('emailFromPlaceholder')}"
            value=""
          />
          <label
            id="share-email-from-msg"
            for="share-email-from"
            class="block text-xs text-red-70"
          >
          </label>
        </div>

        <label>
          <textarea
            id="share-email-body"
            class="w-full my-4 border rounded-lg leading-loose h-24 px-2 py-1 dark:bg-grey-80"
          />
        </label>

        <button
          class="btn rounded-lg w-full flex-shrink-0 focus:outline"
          onclick="${send}"
          title="${state.translate('sendLinkButton')}"
        >
          ${state.translate('sendLinkButton')}
        </button>
        
      </send-copy-dialog>
    `;

    function toInputChanged() {
      const toInput = document.getElementById('share-email-to');
      const toMsg = document.getElementById('share-email-to-msg');
      const to = toInput.value;
      const length = to.length;

      if (
        to === null ||
        to === undefined ||
        length <= 0 ||
        !validateEmail(to)
      ) {
        toMsg.textContent = state.translate('emailInvalid');
      } else {
        toMsg.textContent = '';
      }
    }

    function fromInputChanged() {
      const fromInput = document.getElementById('share-email-from');
      const fromMsg = document.getElementById('share-email-from-msg');
      const from = fromInput.value;
      const length = from.length;

      if (
        from === null ||
        from === undefined ||
        length <= 0 ||
        !validateEmail(from)
      ) {
        fromMsg.textContent = state.translate('emailInvalid');
      } else {
        fromMsg.textContent = '';
      }
    }

    function validateEmail(email) {
      const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

      return expression.test(String(email).toLowerCase());
    }

    function send(event) {
      event.stopPropagation();
      //copyToClipboard(url);
      const toInput = document.getElementById('share-email-to');
      const toMsg = document.getElementById('share-email-to-msg');

      const fromInput = document.getElementById('share-email-from');
      const fromMsg = document.getElementById('share-email-from-msg');

      const bodyInput = document.getElementById('share-email-body');

      const to = toInput.value;
      const from = fromInput.value;
      const body = bodyInput.value;

      if (
        !(to === null || to === undefined || to.length <= 0) &&
        validateEmail(to) &&
        !(from === null || from === undefined || from.length <= 0) &&
        validateEmail(from) &&
        (to.endsWith('@grupocarreras.com') ||
          from.endsWith('@grupocarreras.com'))
      ) {
        const message = {
          from: from,
          to: to,
          body: body,
          url: url,
          name: name
        };

        emit('sendemail', message);

        event.target.textContent = state.translate('emailSended');
        setTimeout(close, 1000);
      } else {
        if (!to.endsWith('@grupocarreras.com')) {
          toMsg.textContent = state.translate('emailCorporateOnly');
        }
        if (!from.endsWith('@grupocarreras.com')) {
          fromMsg.textContent = state.translate('emailCorporateOnly');
        }
      }
    }
  };
  dialog.type = 'copy';
  return dialog;
};
