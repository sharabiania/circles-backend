export class LoggerService {
  constructor(tag) {
    this.tag = tag;
  }

  log(severity, message, ...params) {
    console.log(`${this.tag} - ${severity} - ${message}`, ...params)
  }

  error(message, ...params) {
    this.log('ERROR', message, ...params);
  }

  debug(message, ...params) {
    this.log('DEBUG', message, ...params);
  }
}