var clients =[]
const queueClients = []
const queueAnswer = []
const key = new Object()
const question = new Object()
module.exports ={
    setName: (name,socket,io)=>{
        const client = new Object()
        client.id = socket.id
        client.name = name
        client.point = 0
        client.key = false
        queueClients.unshift(client)
        io.to(socket.id).emit("profile",client)
        io.emit("listUser", queueClients);
        if(queueClients.length > 1 && !key.id) {
            // queueClients[queueClients.length-1].key = true
            const setRoot = queueClients[queueClients.length-1]
            key.id = setRoot.id
            key.name = setRoot.name
            io.to(key.id).emit("sendkey","true");
            // console.log(queueClients)
        }
        console.log(queueClients)
    },
    sendQuestionServer: (data,socket,io)=>{
        question.questions = data.questions
        question.result = data.kq
        io.emit("postQuestion",{question: data.questions, id: socket.id})
        let is = false
        setTimeout(()=>{
           let i = 0
           //let temp = queueClients
           while(i < queueAnswer.length){
                let temp = queueAnswer.pop()  
                if(temp.result === question.result){
                        for(let i = 0 ; i < queueClients.length ; i++){
                            let client = queueClients[i]
                            if(temp.id === client.id){
                                // queueClients[i].key = true
                                client.point += 10
                                key.id = client.id
                                key.name = client.name
                                io.emit("listUser", queueClients);
                                io.to(key.id).emit("sendkey","true");
                                is = true
                                return
                            }
                        }
                        return
                }
            }
            if(!is && queueClients.length>1){
                const setRoot = queueClients[queueClients.length-1]
                key.id = setRoot.id
                key.name = setRoot.name
                io.to(key.id).emit("sendkey","true");   
            }
            // queueClients[queueClients.length-1].key = true
            
        },15000)
        // console.log(question)
        // console.log(socket.id)
    },
    searchKey: (socket,io)=>{
        const setRoot = queueClients[queueClients.length-1]
        key.id = setRoot.id
        key.name = setRoot.name
        io.to(key.id).emit("sendkey","true");
    },
    sendAnswer:(data,socket,io)=>{
        queueAnswer.unshift({id:socket.id , result: data.result , name: data.name})
        io.emit("sendAnswerClient", queueAnswer);
    },
    disconnect: (socket,io)=>{
        // console.log('user disconnected'+socket.id);
        // console.log(key)
        if(queueClients.length > 1 && socket.id === key.id){
            const setRoot = queueClients[queueClients.length-1]
            key.id = setRoot.id
            key.name = setRoot.name
            io.to(key.id).emit("sendkey","true");
        }
        let queueTemp = []
        for( let i=0 ;  i < queueClients.length; i++){
            let c = queueClients[i];
            if(c.id == socket.id){
                queueClients.splice(i,1);
                break;
            }
        }
        io.emit("listUser", queueClients);
    },
    checkUser: (client,socket,io)=>{
        for( let i=0 ;  i< queueClients.length; ++i ){
            let c = queueClients[i];
            if(c.id === client.id && c.name === client.name){
                return  io.to(client.id).emit('checkResult', {result : true});
            }
        }
        return io.to(client.id).emit('checkResult', {result : false});
    },
    searchKey:(data,socket,io)=>{
        key.id = data.id
        key.name = data.name
        io.to(key.id).emit("sendkey","true");
    }
}