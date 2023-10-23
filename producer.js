const {Kafka} = require('./client');
const readline = require('readline');

const rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout
})

async function init(){
    const producer = await Kafka.producer();
    console.log('Creating Producer');

    await producer.connect();

    console.log('Connected the Producer');

    rl.setPrompt('> ');//for taking msg input as producer from cli
    rl.prompt();

    rl.on('line',async function(line){
        const [riderName,location] = line.split(' ');

        await producer.send({
            topic:"rider-updates",
            messages:[
                {
                    partition:location.toLowerCase() === "north"?0:1,
                    key:"location-update",
                    value:JSON.stringify({name:riderName,loc:location})
                }
            ]
        })
    }).on('close',async()=>{
        await producer.disconnect();
    })

    // await producer.send({
    //     topic:"rider-updates",
    //     messages:[
    //         {
    //             partition:0,//sending this msg to partition Number-0
    //             key:"location-update",
    //             value:JSON.stringify({name:"Delivery Guy-1",loc:"SOUTH"})
    //         }
    //     ]
    // })

    // await producer.disconnect();
}

init();