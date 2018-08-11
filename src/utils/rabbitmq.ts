import RabbitMQ from '../lib/rabbitmq';


const rabbitMQ = new RabbitMQ(process.env.RABBITMQ_URL);

export default rabbitMQ;
