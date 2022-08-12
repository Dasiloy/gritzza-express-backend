export class Utils {
  static isEmpty(obj: object): boolean {
    const objToArray = Object.keys(obj);
    return objToArray.length === 0;
  }
}
