import Keychain from './keychain';
import { arrayToB64 } from './utils';
import { sendEmail } from './api';

export default class EmailSender {
  constructor(obj) {
    this.message = obj;
  }
  async send() {
    console.info(this.message);
    try {
      const result = await sendEmail(this.message);
    } catch (e) {
      if (e.message === '404') {
      }
      // ignore other errors
      console.error(e);
    }
    return true;
  }
}
