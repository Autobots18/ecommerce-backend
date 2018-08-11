export function assertConnExists(target: any, key: string, descriptor: PropertyDescriptor) {
  const originalMethod: Function = descriptor.value;
  descriptor.value = function () {
    if (!this.conn) {
      throw new Error('RabbitMQ connection not yet created. Call connect() first.');
    }
    return originalMethod.apply(this, arguments);
  };
}
