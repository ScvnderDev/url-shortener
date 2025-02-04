export class UserHelper {
  copyEntity(obj: any, payload: any): any {
    const allowedProperties = [
      // white list allowed properties
    ];

    for (const key of allowedProperties) {
      if (payload.hasOwnProperty(key)) {
        obj[key] = payload[key];
      }
    }
    return obj;
  }
}
