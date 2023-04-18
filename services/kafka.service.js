const { Kafka } = require("kafkajs");
const constants = require("../utils/constants");

const kafka = new Kafka({
  clientId: "price-service",
  brokers: ["172.16.147.212:9092"],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "test-group" });

const run = async () => {
  // Producing
  await producer.connect();
  await producer.send({
    topic: "test-topic",
    messages: [{ value: "Hello KafkaJS user!" }],
  });

  // Consuming
  await consumer.connect();
  await consumer.subscribe({ topic: "test-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
    },
  });
};

function kafkaExec() {
  run().catch(console.error);
}

function getProducer({cliendId, brokers}) {
  const kafka = new Kafka({
    clientId: cliendId,
    brokers: brokers,
  });

  const producer = kafka.producer();
  return producer;
}
module.exports = {
  run: kafkaExec,
  getProducer:getProducer
};
