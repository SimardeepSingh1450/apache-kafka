const {Kafka} = require('./client');
const group = process.argv[2];

async function init(){
    // const consumer = Kafka.consumer({groupId:"user-1"})
    const consumer = Kafka.consumer({groupId:group})
    await consumer.connect();

    //Using pub/sub model
    await consumer.subscribe({topics:["rider-updates"],fromBeginning:true});

    await consumer.run({
        eachMessage: async({topic,partition,message,heartbeat,pause}) => {
            // console.log(`TOPIC:[${topic}] PART:[${partition}] MESSAGE:[${message.toString()}]`);
            console.log(`GROUP: ${group} TOPIC:[${topic}] PART:[${partition}] MESSAGE:`,message.value.toString());
        }
    })

}

init();